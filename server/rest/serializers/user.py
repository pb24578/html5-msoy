from rest_framework import serializers
from rest_framework.authtoken.models import Token
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    session = serializers.SerializerMethodField('get_session')
    display_name = serializers.SerializerMethodField('get_display_name')

    class Meta:
        model = User
        fields = ['id', 'session', 'display_name', 'username', 'email']

    def get_session(self, obj):
        user = User.objects.get(id=obj.id)
        token = Token.objects.get(user=user)
        session = { "token": token.key }
        return session

    def get_display_name(self, obj):
        user = User.objects.get(id=obj.id)
        return user.username