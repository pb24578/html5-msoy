from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from rest.models import Room
from ...models import ChannelRoom
from .broadcasts import broadcast_message, broadcast_avatar_position
import humps
import json


class WorldConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Authenticates the user that is attempting to connect to this world.
        """

        self.group_id = self.scope['url_route']['kwargs']['id']
        self.group_name = str(self.group_id)

        # validate that this room exists
        def is_room_exist():
            try:
                Room.objects.get(id=self.group_id)
            except Room.DoesNotExist:
                return False
            return True
        room_exists = await sync_to_async(is_room_exist)()
        if not room_exists:
            await self.close()
            return

        # add this user to the channel's room
        self.channel_room = await sync_to_async(ChannelRoom.objects.add)(
            self.group_id, self.group_name, self.channel_name, user=self.scope['user']
        )

        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnects the user session from the world.
        """

        await sync_to_async(ChannelRoom.objects.remove)(self.group_name, self.channel_name)

        await self.close()

    async def receive(self, text_data):
        """
        Handles a message sent in this world, and sends it to the
        other users also connected in the world.
        """

        json_data = json.loads(text_data)

        # check if the data has an invalid format
        if not 'type' in json_data or not 'payload' in json_data:
            return

        type = json_data['type']

        if type == 'message':
            await broadcast_message(self.group_name, self.channel_name, json_data)
        elif type == 'avatar.position':
            await broadcast_avatar_position(self.group_name, self.channel_name, json_data)
            
    async def participants(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def avatar_position(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def message(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def connection_error(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))
