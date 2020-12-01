from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
from ..models import ChannelRoom
import humps
import json


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Authenticates the user that is attempting to connect to this room.
        """

        self.group_id = self.scope['url_route']['kwargs']['id']
        self.group_name = str(self.group_id)

        # add this user to the channel's room
        self.channel_room = await sync_to_async(ChannelRoom.objects.add)(
            self.group_id, self.group_name, self.channel_name, user=self.scope['user']
        )

        # prune duplicate participants of this user
        def prune_duplicate_participants():
            if self.scope['user'].is_anonymous:
                return
            
            participants = self.channel_room.get_duplicate_participants(self.channel_name, user=self.scope['user'])
            for participant in participants:
                async_to_sync(self.channel_layer.send)(
                    participant.channel_name,
                    {
                        'type': 'kick',
                        'payload': {
                            "sender": "Server",
                            "reason": "You've been kicked out of the server because you connected somewhere else."
                        }
                    }
                )
        await sync_to_async(prune_duplicate_participants)()

        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnects the user session from the room.
        """

        await sync_to_async(ChannelRoom.objects.remove)(self.group_name, self.channel_name)

        await self.close()

    async def receive(self, text_data):
        """
        Handles a message sent in this room, and sends it to the
        other users also connected in the room.
        """

        json_data = json.loads(text_data)

        # check if the data has an invalid format
        if not 'type' in json_data or not 'payload' in json_data:
            return

        type = json_data['type']
        payload = json_data['payload']

        # send a message to the users in this room
        if type == 'message':
            message = payload['message']

            # prevent blank messages from being sent
            if not bool(message) or message.isspace():
                return

            # strip off too many characters
            max_chars = 256
            message = message[0: max_chars]

            def get_display_name():
                return 'Anonymous' if self.scope['user'].is_anonymous else self.scope['user'].username
            display_name = await sync_to_async(get_display_name)()

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'message',
                    'payload': {'sender': display_name, 'message': message}
                }
            )

    async def participants(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def message(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def kick(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))
