from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from .models import buyOrderShare, sellOrderShare, CreatorShare
from decimal import *
from .views.user_views import updateUserBalance


# fires when you update/save a User
# when email is changed, it updates the username 
def updateUser(sender, instance, **kwargs): 
    user = instance
    if user.email != '': 
        user.username = user.email
pre_save.connect(updateUser, sender=User)

# updateBuyOrderShare()
# fires when a buy order is created 
# searchs through sell orders of the same creator and
# greater or equal quantity and finds out 
# if any of those sell orders can now fulfilled with the with the exisitng buy orders and the creation 
# of this new buy order 


# def updateBuyOrderShare(sender, instance, **kwargs): 
#     print("FIRED updateBuyOrderShare")


# post_save.connect(updateBuyOrderShare, sender=buyOrderShare)



# updateSellOrderShare()
# fires when a sell order is created 
# searchs through buy orders of the same creator and
# greater or equal quantity and finds out 
# if any of those buy orders can now fulfilled with the with the exiting sell orders and the creation 
# of this new sell order 
# def updateSellOrderShare(sender, instance, **kwargs): 
#     print("FIRED updateSellOrderShare")
#     checkForExisitingReflectiveOrders(instance, 'sell')

# post_save.connect(updateSellOrderShare, sender=sellOrderShare)



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
    order_shareslist = order.shares_list.copy()
    if buy_sell == 'buy': 
        print('if')
    elif  buy_sell == 'sell':
        # get all candidate buy orders (based on isFulfilled, creator, quant, price)
        min_buy_price = order_price * (Decimal(1.00) + MARGIN)
        print('elif')
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
                for i in range(buy_order.quantity): 
                    print('for loop')
                    share_id = order_shareslist.pop()
                    share = CreatorShare.objects.get(_id = share_id)
                    print('share._id',share._id)
                    share.user = buy_order.user
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
    