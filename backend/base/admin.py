from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import *

# Register your models here.

#CreateX
admin.site.register(Creator)
admin.site.register(CreatorShare)
admin.site.register(CreatorToken)
admin.site.register(buyOrderShare)
admin.site.register(sellOrderShare)
admin.site.register(OrderToken)
admin.site.register(Profile)
admin.site.register(BalanceChange)

#Tutorial
admin.site.register(Review)
admin.site.register(BalanceOrder)
