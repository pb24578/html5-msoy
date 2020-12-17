from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from ....models import Participant

channel_layer = get_channel_layer()


async def broadcast_avatar_position(room_channel_name, channel_name, json_data):
    """
    Sends the new avatar's position to the users of the room.
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