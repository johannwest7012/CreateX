from datetime import datetime
from .models import * 
from .views.user_views import submitUserOrderV2INTERNAL
from apscheduler.schedulers.background import BackgroundScheduler
import random 

def start():
    # scheduler = BackgroundScheduler()
    # scheduler.add_job(mockMarket, 'interval', seconds=30)
    # scheduler.start()
    print()





def mockMarket(): 
    #decide buy or sell 

    id = 1 
    pk = 5 
    buy_sell = ''
    price = 10
    quantity = 2

    rando = random.randint(0,1)
    if rando == 0: 
        # simulate buy 
        buy_sell = 'buy'
    else:
        # simulate sell  
        buy_sell = 'sell'

    users = User.objects.filter(id__gte = 2)
    print("len of users,", len(users))
    rando = random.randint(0, (len(users)-1))
    chosen_user = users[rando]

    if buy_sell == 'buy': 
        creator_list = Creator.objects.filter(_id__gte = 2)
        rando = random.randint(0, (len(creator_list)-1))
        creator = creator_list[rando]
        quantity = random.randint(1,10)
        price = creatorPriceLog.objects.filter(creator = creator).order_by('-_id')[0]


    
    else: 
        quant = random.randint(0,10)
        # get a creator they own shares for 
        # get a random number between 0 and the max number of shares they own for the creator
        shares = CreatorShare.objects.filter(user = chosen_user).filter(in_transit = False)
        rando = random.randint(0, (len(shares)-1))
        chosen_share = shares[rando]
        creator = chosen_share.creator
        creator_shares = shares.filter(creator = creator)
        rando = random.randint(1, (len(creator_shares)-1))
        if rando > 10: 
            rando = 10 
        quantity = rando 
        pricelog = creatorPriceLog.objects.filter(creator = creator).order_by('-_id')[0]
        price = pricelog.cur_price

        


    class Order: 
        data = {'id': chosen_user.id, 'pk':creator._id, 'buy_sell': buy_sell, 'price':price, 'quantity':quantity}
        user = chosen_user

    temp = Order
    submitUserOrderV2INTERNAL(temp)
    print(temp.data)
    


#  dispatch(submitUserOrder({
#                     'id' : user.id, 
#                     'pk' : creator._id,
#                     'buy_sell' : 'buy',
#                     'price' : creator.price, 
#                     'quantity' : quantity
#                 }))
