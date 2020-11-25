from django.urls import path
from .consumers import room_consumer

websocket_urlpatterns = [
    path('room/<int:id>', room_consumer.RoomConsumer)
]