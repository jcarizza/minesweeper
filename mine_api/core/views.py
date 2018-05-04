from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from core.serializers import GameSerializer
from core.models import Game


User = get_user_model()

class GameList(generics.ListCreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
