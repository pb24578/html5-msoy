from django.contrib.auth import logout
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from ..serializers import UserSerializer
import humps


class SessionView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_anonymous:
            return Response({"invalid": "The token is invalid"}, status=status.HTTP_404_NOT_FOUND)

        # return the serialized user data
        user_serializer = UserSerializer(request.user)
        return Response(humps.camelize(user_serializer.data))

    def delete(self, request):
        logout(request)
        return Response()
