from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.views import APIView
from ..models import User
from ..serializers import ProfileSerializer
import humps


class ProfilesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        id = int(kwargs.get('id', 0))

        try:
            user = User.objects.get(id=id)
        except:
            return Response(
                {
                    "invalid": "The profile with the provided id was not found."
                },
                status.HTTP_404_NOT_FOUND
            )
        profile_serializer = ProfileSerializer(user)
        return Response(humps.camelize(profile_serializer.data))
