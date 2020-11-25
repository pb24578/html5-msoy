from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import random
import json


class RoomConsumer(AsyncWebsocketConsumer):
    rooms = dict()

    async def connect(self):
        """
        Handles a new connection in the room.
        """

        self.room_id = self.scope['url_route']['kwargs']['id']
        self.room_group_name = 'room_%s' % str(self.room_id)

        # join this room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # initialize this room's list of users if not already done
        if self.room_id not in self.rooms:
            self.rooms[self.room_id] = []

        # append this user into the room's users list
        users = self.rooms[self.room_id]
        self.user = f'Random User #{random.randint(0, 1000)}'
        users.append(self.user)

        # send the updated list of users to the all of users in this room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_data',
                'data': {'users': users}
            }
        )

    async def disconnect(self, close_code):
        """
        Disconnects the user session from the room.
        """

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        users = self.rooms[self.room_id]
        users.remove(self.user)

        # send the updated list of users to the all of users in this room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_data',
                'data': {'users': users}
            }
        )

    async def receive(self, text_data):
        """
        Handles a message sent in this room, and sends it to the
        other users also connected in the room.
        """

        json_data = json.loads(text_data)
        message = json_data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_data',
                'data': {'message': message}
            }
        )

    async def send_data(self, event):
        """
        Sends a data back to the user(s) connected in this room.
        """

        data = event['data']
        await self.send(text_data=json.dumps(data))
