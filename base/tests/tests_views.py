
from django.test import TestCase, Client, SimpleTestCase
from django.urls import reverse, resolve 
from base.views.creator_views import * 
from base.views.user_views import * 
from base.models import * 
from base.serializers import *

import json 
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



class TestCreatorViews(TestCase): 

    def setUp(self):
        self.client = Client()
        creator = Creator.objects.create(
            name = 'TestCreator'
        )
        creator.save()
        self.creator = creator

    def test_creators_GET(self): 
        response = self.client.get(reverse('creators'))

        self.assertEquals(response.status_code, 200)

    def test_creator_GET(self): 
        response = self.client.get(reverse('creator', args=[self.creator._id]))

        self.assertEquals(response.status_code, 200)

    
    def test_creator_price_log_GET(self): 
        response = self.client.get(reverse('creator-price-log', args=[self.creator._id]))

        self.assertEquals(response.status_code, 200)



 
class TestUserViews(TestCase): 
    
    def setUp(self): 
        self.client = Client()

        self.creator = Creator.objects.create(
            name = 'TestCreator',
            price = 1.000
        )

        self.user = User.objects.create(
            first_name = 'AdminUser',
            username = 'username',
            email = 'fakeemail@email.com', 
            password = make_password('1235test'),  
            is_staff = True, 
            is_superuser = True          
        )
        serializer = UserSerializerWithToken(self.user).data
        self.token = serializer['token']
        self.authorization = 'Bearer ' + self.token

        self.user2 = User.objects.create(
            first_name = 'AdminUser2',
            username = 'username2',
            email = 'fakeemail2@email.com', 
            password = make_password('1235test2'),  
            is_staff = True, 
            is_superuser = True          
        )
        serializer2 = UserSerializerWithToken(self.user2).data
        self.token2 = serializer2['token']
        self.authorization2 = 'Bearer ' + self.token2

    
    def test_register_PUT(self): 
        response = self.client.post(reverse('register'), {
            'name':'testname',                                                   
            'email': 'testemail@email.com', 
            'password': '12345'})
        self.assertEquals(response.status_code, 200)
   
  

    def test_profile_GET(self): 
        response = self.client.get(reverse('user-profile'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        self.assertEquals(response.status_code, 200)

    def test_profile_fail_GET(self): 
        response = self.client.get(reverse('user-profile'), content_type='application/json', **{'HTTP_AUTHORIZATION': '123'})
        self.assertEquals(response.status_code, 401)



    def test_update_user_profile_PUT(self): 
        response = self.client.put(reverse('user-profile-update'), {
            'name':'testname',                                                   
            'email': 'NEWemail@email.com', 
            'password': '12345new'},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        self.assertEquals(response.status_code, 200)

    def test_update_user_profile_fail_PUT(self): 
        response = self.client.put(reverse('user-profile-update'), {
            'name':'testname',                                                   
            'email': 'NEWemail@email.com', 
            'password': '12345new'},content_type='application/json', **{'HTTP_AUTHORIZATION': '1234'})
        self.assertEquals(response.status_code, 401)

    def test_update_user_profile_no_passwordPUT(self): 
        response = self.client.put(reverse('user-profile-update'), {
            'name':'testname',                                                   
            'email': 'NEWemail@email.com', 
            'password': ''},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        self.assertEquals(response.status_code, 200)

    def test_get_users_GET(self): 
        response = self.client.get(reverse('users'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)

    def test_get_user_shares_GET(self): 
        response = self.client.get(reverse('user-profile-shares'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)
    
    def test_get_user_buy_orders_GET(self): 
        response = self.client.get(reverse('user-buy-orders'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)

    def test_get_user_sell_orders_GET(self): 
        response = self.client.get(reverse('user-sell-orders'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)

    def test_get_user_order_history_GET(self): 
        response = self.client.get(reverse('user-profile-orderHistory'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)

    def test_add_neg_balance(self): 
        result = updateUserBalance(self.user2, True, 10)
        self.assertEquals(result, True)
        result = updateUserBalance(self.user2, False, 5)
        self.assertEquals(result, True)
        result = updateUserBalance(self.user2, False, 6)
        self.assertEquals(result, True)
        result = updateUserBalance(self.user2, True, 10)
        self.assertEquals(result, True)


    def test_create_order_PUT(self): 
        result = updateUserBalance(self.user, True, 5000)
        self.assertEquals(result, True)

        CreatorShare.objects.create(
            creator = self.creator, 
            user = self.user2
        )

        print('BALANCE : ', self.user.profile.balance)

        response = self.client.put(reverse('user-profile-submitOrder'), {
            'pk': self.creator.pk,                                                   
            'buy_sell': 'buy', 
            'price': 20.00},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json())
        self.assertEquals(response.status_code, 200)


        response = self.client.put(reverse('user-profile-submitOrder'), {
            'pk': self.creator.pk,                                                   
            'buy_sell': 'sell', 
            'price': 1.00},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization2})
        #print(response.json())
        self.assertEquals(response.status_code, 200)

        CreatorShare.objects.create(
            creator = self.creator, 
            user = self.user2
        )

        response = self.client.put(reverse('user-profile-submitOrder'), {
            'pk': self.creator.pk,                                                   
            'buy_sell': 'sell', 
            'price': 1.00},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization2})
        #print(response.json())
        self.assertEquals(response.status_code, 200)

        response = self.client.put(reverse('user-profile-submitOrder'), {
            'pk': self.creator.pk,                                                   
            'buy_sell': 'buy', 
            'price': 20.00},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json())
        self.assertEquals(response.status_code, 200)

        response = self.client.put(reverse('user-profile-submitOrder'), {
            'pk': self.creator.pk,                                                   
            'buy_sell': 'buy', 
            'price': 20.00},content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization2})
        print(response.json())
        self.assertEquals(response.status_code, 400)


        response = self.client.get(reverse('user-profile-orderHistory'), content_type='application/json', **{'HTTP_AUTHORIZATION': self.authorization})
        #print(response.json)
        self.assertEquals(response.status_code, 200)

  







