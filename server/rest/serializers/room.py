from rest_framework import serializers
from .user import ProfileSerializer
from ..models import Room

class RoomSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField('get_owner')

    class Meta:
        model = Room
        fields = ['id', 'name', 'owner']

    def get_owner(self, obj):
        user = obj.user
        profile_serializer = ProfileSerializer(user)
        return profile_serializer.data

