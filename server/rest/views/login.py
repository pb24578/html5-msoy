from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from ..serializers import UserSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        # attempt to authenticate the user
        user = authenticate(request, username=username, password=password)
        print(user)
        if not user:
            return Response(
                {
                    "invalid": "The username and password credentials were not found."
                },
                status.HTTP_412_PRECONDITION_FAILED
            )

        login(request, user)

        # return the serialized user data
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data)
