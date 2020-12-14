from rest_framework import serializers
from .user import ProfileSerializer
from ..models import Room
from django.apps import apps

class RoomSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField('get_owner')

    class Meta:
        model = Room
        fields = ['id', 'name', 'online', 'owner']

    def get_owner(self, obj):
        profile_serializer = ProfileSerializer(obj.user)
        return profile_serializer.data

