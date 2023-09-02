# CreateX

# https://createx.herokuapp.com/

READ ME 

Backend - 
 - The backend was developed with Django. Pip installs are outlined below. 
APScheduler==3.10.1
asgiref==3.6.0
boto3==1.26.100
botocore==1.29.100
cachetools==5.3.0
certifi==2022.12.7
charset-normalizer==3.0.1
coverage==7.2.2
Django==4.1.4
django-cors-headers==3.13.0
django-storages==1.13.2
djangorestframework==3.14.0
djangorestframework-simplejwt==5.2.2
google-api-core==2.11.0
google-api-python-client==2.79.0
google-auth==2.16.1
google-auth-httplib2==0.1.0
google-auth-oauthlib==1.0.0
googleapis-common-protos==1.58.0
gunicorn==20.1.0
httplib2==0.21.0
idna==3.4
jmespath==1.0.1
oauthlib==3.2.2
Pillow==9.4.0
protobuf==4.22.0
psycopg2==2.9.5
pyasn1==0.4.8
pyasn1-modules==0.2.8
PyJWT==2.6.0
pyparsing==3.0.9
python-dateutil==2.8.2
pytz==2022.7.1
requests==2.28.2
requests-oauthlib==1.3.1
rsa==4.9
s3transfer==0.6.0
six==1.16.0
sqlparse==0.4.3
uritemplate==4.1.1
urllib3==1.26.14
whitenoise==6.4.0

 - Models 
 User 
 Creator 
 CreatorShare 
 PriceLog 
 BuyOrders
 SellOrders 
 Profiles 


 - Views 
 creator_views 
 user_views 

 - SubRoutine 
 Subroutine acts as a mock market. It executes valid orders for users based on their account balance and the shares that they own. There is no actual market logic, if an order can be sumbitted by a user the SubRoutine could possibly trigger that order. 

Frontend - 
    - The frontend was developed in React. Primary technologies utilized are React Redux, React Router, React Bootstrap, and React Material UI. 
    - Screens 
    CreatorScreen
    FavoritesScreen
    HomeScreen
    LandingScreen 
    LoginScreen
    PolicyScreen 
    PortfolioScreen
    ProfileScreen
    RegisterScreen 

    - Custom Components
    CoverPic 
    Creator
    CreatorCard
    CreatorCardsRow 
    CreatorGrid 
    Footer 
    FormContainer
    Header 
    LineChart 
    Loader 
    Message 
    OrderCard 
    ParticleBackground 
    SearchBox 
    Share 
    

    - Actions 
    creatorActions 
    favoritesActions 
    userActions 




