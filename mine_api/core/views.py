import json

from django.utils.translation import ugettext as _
from django.contrib.auth import get_user_model

from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import generics

from core.serializers import (
    GameSerializer,
    EndGameSerializer,
    LoginSerializer,
    UserSerializer
)
from core.models import Game


User = get_user_model()


class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (TokenAuthentication,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['put'], detail=True)
    def update_map(self, request, pk=None):
        """
            Update map
            Use an action to update the map only.
        """
        game = self.get_object()
        game.map_json = json.dumps(request.data['map_json'])
        game.save()
        return Response(GameSerializer(game).data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True, serializer_class=EndGameSerializer)
    def finished(self, request, pk=None):
        """Set the win or game over flag when the game is finished"""

        game = self.get_object()
        serializer = EndGameSerializer(data=request.data)
        if serializer.is_valid():
            game.win = serializer.data['win']
            game.game_over = not serializer.data['win']
            game.finished = True
            game.save()
            return Response({'status': _('updated')},
                            status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class AuthView(generics.GenericAPIView):

    methods = ['POST']

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(UserSerializer(user).data, status=200)
