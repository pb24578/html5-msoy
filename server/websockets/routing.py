from django.urls import path
from channels_presence.models import Room, Presence
from .consumers import RoomConsumer


def on_startup():
    """
    Called before the web sockets routing is initiated.
    """

    # prune all of the old presences and rooms before starting
    Presence.objects.all().delete()
    Room.objects.prune_rooms()


on_startup()

websocket_urlpatterns = [
    path('room/<int:id>', RoomConsumer)
]
