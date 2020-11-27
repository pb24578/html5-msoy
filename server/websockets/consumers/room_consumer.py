from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from rest_framework.authtoken.models import Token
import json


class RoomConsumer(AsyncWebsocketConsumer):
    rooms = dict()

    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.room_group_name = 'room_%s' % str(self.room_id)

        # join this room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def handle_connection(self, token):
        """
        Handles a new connection in the room.
        """

        # initialize this room's list of users if it hasn't already been
        if self.room_id not in self.rooms:
            self.rooms[self.room_id] = []

        # attempt to receive the user based on its token
        try:
            token = await sync_to_async(Token.objects.get)(key=token)

            def get_user_id():
                return token.user.id

            def get_username():
                return token.user.username

            user_id = await sync_to_async(get_user_id)()
            username = await sync_to_async(get_username)()
            self.user = {"id": user_id, "displayName": username}
        except:
            self.user = {"id": 0, "displayName": 'Anonymous'}

        # append this user into the room's users list
        participants = self.rooms[self.room_id]
        participants.append(self.user)

        await self.group_send_participants()

    async def disconnect(self, close_code):
        """
        Disconnects the user session from the room.
        """

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        participants = self.rooms[self.room_id]
        participants.remove(self.user)

        await self.group_send_participants()

    async def receive(self, text_data):
        """
        Handles a message sent in this room, and sends it to the
        other users also connected in the room.
        """

        json_data = json.loads(text_data)

        # handle this new connection that has been established
        if 'token' in json_data:
            await self.handle_connection(json_data['token'])

        # send a message to the users in this room
        if 'message' in json_data:
            message = json_data['message']

            # prevent blank messages from being sent
            if not bool(message) or message.isspace():
                return

            # strip off too many characters
            max_chars = 2096
            message = message[0: max_chars]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_data',
                    'data': {'displayName': self.user['displayName'], 'message': message}
                }
            )

    async def group_send_participants(self):
        """
        Send the updated list of participants to all of the users in this room.
        """

        participants = self.rooms[self.room_id]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_data',
                'data': {'participants': participants}
            }
        )

    async def send_data(self, event):
        """
        Sends a data back to the user(s) connected in this room.
        """

        data = event['data']
        await self.send(text_data=json.dumps(data))
