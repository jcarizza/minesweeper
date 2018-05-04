from django.db import models
from django.conf import settings

# Create your models here.


class Game(models.Model):
    """
    Game store all information about one session

    map_json: str - Must be a two dimensional array
    map_length: int - Define the dimension of the map
    time: int - The playing time in seconds
    game_over: bool - If the game is finished and the player loose
    win: bool - If the game is finished and the player won
    finished: bool - Game is ended
    user: User - The user whose belong this game

    """
    map_json = models.TextField()
    map_length = models.IntegerField()
    time = models.IntegerField(default=0)
    game_over = models.BooleanField(default=False)
    win = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete='CASCADE')
