from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser 
from rest_framework.response import Response

from django.contrib.auth.models import User 
from base.models import * 
from base.creators import creators
from base.serializers import CreatorSerializer

from rest_framework import status



@api_view(['GET'])
def getCreators(request): 
    creators = Creator.objects.all()
    serializer = CreatorSerializer(creators, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCreator(request, pk): 
    creator = Creator.objects.get(_id=pk)
    serializer = CreatorSerializer(creator, many=False)
    return Response(serializer.data)


# THIS IS NOT DONE OR CORRECT 
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getCreatorShares(request): 
    data = request.data
    pk = data['pk']
    creator = Creator.objects.get(_id=pk)
    serializer = CreatorSerializer(creator, many=False)
    return Response(serializer.data)

