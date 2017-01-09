from django.db import models

class Entry(models.Model):
    player_name = models.CharField(max_length=20)
    table_width = models.IntegerField(default=0)
    table_height = models.IntegerField(default=0)



