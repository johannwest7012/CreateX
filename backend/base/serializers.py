from rest_framework import serializers
from django.contrib.auth.models import User 
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *

class UserSerializer(serializers.ModelSerializer): 
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    

    class Meta: 
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj): 
        return obj.is_staff

    def get_name(self, obj): 
        name = obj.first_name
        if name == "": 
            name = obj.email

        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta: 
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj): 
        token = RefreshToken.for_user(obj)
        return str(token.access_token) 

class CreatorSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Creator
        fields = '__all__'


class CreatorShareSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = CreatorShare
        fields = '__all__'


class buyOrderShareSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = buyOrderShare
        fields = '__all__'


class sellOrderShareSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = sellOrderShare
        fields = '__all__'