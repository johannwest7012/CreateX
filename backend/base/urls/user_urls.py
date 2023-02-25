#connecting the views to urls 

from django.urls import path 
from base.views import user_views as views 


# these urls access a view in user_views.py 

urlpatterns = [
    # 'api/users/' + 

    path('', views.getUsers, name='users'),
    # JSON token auth
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('shares/', views.getUserShares, name='user-profile-shares'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('profile/submitOrder/', views.submitUserOrder, name='user-profile-submitOrder'),
    path('profile/orderHistory/', views.getUserOrderHistory, name='user-profile-orderHistory'),


    

]