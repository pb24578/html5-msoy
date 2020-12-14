from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from ...models import Participant
from django.contrib.auth.models import AnonymousUser
from rest.serializers import AnonymousSerializer, ProfileSerializer
from rest.getters.user import get_display_name, get_id

channel_layer = get_channel_layer()


async def broadcast_message(room_channel_name, channel_name, json_data):
    """
    Sends a message to the users of the room.
    """

    type = json_data['type']
    payload = json_data['payload']

    # prevent blank messages from being sent
    message = payload['message']
    if not bool(message) or message.isspace():
        return

    # strip off too many characters
    max_chars = 256
    message = message[0: max_chars]

    def get_participant():
        return Participant.objects.get(
            channel_room__channel_name=room_channel_name,
            channel_name=channel_name
        )
    participant = await sync_to_async(get_participant)()

    def get_profile():
        # based on the authentication of this user, receive its profile
        user = participant.user
        profile = ProfileSerializer(user) if user and user.is_authenticated else AnonymousSerializer(AnonymousUser())
        profile = profile.data
        return profile
    profile = await sync_to_async(get_profile)()

    def get_participant_id():
        return participant.id
    participant_id = await sync_to_async(get_participant_id)()

    # receive the sender's information
    sender = {
        "id": participant_id,
        "profile": profile,
    }

    await channel_layer.group_send(
        room_channel_name,
        {
            'type': type,
            'payload': {'sender': sender, 'message': message}
        }
    )

async def broadcast_participant_position(room_channel_name, channel_name, json_data):
    """
    Sends the new participant's position to the users of the room.
    """

    type = json_data['type']
    payload = json_data['payload']
    entity_id = payload["id"]
    position = payload["position"]
    animate = payload["animate"]

    def get_participant():
        participant = Participant.objects.get(
            channel_room__channel_name=room_channel_name,
            channel_name=channel_name
        )
        return participant
    participant = await sync_to_async(get_participant)()

    # if this was for an avatar, then set participant's position to the payload data
    def set_participant_position():
        participant.x = position["x"]
        participant.y = position["y"]
        participant.direction_x = position["directionX"]
        participant.save()
    await sync_to_async(set_participant_position)()

    def get_participant_id():
        return participant.id
    participant_id = await sync_to_async(get_participant_id)()

    await channel_layer.group_send(
        room_channel_name,
        {
            'type': type,
            'payload': {
                "id": entity_id,
                "participant_id": participant_id,
                "position": position,
                "animate": animate,
            }
        }
    )