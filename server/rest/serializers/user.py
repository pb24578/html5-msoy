from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from ..models import Room, User

class UserSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField('get_session')
    display_name = serializers.SerializerMethodField('get_display_name')
    redirect_room_id = serializers.SerializerMethodField('get_redirect_room_id')

    class Meta:
        model = User
        fields = ['id', 'session', 'display_name', 'redirect_room_id', 'username', 'email']

    def get_session(self, obj):
        try:
            user = User.objects.get(id=obj.id)
            token = Token.objects.get(user=user)
            session = { "token": token.key }
        except:
            return
        return session

    def get_display_name(self, obj):
        try:
            user = User.objects.get(id=obj.id)
        except:
            return
        return user.username

    def get_redirect_room_id(self, obj):
        try:
            root_room = Room.objects.get(user__id=obj.id, root=True)
        except:
            return
        return root_room.id

class ProfileSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField('get_display_name')
    redirect_room_id = serializers.SerializerMethodField('get_redirect_room_id')

    class Meta:
        model = User
        fields = ['id', 'display_name', 'redirect_room_id']

    def get_display_name(self, obj):
        try:
            user = User.objects.get(id=obj.id)
        except:
            return
        return user.username

    def get_redirect_room_id(self, obj):
        try:
            root_room = Room.objects.get(user__id=obj.id, root=True)
        except:
            return
        return root_room.id

class AnonymousSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField('get_id')
    display_name = serializers.SerializerMethodField('get_display_name')
    redirect_room_id = serializers.SerializerMethodField('get_redirect_room_id')

    class Meta:
        model = AnonymousUser
        fields = ['id', 'display_name', 'redirect_room_id']

    def get_id(self, obj):
        return 0

    def get_display_name(self, obj):
        return "Anonymous"

    def get_redirect_room_id(self, obj):
        return 1

