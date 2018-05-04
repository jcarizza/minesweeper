from django.db import models
from django.conf import settings

# Create your models here.


class Game:
    _map = models.TextField()
    time = models.IntegerField()
    game_over = models.BooleanField(default=False)
    win = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete='CASCADE')
