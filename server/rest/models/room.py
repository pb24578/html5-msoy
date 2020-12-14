from django.db import models
from django.apps import apps
from .user import User


class Room(models.Model):
    root = models.BooleanField(default=False)
    name = models.CharField(default="Home", max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    @property
    def online(self):
        ChannelRoom = apps.get_model('websockets.ChannelRoom')

        try:
            channel_room = ChannelRoom.objects.get(room=self)
            return channel_room.get_participants().count()
        except:
            return 0

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.id})"
