from django.test import TestCase, Client
from django.urls import reverse
from base.models import *
from base.views.creator_views import *


## Creator view tests 
class CreatorsViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('base:creators', current_app='base'
                           )
        self.obj1 = MyModel.objects.create(name='Object 1')
        self.obj2 = MyModel.objects.create(name='Object 2')
        
    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'myapp/my_model_list.html')
        self.assertContains(response, self.obj1.name)
        self.assertContains(response, self.obj2.name)