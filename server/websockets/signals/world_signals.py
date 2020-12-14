from django.dispatch import Signal, receiver
from django.templatetags.static import static
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth.models import AnonymousUser
from rest.serializers import AnonymousSerializer, ProfileSerializer

channel_layer = get_channel_layer()


participants_changed = Signal(
    providing_args=["channel_room", "added", "removed"]
)


@receiver(participants_changed)
def broadcast_participants(sender, channel_room, **kwargs):
    """
    Sends the updated list of participants to all of the users in this world.
    """

    participants = []
    for participant in channel_room.get_participants():
        user = participant.user

        # based on the authentication of this user, receive its profile
        profile = ProfileSerializer(user) if user and user.is_authenticated else AnonymousSerializer(AnonymousUser())
        profile = profile.data

        # format the participant's data
        participant = {
            'id': participant.id,
            'profile': profile,
            'avatar': {
                "id": profile["id"],
                "texture": static('jovial/texture.json'),
                "script": static('body.js'),
                "position": {
                    "id": profile["id"],
                    "x": participant.x,
                    "y": participant.y
                }
            }
        }
        participants.append(participant)

    # broadcast a signal with all of the participants
    async_to_sync(channel_layer.group_send)(
        channel_room.channel_name,
        {
            'type': 'participants',
            'payload': {'participants': participants}
        }
    )
