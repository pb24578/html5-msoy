from django.urls import path
from .models import Participant, Room
from .consumers import RoomConsumer


def on_startup():
    """
    Called before the web sockets routing is initiated.
    """

    # delete all of the rooms and its participants before starting
    Participant.objects.all().delete()
    Room.objects.all().delete()


on_startup()

websocket_urlpatterns = [
    path('room/<int:id>', RoomConsumer)
]
