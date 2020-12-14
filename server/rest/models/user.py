from django.contrib.auth.models import AbstractUser
from rest_framework.authtoken.models import Token
from django.db import models
from django.apps import apps


class User(AbstractUser):
    email = models.EmailField(unique=True)

    @property
    def token(self):
        try:
            token = Token.objects.get(user=self)
            return token
        except:
            return

    @property
    def display_name(self):
        return self.username

    @property
    def redirect_room_id(self):
        Room = apps.get_model('rest.Room')

        try:
            root_room = Room.objects.get(user=self, root=True)
            return root_room.id
        except:
            return 1