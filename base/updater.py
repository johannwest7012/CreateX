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
    rando = random.randint(0, len(users))
    chosen_user = users[rando]

    if buy_sell == 'buy': 
        creator_list = Creator.objects.filter(id__gte = 2)
        rando = random.randint(0, len(creator_list))
        quant = random.randint(0,10)

    
    else: 
        quant = random.randint(0,10)

    class Order: 
        data = {'id': id, 'pk':pk, 'buy_sell': buy_sell, 'price':price, 'quantity':quantity}
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
