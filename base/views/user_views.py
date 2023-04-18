from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser 
from rest_framework.response import Response

from django.contrib.auth.models import User 
from base.models import * 
#from base.creators import creators
from base.serializers import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status

from decimal import *



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items(): 
            data[k] = v 

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try: 
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
            email = data['email'],
            password = make_password(data['password']),
        
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message  = {'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request): 
    
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data 

    # currently full name is stored in first name 
    # first_name is a field of the default sqlLite User model, and we are just 
    # using that for now 
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']



    # we do not want to update password if they do not have one yet 
    # make_password() takes in the string password and hashes it 
    if data['password'] != '': 
        user.password = make_password(data['password'])

    # saves the data 
    user.save()

    return Response(serializer.data)



# submitUserOrder(request)
# takes user when they buy a share/token
# updates their balance accordingly 
# updates their portfolio accordingly 
# right now just buys one share, will update quantity and buy sell later 
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def submitUserOrder(request):
    # CHANGE send over seller id when you un-hardcode the seller being johannwest

    # The margin for the market making 
    MARGIN = Decimal(0.01)
    BID_INCREMENT = Decimal(0.015)

    data = request.data
    pk = data['pk']
    buy_sell = data['buy_sell']
    order_price = Decimal(data['price'])
    #quantity = int(data['quantity'])
    creator_obj = Creator.objects.get(_id=pk)

    if buy_sell == 'buy' and request.user.profile.balance > order_price: 
        try: 
            order = buyOrderShare.objects.create(
                user = request.user,
                creator = creator_obj,
                price = order_price,
                isFulfilled = False,
            )
            serializer = buyOrderShareSerializer(order, many=False)

        except:
            message  = {'detail':'Could not create OrderShare (failed in buy try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    elif buy_sell == 'sell': 
        try:
            chosen_share = CreatorShare.objects.filter(creator = creator_obj).filter(in_transit = False).filter(user = request.user)[0]
            order = sellOrderShare.objects.create(
                user = request.user,
                creator = creator_obj,
                price = order_price,
                isFulfilled = False,
                share = chosen_share,
            )
            chosen_share.in_transit = True 
            chosen_share.save()
            serializer = sellOrderShareSerializer(order, many=False)

        except:
            message  = {'detail':'Could not create OrderShare (failed in sell try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    else: 
        message  = {'detail':'Could not create OrderShare (order type not buy or sell, or user does not have enough balance)'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    #####

    # Search for existing matching sell order 
    # Get mirrored orders with same creator 
    #   Of those order search for one with price 'in range' 
    #       Match orders : user who is buying gets ownership of share, subtract price from balance 
    #                      user who is selling loses ownership of share, add price to balance 


    # The process of matching an order can and probably should be its own function, may be used elsewhere 
    if (buy_sell == 'buy'):

        creator_sell_order_arr = sellOrderShare.objects.filter(isFulfilled = False).filter(creator = creator_obj).exclude(user = request.user).order_by('price')
        for i in creator_sell_order_arr: 
            print(i)
        
        found = False 
        for i in creator_sell_order_arr: 
            # search for sell order with a price less than or equal to 99% of the buy order, you keep the 1%
            if i.price <= (order_price * (Decimal(1.00) - MARGIN)): 
                #FOUND MATCH 
                found = True 
                match_sell_order = i 
                break

        if found: 

            print('Order :', order )
            print('Match sell order :', match_sell_order)

            buyer = request.user
            seller = match_sell_order.user

            #Transfer share 
            share = match_sell_order.share 
            share.user = buyer

            #Mark this share as the share for both orders
            order.share = share 
            match_sell_order.share = share 

            #Mark both orders as fulfilled 
            order.isFulfilled = True 
            match_sell_order.isFulfilled = True 
            
            #Subtract balance from buyer 
            # buyer.profile.balance = buyer_current_balance - order_price
            updateUserBalance(buyer, False, order.price)

            #Add balance to seller 
            # seller.profile.balance = seller_current_balance + match_sell_order.price
            updateUserBalance(seller, True, match_sell_order.price)

            #Calculate profit 
            profit = order.price - match_sell_order.price
            print('Market making profit:', profit)

            #Mark share as NO LONGER in transit 
            share.in_transit = False 

            order.save()
            match_sell_order.save()
            share.save()
            buyer.save()
            seller.save()
            
            serializer = buyOrderShareSerializer(order, many=False)
            print('Match Found: ', match_sell_order)


        else: 
            order.save()
            print('No match found, order will be backlogged')
            # do not match, leave order be 

        # Buy price tracking update 
        creator_obj.price = (creator_obj.price * (Decimal(1.00) + (BID_INCREMENT)))
        creator_obj.save()
    
        #Add to price log 
        new_price_log = creatorPriceLog.objects.create(
                creator = creator_obj,
                cur_price = creator_obj.price,
            )
        new_price_log.save()

        return Response(serializer.data)




        # CHANGE EVENTUALLY for optmiz CreatorShare should not be its own obj see figma notes 
        #transfer share from seller to buyer 
        # get the array of shares 
        # 1. get arr of CreatorShares owned by our seller
        # 2. get arr of CreatorShares of the Creator, isolate the first in arr they are fungible


    # Search for existing matching buy order 
    elif (buy_sell == 'sell'): 

        # order by highest price to lowest price, you want to fulfill the order for the user who is willing to pay the most first  
        creator_buy_order_arr = buyOrderShare.objects.filter(isFulfilled = False).filter(creator = creator_obj).exclude(user = request.user).order_by('-price')
        for i in creator_buy_order_arr: 
            print(i)


        found = False 
        # search for a buy order that is greater or equal to 101% of the sell order price, you keep the 1% 
        # IMPLEMENT EDGE CASE : there are buy orders greater than the sell order price but not by a whole 1%
        for i in creator_buy_order_arr: 
            # checks to see if buy order we are iterated on is in the right price range, and they buyer has the funds
            if i.price >= (order_price * (Decimal(1.00) + MARGIN)) and i.user.profile.balance >= order.price: 
                #FOUND MATCH 
                found = True 
                match_buy_order = i 
                break

        if found: 

            print('Order :', order )
            print('Match buy order :', match_buy_order)

            seller = request.user
            buyer = match_buy_order.user

            #Transfer share 
            share = order.share
            share.user = buyer

            #Mark this share as the share for both orders (already marked for 'order' in init)
            match_buy_order.share = share 

            #Mark both orders as fulfilled 
            order.isFulfilled = True 
            match_buy_order.isFulfilled = True 
            
            #Subtract balance from buyer 
            # We matched to a buy order, so the buyer pays the price they set
            # buyer.profile.balance = buyer_current_balance - match_buy_order.price
            updateUserBalance(buyer, False, match_buy_order.price)

            #Add balance to seller 
            # This is a sell order, so seller gets the price they set
            # seller.profile.balance = seller_current_balance + order.price
            updateUserBalance(seller, True, order.price)

            #Calculate profit 
            profit = match_buy_order.price - order.price
            print('Market making profit:', profit)

            #Mark share as NO LONGER in transit 
            share.in_transit = False 

            order.save()
            match_buy_order.save()
            share.save()
            buyer.save()
            seller.save()

            serializer = sellOrderShareSerializer(order, many=False)
            print('Match Found: ', match_buy_order)

        else: 
            order.save()
            print('No match found, order will be backlogged')
            # do not match, leave order be 
        
        # SELL price tracking update 
        creator_obj.price = (creator_obj.price * (Decimal(1.00) - (BID_INCREMENT)))
        creator_obj.save()

        #Add to price log 
        new_price_log = creatorPriceLog.objects.create(
                creator = creator_obj,
                cur_price = creator_obj.price,
            )
        new_price_log.save()


        return Response(serializer.data)








# updateUserTransactionV2()
# this requires a change in logic, uses two signals now 
# takes user when they buy a share/token
# updates their balance accordingly 
# updates their portfolio accordingly 
# works with quantities  
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def submitUserOrderV2(request):

    # The margin for the market making 
    MARGIN = Decimal(0.01)
    BID_INCREMENT = Decimal(0.015)

    print(request)

    data = request.data
    pk = data['pk']
    buy_sell = data['buy_sell']
    order_price = Decimal(data['price'])
    print(data)
    order_quantity = int(data['quantity'])
    creator_obj = Creator.objects.get(_id=pk)

    if buy_sell == 'buy' and request.user.profile.balance > order_price: 
        try: 
            order = buyOrderShare.objects.create(
                user = request.user,
                creator = creator_obj,
                price = order_price,
                quantity = order_quantity,
                isFulfilled = False,
            )

            update = updateBuyOrderShare(order)
            print('update:', update)
            if update is True: 
                print('ORDER MATCHED')
            else: 
                print('ORDER NOT MATCHED, going to Backlog')

            serializer = buyOrderShareSerializer(order, many=False)
            #TEMP RETURN 
            updateCreatorPrice(creator_obj, True, BID_INCREMENT, order_quantity)

            return Response(serializer.data)

        except:
            message  = {'detail':'Could not create OrderShare (failed in buy try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    elif buy_sell == 'sell': 
        try:
            valid_share_count = len(CreatorShare.objects.filter(creator = creator_obj).filter(in_transit = False).filter(user = request.user))
        
            if valid_share_count < order_quantity: 
                message  = {'detail': 'Could not create OrderShare (user does not have enough shares to sell)'}
                print("Could not create OrderShare (user does not have enough shares to sell) - valid_share_count=", valid_share_count)
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            else: 
                # obtain list of valid share ids 
                print("allocating sell order shares now...")
                print("valid_share_count = ", valid_share_count)
                chosen_shares_ids = []
                for i in range(order_quantity):
                    share = CreatorShare.objects.filter(creator = creator_obj).filter(in_transit = False).filter(user = request.user)[0]
                    print("FOUND SHARE: ", share._id)

                    share.in_transit = True 
                    share.save()
                    chosen_shares_ids.append(share._id)

                print("Chosen Share Ids: ", chosen_shares_ids)
                

                order = sellOrderShare.objects.create(
                    user = request.user,
                    creator = creator_obj,
                    price = order_price,
                    quantity = order_quantity,
                    isFulfilled = False,
                    shares_list = chosen_shares_ids,
                )
                update = updateSellOrderShare(order)
                if update: 
                    print('ORDER MATCHED')
                else: 
                    print('ORDER NOT MATCHED, going to Backlog')

                serializer = sellOrderShareSerializer(order, many=False)
                #TEMP return

                updateCreatorPrice(creator_obj, False, BID_INCREMENT, order_quantity)
        
                return Response(serializer.data)
                

        except:
            message  = {'detail':'Could not create OrderShare (failed in sell try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    else: 
        message  = {'detail':'Could not create OrderShare (order type not buy or sell, or user does not have enough balance)'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    #####

  
def submitUserOrderV2INTERNAL(request):

    # The margin for the market making 
    MARGIN = Decimal(0.01)
    BID_INCREMENT = Decimal(0.015)

    print(request)

    data = request.data
    pk = data['pk']
    buy_sell = data['buy_sell']
    order_price = Decimal(data['price'])
    print(data)
    order_quantity = int(data['quantity'])
    creator_obj = Creator.objects.get(_id=pk)

    if buy_sell == 'buy' and request.user.profile.balance > order_price: 
        try: 
            order = buyOrderShare.objects.create(
                user = request.user,
                creator = creator_obj,
                price = order_price,
                quantity = order_quantity,
                isFulfilled = False,
            )

            update = updateBuyOrderShare(order)
            print('update:', update)
            if update is True: 
                print('ORDER MATCHED')
            else: 
                print('ORDER NOT MATCHED, going to Backlog')

            serializer = buyOrderShareSerializer(order, many=False)
            #TEMP RETURN 
            updateCreatorPrice(creator_obj, True, BID_INCREMENT, order_quantity)

            return Response(serializer.data)

        except:
            message  = {'detail':'Could not create OrderShare (failed in buy try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    elif buy_sell == 'sell': 
        try:
            valid_share_count = len(CreatorShare.objects.filter(creator = creator_obj).filter(in_transit = False).filter(user = request.user))
        
            if valid_share_count < order_quantity: 
                message  = {'detail': 'Could not create OrderShare (user does not have enough shares to sell)'}
                print("Could not create OrderShare (user does not have enough shares to sell) - valid_share_count=", valid_share_count)
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            else: 
                # obtain list of valid share ids 
                print("allocating sell order shares now...")
                print("valid_share_count = ", valid_share_count)
                chosen_shares_ids = []
                for i in range(order_quantity):
                    share = CreatorShare.objects.filter(creator = creator_obj).filter(in_transit = False).filter(user = request.user)[0]
                    print("FOUND SHARE: ", share._id)

                    share.in_transit = True 
                    share.save()
                    chosen_shares_ids.append(share._id)

                print("Chosen Share Ids: ", chosen_shares_ids)
                

                order = sellOrderShare.objects.create(
                    user = request.user,
                    creator = creator_obj,
                    price = order_price,
                    quantity = order_quantity,
                    isFulfilled = False,
                    shares_list = chosen_shares_ids,
                )
                update = updateSellOrderShare(order)
                if update: 
                    print('ORDER MATCHED')
                else: 
                    print('ORDER NOT MATCHED, going to Backlog')

                serializer = sellOrderShareSerializer(order, many=False)
                #TEMP return

                updateCreatorPrice(creator_obj, False, BID_INCREMENT, order_quantity)
        
                return Response(serializer.data)
                

        except:
            message  = {'detail':'Could not create OrderShare (failed in sell try except)'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

    else: 
        message  = {'detail':'Could not create OrderShare (order type not buy or sell, or user does not have enough balance)'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    #####

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request): 
    user = request.user
    serializer = UserSerializer(user, many=False)


    # WORKOUT TO GET PROFILE BALANCE, copys 
    # data to 'info ' to get raw dic, edits dic, then returns 
    # new 'info' dic (previous return above current return)
    bal = user.profile.balance
    info = serializer.data 
    info['balance'] = bal
    
    #return Response(serializer.data)
    return Response(info)

# users route (only admin should be able to see, needs special permission)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request): 
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserShares(request): 
    shares = CreatorShare.objects.filter(user = request.user)
    serializer = CreatorShareSerializer(shares, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserBuyOrders(request): 
    shares = buyOrderShare.objects.filter(user = request.user)
    serializer = buyOrderShareSerializer(shares, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserSellOrders(request): 
    shares = sellOrderShare.objects.filter(user = request.user)
    serializer = sellOrderShareSerializer(shares, many=True)
    return Response(serializer.data)


# updateUserBalance()
# params : 
#  user - the user,  positive - boolean, True for adding balance False for subtracting,  balance_change - balance change
#   internally used function to update a users balance, creates a data entry 
#   for every balance change for RIGOROUS ACCOUNTING :)))))))))
#   not an api call
def updateUserBalance(user, positive, balance_change):

    old_balance = user.profile.balance 

    if positive: 
        try: 
            BalanceChange.objects.create(
                user = user,
                changeDirection = "positive" ,
                changeAmount = Decimal(balance_change),
                oldTotalBalance = old_balance, 
                newTotalBalance = old_balance + Decimal(balance_change)
            )
            

        except:
            print('Updating user balance positive failed id :', user.id)
            return False

        user.profile.balance = old_balance + Decimal(balance_change)
        print('updateUserBalance, oldbalance/new balance :', old_balance, '/',user.profile.balance)
        user.save()
        
        return True 

    if not positive: 
        try: 
            BalanceChange.objects.create(
                user = user,
                changeDirection = "negative" ,
                changeAmount = Decimal(balance_change),
                oldTotalBalance = old_balance, 
                newTotalBalance = old_balance - Decimal(balance_change)
            )
            

        except:
            print('Updating user balance negative failed id :', user.id)
            return False

        
        user.profile.balance = old_balance - Decimal(balance_change)
        user.save()

        if user.profile.balance < 0: 
            print("USER BALANCE WENT NEGATIVE, id :", user.id)

        return True 
    
def updateCreatorPrice(creator_obj, positive, BID_INCREMENT, quant): 
    price = creator_obj.price
    if positive: 
        for i in range(quant):
            price = (price * (Decimal(1.00) + (BID_INCREMENT)))
        creator_obj.price = price
        creator_obj.save()
    else:
        for i in range(quant):
            price = (price * (Decimal(1.00) - (BID_INCREMENT)))
        creator_obj.price = price
        creator_obj.save()

    #Add to price log 
    new_price_log = creatorPriceLog.objects.create(
            creator = creator_obj,
            cur_price = creator_obj.price,
        )
    new_price_log.save()

    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrderHistory(request): 
    buyOrders = buyOrderShare.objects.filter(user = request.user)
    sellOrders = sellOrderShare.objects.filter(user = request.user)
    buy_serializer = buyOrderShareSerializer(buyOrders, many=True)
    sell_serializer = sellOrderShareSerializer(sellOrders, many=True)

    combined_data = buy_serializer.data + sell_serializer.data 
    sorted_data = sorted(combined_data, key=lambda k: k['createdAt'], reverse=True)

    key = 0
    for i in sorted_data: 
        i['key'] = key
        key += 1 

    return Response(sorted_data)


      

####### test out of signal 






# updateSellOrderShare()
# fires when a sell order is created 
# searchs through buy orders of the same creator and
# greater or equal quantity and finds out 
# if any of those buy orders can now fulfilled with the with the exiting sell orders and the creation 
# of this new sell order 
def updateSellOrderShare(order): 
    print("FIRED updateSellOrderShare")
    MARGIN = Decimal(0.01)

    min_buy_price = order.price * (Decimal(1.00) + MARGIN)

    searching = buyOrderShare.objects.filter(isFulfilled = False)
    print('.')
    searching = searching.filter(creator = order.creator)
    print('..')

    searching = searching.filter(quantity__gte = order.quantity)
    searching = searching.filter(price__gte = min_buy_price)
    print('...')


     #check this order
    result = checkForExisitingReflectiveOrders(order, 'sell')
    print('Checked this order, checking others...')

    #check other orders that may be affected by the creation of this order 
    for buy_order in searching: 
        checkForExisitingReflectiveOrders(buy_order, 'buy')

    return result 



# updateBuyOrderShare()
# fires when a buy order is created 
# searchs through sell orders of the same creator and
# greater or equal quantity and finds out 
# if any of those sell orders can now fulfilled with the with the exisitng buy orders and the creation 
# of this new buy order 
def updateBuyOrderShare(order): 
    print("FIRED updateBuyOrderShare")
    MARGIN = Decimal(0.01)

    max_sell_price = order.price * (Decimal(1.00) - MARGIN)

    searching = sellOrderShare.objects.filter(isFulfilled = False)
    searching = searching.filter(creator = order.creator)
    searching = searching.filter(quantity__gte = order.quantity)
    searching = searching.filter(price__lte = max_sell_price)
    
    #check this order
    result = checkForExisitingReflectiveOrders(order, 'buy')

    #check other orders that may be affected by the creation of this order 
    for sell_order in searching: 
        checkForExisitingReflectiveOrders(sell_order, 'sell')

    return result 


def combinationSum(candidates, target):
    def backtrack(combination, start, target, indexes):
        if target == 0:
            result.append(combination)
            result_indexes.append(indexes)
            return
        if target < 0:
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i-1]:
                continue
            backtrack(combination + [candidates[i]], i+1, target-candidates[i], indexes + [i])
    #it should already be sorted
    #candidates.sort()
    result = []
    result_indexes = []
    backtrack([], 0, target, [])
    return result, result_indexes






# checkForExisitingReflectiveOrders() 
# takes an order, and checks possibly reflective orders to see if any combination 
# of them can match up to fulfill this exisitng order 
def checkForExisitingReflectiveOrders(order, buy_sell): 
    print('running checkForExisting...')
    MARGIN = Decimal(0.01)
    BID_INCREMENT = Decimal(0.015)

    creator_obj = order.creator
    order_user = order.user
    order_quant = order.quantity 
    order_price = order.price
    if buy_sell == 'buy': 
        print('buy if')
        max_sell_price = order_price * (Decimal(1.00) + MARGIN)
        possible_orders = sellOrderShare.objects.filter(isFulfilled = False)
        possible_orders = possible_orders.filter(creator = creator_obj)
        possible_orders = possible_orders.filter(quantity__lte = order_quant)
        possible_orders = possible_orders.filter(price__lte = max_sell_price)
        possible_orders = possible_orders.exclude(user = order_user)
        possible_orders = possible_orders.order_by('quantity')

        quant_list = []
        for i in possible_orders: 
            quant_list.append(i.quantity)

        print("quant_list, order_quant:",quant_list, order_quant)
        result, result_indexes = combinationSum(quant_list, order_quant)

        if len(result) > 0: 
            result = result[0]
            result_indexes = result_indexes[0]

            print('result quant sum found:', result)
            print('result indexes:', result_indexes)

            order.shares_list = []


            #these are you chosen orders 
            for i in result_indexes: 
                # for each do the transfer 
                print(possible_orders[i]._id, possible_orders[i].quantity)
                sell_order = possible_orders[i]
                sell_shares_list = sell_order.shares_list.copy()
                for j in range(sell_order.quantity): 
                    print('for loop')
                    share_id = sell_shares_list.pop()
                    share = CreatorShare.objects.get(_id = share_id)
                    print('share._id',share._id)
                    share.user = order.user
                    share.in_transit = False 
                    #mark it on shares_list
                    order.shares_list.append(share._id)
                    share.save()
                    
                #update buyer balance 
                buyer_balance_change = order_price * order_quant
                updateUserBalance(order_user, False, buyer_balance_change)
                #update seller balance 
                seller_balance_change = sell_order.price * sell_order.quantity
                updateUserBalance(sell_order.user, True, seller_balance_change)

                sell_order.isFulfilled = True 
                sell_order.save()

            order.isFulfilled = True 
            order.save()
            print('returning true...')
            return True 
        else: 
            # no matching sum of quanitites found 
            print("checkForExisitingReflectiveOrders(), no matching combo of orders found")
            return False 


    elif  buy_sell == 'sell':
        order_shareslist = order.shares_list.copy()

        # get all candidate buy orders (based on isFulfilled, creator, quant, price)
        print('sell elif')

        min_buy_price = order_price * (Decimal(1.00) + MARGIN)
        possible_orders = buyOrderShare.objects.filter(isFulfilled = False)
        possible_orders = possible_orders.filter(creator = creator_obj)
        possible_orders = possible_orders.filter(quantity__lte = order_quant)
        possible_orders = possible_orders.filter(price__gte = min_buy_price)
        possible_orders = possible_orders.exclude(user = order_user)
        possible_orders = possible_orders.order_by('quantity')

        # You have list of candidate buy orders, you have target sell order quant, do 
        # combination sum algo to see if any of the buy order quantities sum to sell order quantity 
        quant_list = []
        for i in possible_orders: 
            quant_list.append(i.quantity)

        print("quant_list, order_quant:",quant_list, order_quant)
        result, result_indexes = combinationSum(quant_list, order_quant)

        if len(result) > 0: 
            result = result[0]
            result_indexes = result_indexes[0]

            print('result found:', result)
            print('result indexes:', result_indexes)

            #share list to distrubute 
            print('sharelist:',order_shareslist)

            #these are you chosen orders 
            for i in result_indexes: 
                # for each do the transfer 
                print(possible_orders[i]._id, possible_orders[i].quantity)
                buy_order = possible_orders[i]
                buy_order_shares_list = []
                for j in range(buy_order.quantity): 
                    print('for loop')
                    share_id = order_shareslist.pop()
                    share = CreatorShare.objects.get(_id = share_id)
                    print('share._id',share._id)
                    share.user = buy_order.user
                    share.in_transit = False
                    #mark it on shares_list
                    buy_order_shares_list.append(share._id)
                    print('buy shareslist', buy_order_shares_list)
                

                    share.save()
                    
                buy_order.shares_list = buy_order_shares_list
                #update buyer balance 
                buyer_balance_change = buy_order.price * buy_order.quantity
                updateUserBalance(buy_order.user, False, buyer_balance_change)
                #update seller balance 
                seller_balance_change = order_price * buy_order.quantity
                updateUserBalance(order_user, True, seller_balance_change)

                buy_order.isFulfilled = True 
                buy_order.save()

            order.isFulfilled = True 
            order.save()
                
                

            return True 
        else: 
            # no matching sum of quanitites found 
            print("checkForExisitingReflectiveOrders(), no matching combo of orders found")
            return False 

    else: 
        print("ALERT checkForExisitingReflectiveOrders(), buy_sell was not 'buy' or 'sell' ")
        return False 
    



#  if (buy_sell == 'buy'):

#         creator_sell_order_arr = sellOrderShare.objects.filter(isFulfilled = False).filter(creator = creator_obj).exclude(user = request.user).order_by('price')
#         for i in creator_sell_order_arr: 
#             print(i)
        
#         found = False 
#         for i in creator_sell_order_arr: 
#             # search for sell order with a price less than or equal to 99% of the buy order, you keep the 1%
#             if i.price <= (order_price * (Decimal(1.00) - MARGIN)): 
#                 #FOUND MATCH 
#                 found = True 
#                 match_sell_order = i 
#                 break

#         if found: 

#             print('Order :', order )
#             print('Match sell order :', match_sell_order)

#             buyer = request.user
#             seller = match_sell_order.user

#             #Transfer share 
#             share = match_sell_order.share 
#             share.user = buyer

#             #Mark this share as the share for both orders
#             order.share = share 
#             match_sell_order.share = share 

#             #Mark both orders as fulfilled 
#             order.isFulfilled = True 
#             match_sell_order.isFulfilled = True 
            
#             #Subtract balance from buyer 
#             # buyer.profile.balance = buyer_current_balance - order_price
#             updateUserBalance(buyer, False, order.price)

#             #Add balance to seller 
#             # seller.profile.balance = seller_current_balance + match_sell_order.price
#             updateUserBalance(seller, True, match_sell_order.price)

#             #Calculate profit 
#             profit = order.price - match_sell_order.price
#             print('Market making profit:', profit)

#             #Mark share as NO LONGER in transit 
#             share.in_transit = False 

#             order.save()
#             match_sell_order.save()
#             share.save()
#             buyer.save()
#             seller.save()
            
#             serializer = buyOrderShareSerializer(order, many=False)
#             print('Match Found: ', match_sell_order)


#         else: 
#             order.save()
#             print('No match found, order will be backlogged')
#             # do not match, leave order be 

#         # Buy price tracking update 
#         creator_obj.price = (creator_obj.price * (Decimal(1.00) + (BID_INCREMENT)))
#         creator_obj.save()
    
#         #Add to price log 
#         new_price_log = creatorPriceLog.objects.create(
#                 creator = creator_obj,
#                 cur_price = creator_obj.price,
#             )
#         new_price_log.save()

#         return Response(serializer.data)




#         # CHANGE EVENTUALLY for optmiz CreatorShare should not be its own obj see figma notes 
#         #transfer share from seller to buyer 
#         # get the array of shares 
#         # 1. get arr of CreatorShares owned by our seller
#         # 2. get arr of CreatorShares of the Creator, isolate the first in arr they are fungible


#     # Search for existing matching buy order 
#     elif (buy_sell == 'sell'): 

#         # order by highest price to lowest price, you want to fulfill the order for the user who is willing to pay the most first  
#         creator_buy_order_arr = buyOrderShare.objects.filter(isFulfilled = False).filter(creator = creator_obj).exclude(user = request.user).order_by('-price')
#         for i in creator_buy_order_arr: 
#             print(i)


#         found = False 
#         # search for a buy order that is greater or equal to 101% of the sell order price, you keep the 1% 
#         # IMPLEMENT EDGE CASE : there are buy orders greater than the sell order price but not by a whole 1%
#         for i in creator_buy_order_arr: 
#             # checks to see if buy order we are iterated on is in the right price range, and they buyer has the funds
#             if i.price >= (order_price * (Decimal(1.00) + MARGIN)) and i.user.profile.balance >= order.price: 
#                 #FOUND MATCH 
#                 found = True 
#                 match_buy_order = i 
#                 break

#         if found: 

#             print('Order :', order )
#             print('Match buy order :', match_buy_order)

#             seller = request.user
#             buyer = match_buy_order.user

#             #Transfer share 
#             share = order.share
#             share.user = buyer

#             #Mark this share as the share for both orders (already marked for 'order' in init)
#             match_buy_order.share = share 

#             #Mark both orders as fulfilled 
#             order.isFulfilled = True 
#             match_buy_order.isFulfilled = True 
            
#             #Subtract balance from buyer 
#             # We matched to a buy order, so the buyer pays the price they set
#             # buyer.profile.balance = buyer_current_balance - match_buy_order.price
#             updateUserBalance(buyer, False, match_buy_order.price)

#             #Add balance to seller 
#             # This is a sell order, so seller gets the price they set
#             # seller.profile.balance = seller_current_balance + order.price
#             updateUserBalance(seller, True, order.price)

#             #Calculate profit 
#             profit = match_buy_order.price - order.price
#             print('Market making profit:', profit)

#             #Mark share as NO LONGER in transit 
#             share.in_transit = False 

#             order.save()
#             match_buy_order.save()
#             share.save()
#             buyer.save()
#             seller.save()

#             serializer = sellOrderShareSerializer(order, many=False)
#             print('Match Found: ', match_buy_order)

#         else: 
#             order.save()
#             print('No match found, order will be backlogged')
#             # do not match, leave order be 
        
#         # SELL price tracking update 
#         creator_obj.price = (creator_obj.price * (Decimal(1.00) - (BID_INCREMENT)))
#         creator_obj.save()

#         #Add to price log 
#         new_price_log = creatorPriceLog.objects.create(
#                 creator = creator_obj,
#                 cur_price = creator_obj.price,
#             )
#         new_price_log.save()


#         return Response(serializer.data)

