from django.utils.translation import ugettext as _
from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import (
    get_user_model,
    authenticate
)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAdminUser

from core.serializers import (
    GameSerializer,
    LoginSerializer,
    UserSerializer
)
from core.models import Game


User = get_user_model()

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AuthView(GenericAPIView):

    methods = ['POST']

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(UserSerializer(user).data, status=200)
