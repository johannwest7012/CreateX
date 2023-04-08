from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields.jsonb import JSONField as JSOBField



# for Profile funcs 
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.

#CreateX Models 

# Profile 
# 1 to 1 with User
# contains additional data fields not present in the default Django User 
# decided to create an additional model because I fear recreating or editing the Django 
# User model may cause errors since it deals heavily with tokens and authentication
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    # Array field only works with Postgres
    # Right now doing many-to-one with the CreatorShare model which is probably alot slower performance wise 
    #shares = ArrayField(ArrayField(models.IntegerField()))

    def __str__(self):
        return str("user: " + str(self.user) + "   balance: " + str(self.balance))


# Creates a user PROFILE whenever a user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Saves the user PROFILE whenever a user is saved (for conveinience and safety)
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



class Creator(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    email = models.CharField(max_length=200, null=True, blank=True)
    firstName = models.CharField(max_length=200, null=True, blank=True)
    lastName = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    balance = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=3, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    yt_id = models.TextField(max_length=30, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(str(self.name) + '   _id:' + str(self._id))
    

class creatorPriceLog(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    cur_price = models.DecimalField(max_digits=7, decimal_places=3, null=True, blank=True)
    date_time = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return str('   _id:' + str(self._id) + '  creator:' + str(self.creator) + '   cur_price:' + str(self.cur_price) + '   date_time:' + str(self.date_time))



class CreatorShare(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    #creator the C-share is tied to 
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    #user who owns the C-Share
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    #if true than this share is tied to an outstanding order and cannot be tied to another order 
    in_transit = models.BooleanField(default=False)


    #pull price from Creator object, no reason to be constantly updating the price 
    #on every single CreatorShare object 


    def __str__(self) -> str:
        return str("id:" + str(self._id) + "   creator id:" + str(self.creator) + "   user id:" + str(self.user) + "  IN TRANSIT :" + str(self.in_transit))

class CreatorToken(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    #creator the token is tied to 
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    #user who owns the token 
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    #price will get updated consistently based on outstanding BUY offers 
    price = models.DecimalField(max_digits=7, decimal_places=3, null=True, blank=True)
    #thumbnail image 
    image = models.ImageField(null=True, blank=True)
    #rating 
    rating = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self) -> str:
        return str(self._id)


class buyOrderShare(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    #buy or sell 
    price = models.DecimalField(max_digits=7, decimal_places=3, null=True, blank=True)
    isFulfilled = models.BooleanField(default=False)
    fulfilledAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    share = models.ForeignKey(CreatorShare, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    order_type = models.CharField(max_length=10, default='BUY', editable=False)

    def __str__(self) -> str:
        return str("share_id: " + str(self.share) + "  creator id: " + str(self.creator) + "  price: " + str(self.price) + "  user id: " + str(self.user) + " isFulfilled: " + str(self.isFulfilled))

class sellOrderShare(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=7, decimal_places=3, null=True, blank=True)
    isFulfilled = models.BooleanField(default=False)
    fulfilledAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    share = models.ForeignKey(CreatorShare, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    order_type = models.CharField(max_length=10, default='SELL', editable=False)


    def __str__(self) -> str:
        return str("share_id: " + str(self.share) + "  creator id: " + str(self.creator) + "  price: " + str(self.price) + "  user id: " + str(self.user) + " isFulfilled: " + str(self.isFulfilled))

# NOT CURRENTLY USED but will implement for accounting purposes  
class OrderToken(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self._id)


class BalanceChange(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    changeDirection = models.CharField(max_length=200, null=True, blank=True)
    changeAmount = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    oldTotalBalance = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    newTotalBalance = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True) 


    def __str__(self) -> str:
        return str(str(self._id) + " " + str(self.user.username) + " balance change: " + str(self.changeDirection) + " " + str(self.changeAmount))


# NOT CURRENTLY USED This is intended to be used when a user adds funds to their balance 
class BalanceOrder(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True) 
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
   

    def __str__(self) -> str:
        return str(self.createdAt)


# NOT CURRENTLY USED Will implement later 
class Review(models.Model): 
    creator = models.ForeignKey(Creator, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.rating)

