from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from ...models import Participant
from rest.serializers import ProfileSerializer
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
            channel_room__channel_name=room_channel_name, channel_name=channel_name
        )
    participant = await sync_to_async(get_participant)()

    def get_profile():
        if participant.user and participant.user.is_authenticated:
            profile = ProfileSerializer(participant.user).data
        else:
            profile = {
                "id": get_id(participant.user),
                "display_name": get_display_name(participant.user),
                "redirect_room_id": 1,
            }
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

async def broadcast_entity_position(room_channel_name, channel_name, json_data):
    """
    Sends the new entity position to the users of the room.
    """

    type = json_data['type']
    payload = json_data['payload']

    def get_participant_id():
        participant = Participant.objects.get(
            channel_room__channel_name=room_channel_name, channel_name=channel_name
        )
        return participant.id
    id = await sync_to_async(get_participant_id)()

    await channel_layer.group_send(
        room_channel_name,
        {
            'type': type,
            'payload': {
                "id": id,
                "position": payload["position"]
            }
        }
    )