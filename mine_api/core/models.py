from django.db import models
from django.conf import settings

# Create your models here.


class Game(models.Model):
    map_json = models.TextField()
    map_length = models.IntegerField()
    time = models.IntegerField(default=0)
    game_over = models.BooleanField(default=False)
    win = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete='CASCADE')
