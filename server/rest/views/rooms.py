from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from ..models import Room
from websockets.models import ChannelRoom
from ..serializers import RoomSerializer
import humps


class RoomsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        max_rooms = 24

        # receive the most active rooms in descending order
        rooms = sorted(ChannelRoom.objects.all(), key=lambda r: r.get_participants().count(), reverse=True)
        rooms = rooms[:max_rooms]
        rooms = list(map(lambda r: r.room, rooms))
        active_rooms_serializer = RoomSerializer(rooms, many=True)

        # receive the newest rooms in descending order
        rooms = Room.objects.all().order_by('-id')[:max_rooms]
        new_rooms_serializer = RoomSerializer(rooms, many=True)

        return Response(
            humps.camelize({
                "active": active_rooms_serializer.data,
                "new": new_rooms_serializer.data,
                "featured": [],
            })
        )
