from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from .models import buyOrderShare, sellOrderShare

# fires when you update/save a User
# when email is changed, it updates the username 
def updateUser(sender, instance, **kwargs): 
    user = instance
    if user.email != '': 
        user.username = user.email
pre_save.connect(updateUser, sender=User)


def updateBuyOrderShare(sender, instance, **kwargs): 
    print("FIRED updateBuyOrderShare")
post_save.connect(updateBuyOrderShare, sender=buyOrderShare)


def updateSellOrderShare(sender, instance, **kwargs): 
    print("FIRED updateSellOrderShare")
post_save.connect(updateBuyOrderShare, sender=sellOrderShare)