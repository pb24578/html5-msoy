from rest_framework import serializers
from .user import ProfileSerializer
from ..models import Room
from websockets.models import ChannelRoom

class RoomSerializer(serializers.ModelSerializer):
    online = serializers.SerializerMethodField('get_online')
    owner = serializers.SerializerMethodField('get_owner')

    class Meta:
        model = Room
        fields = ['id', 'name', 'online', 'owner']

    def get_online(self, obj):
        try:
            channel_room = ChannelRoom.objects.get(room=obj)
        except:
            return 0
        return channel_room.get_participants().count()

    def get_owner(self, obj):
        profile_serializer = ProfileSerializer(obj.user)
        return profile_serializer.data

