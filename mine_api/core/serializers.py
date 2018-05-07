from django.utils.translation import ugettext as _
from django.contrib.auth import (
    authenticate,
    get_user_model
)

from rest_framework import serializers
from rest_framework.serializers import (
    ModelSerializer,
    ValidationError,
    Serializer
)

from core.models import Game

User = get_user_model()


class GameSerializer(ModelSerializer):
    map_json = serializers.JSONField()

    class Meta:
        model = Game
        fields = ('id', 'map_json', 'map_length', 'win', 'game_over', 'time', 'finished')
        read_only_fields = ('win', 'game_over', 'time', 'finished')


class EndGameSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = ('win', )


class LoginSerializer(Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise ValidationError(_('Invalid credentials'))

        return data

    def save(self):
        return User.objects.get(username=self.data['username'])


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'auth_token')
