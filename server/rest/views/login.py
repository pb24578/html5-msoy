from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from ..models import User
from ..serializers import UserSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def invalid_credentials(self):
        return Response(
            {
                "invalid": "The email and password credentials were not found."
            },
            status.HTTP_412_PRECONDITION_FAILED
        )

    def post(self, request):
        email = request.data['email'].lower()
        password = request.data['password']

        # receive the user with the matching email
        user = User.objects.filter(email=email).first()
        if not user:
            return self.invalid_credentials()

        # attempt to authenticate the user
        user = authenticate(request, username=user.username, password=password)
        if not user:
            return self.invalid_credentials()

        login(request, user)

        # return the serialized user data
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data)
