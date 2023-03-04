from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser 
from rest_framework.response import Response

from django.contrib.auth.models import User 
from base.models import * 
#from base.creators import creators
from base.serializers import CreatorSerializer

from rest_framework import status

#import google.auth
#from google.oauth2.credentials import Credentials
#from google_auth_oauthlib.flow import InstalledAppFlow
#from googleapiclient.discovery import build

@api_view(['GET'])
def getCreatorStats(request, pk): 
    creator = Creator.objects.get(_id=pk)
    creator_yt_id = creator.yt_id

    CLIENT_SECRET_FILE = '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'
    API_KEY = 'AIzaSyDlLf_57TpSg-uImu_OybMSX44zzg0Ps5k'

    # YouTube Data API scope
    SCOPES = ['https://www.googleapis.com/youtube/v3/channels']

    # Authenticate with OAuth 2.0
    creds = None
    # Manual auth needed if the client secret or API key fails
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
        creds = flow.run_local_server(port=0)
    service = build('youtube', 'v3', credentials=creds, developerKey=API_KEY)

    # Request data from the YouTube Data API
    request = service.channels().list(part='statistics', id=creator_yt_id)
    response = request.execute()
    return response

@api_view(['GET'])
def getCreators(request): 
    query = request.query_params.get('keyword')
    print('query:', query)
    if query == None: 
        query = ''

    creators = Creator.objects.filter(name__icontains=query)
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

