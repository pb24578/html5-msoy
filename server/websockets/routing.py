from django.urls import path
from .models import ChannelRoom, Participant
from .consumers import WorldConsumer


def on_startup():
    """
    Called before the web sockets routing is initiated.
    """

    # delete all of the channel rooms and its participants before starting
    Participant.objects.all().delete()
    ChannelRoom.objects.all().delete()


on_startup()

websocket_urlpatterns = [
    path('worlds/<int:id>', WorldConsumer)
]
