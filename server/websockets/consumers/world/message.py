from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer
from rest.getters.user import get_display_name, get_id

channel_layer = get_channel_layer()


async def broadcast_message(room_channel_name, user, message):
    """
    Send a message to the users of the room.
    """

    # prevent blank messages from being sent
    if not bool(message) or message.isspace():
        return

    # strip off too many characters
    max_chars = 256
    message = message[0: max_chars]

    # receive the sender's information
    sender = {
        'id': await sync_to_async(get_id)(user),
        'display_name': await sync_to_async(get_display_name)(user),
    }

    await channel_layer.group_send(
        room_channel_name,
        {
            'type': 'message',
            'payload': {'sender': sender, 'message': message}
        }
    )