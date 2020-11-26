from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from ..models import User
from ..forms import SignupForm
from ..serializers import UserSerializer


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        signup_form = SignupForm(request.data)
        if not signup_form.is_valid():
            return Response(signup_form.errors, status.HTTP_412_PRECONDITION_FAILED)

        # create the user, login the user session, and return a success response
        username = signup_form.cleaned_data['username']
        email = signup_form.cleaned_data['email']
        password = signup_form.cleaned_data['password']
        user = User.objects.create(username=username, email=email, password=password)
        Token.objects.get_or_create(user=user)

        # return the serialized user data
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data)