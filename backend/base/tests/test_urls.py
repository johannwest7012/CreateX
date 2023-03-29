
from django.test import TestCase, Client, SimpleTestCase
from django.urls import reverse, resolve 
from base.views.creator_views import * 
from base.views.user_views import * 

## RUN TESTS 
# python manage.py test base 

## GENERATE COVERAGE REPORT with branch
# coverage run --branch manage.py test base && coverage report

## without branch 
# coverage run manage.py test base && coverage report

class CreatorUrls(SimpleTestCase): 
    

    def test_creators_url(self): 
        url = reverse('creators')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getCreators)

    def test_creator_url(self): 
        url = reverse('creator', args=[5])
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getCreator)

    def test_creator_pricelog_url(self): 
        url = reverse('creator-price-log', args=[5])
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getCreatorPriceLog)


    def test_make_creator_shares_url(self): 
        url = reverse('make-creator-shares', args=[5])
        #print(resolve(url))
        self.assertEquals(resolve(url).func,makeCreatorShares)


class UserUrls(SimpleTestCase): 
    def test_users_url(self): 
        url = reverse('users')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUsers)


    def test_register_url(self): 
        url = reverse('register')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, registerUser)

    def test_getusershares_url(self): 
        url = reverse('user-profile-shares')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUserShares)

    def test_getbuyorders_url(self): 
        url = reverse('user-buy-orders')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUserBuyOrders)

    def test_getsellorders_url(self): 
        url = reverse('user-sell-orders')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUserSellOrders)

    def test_profile_url(self): 
        url = reverse('user-profile')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUserProfile)

    def test_profileupdate_url(self): 
        url = reverse('user-profile-update')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, updateUserProfile)

    def test_submitOrder_url(self): 
        url = reverse('user-profile-submitOrder')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, submitUserOrder)

    def test_orderhistory_url(self): 
        url = reverse('user-profile-orderHistory')
        #print(resolve(url))
        self.assertEquals(resolve(url).func, getUserOrderHistory)

#     path('sellOrders/', views.getUserSellOrders, name='user-sell-orders'),
#     path('profile/', views.getUserProfile, name='user-profile'),
#     path('profile/update/', views.updateUserProfile, name='user-profile-update'),
#     path('profile/submitOrder/', views.submitUserOrder, name='user-profile-submitOrder'),
#     path('profile/orderHistory/', views.getUserOrderHistory, name='user-profile-orderHistory'),