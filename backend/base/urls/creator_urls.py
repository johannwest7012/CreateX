#connecting the views to urls 

from django.urls import path 
from base.views import creator_views as views 

# these urls access a view in views.py 

urlpatterns = [

    #'api/creators/' + 

    path('', views.getCreators, name='creators'),

    # For querying a single creator, calls the getProuduct view, 
    # which takes the parameter "pk", which we are specifying in path
    path('<str:pk>/', views.getCreator, name='creator'),
    path('stats/<str:pk>/', views.getCreatorStats, name='creator-stats')
]