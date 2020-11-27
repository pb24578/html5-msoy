from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from rest_framework.authtoken.models import Token
import enum
import humps
import json


class CloseCode(enum.Enum):
    AlreadyConnected = 1


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

    async def authenticate(self, token):
        """
        Authenticates a new connection in the room.
        """

        # initialize this room's list of users if it hasn't already been
        if self.room_id not in self.rooms:
            self.rooms[self.room_id] = []
        participants = self.rooms[self.room_id]

        # attempt to receive the user based on its token
        try:
            token = await sync_to_async(Token.objects.get)(key=token)

            def get_user_id():
                return token.user.id

            def get_username():
                return token.user.username

            user_id = await sync_to_async(get_user_id)()
            username = await sync_to_async(get_username)()
            self.user = {"id": user_id, "display_name": username, "channel_name": self.channel_name}

            # disconnect the previous user's connection if it's trying to connect multiple times to this room
            for participant in participants:
                if participant["id"] == user_id:
                    await self.channel_layer.send(
                        participant["channel_name"],
                        {
                            'type': 'exit',
                            'payload': {
                                "sender": "Server",
                                "reason": "You've been kicked out of the server because you connected somewhere else."
                            }
                        }
                    )
        except:
            self.user = {"id": 0, "display_name": "Anonymous", "channel_name": self.channel_name}

        # append this user into the room's users list
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

        await self.close()

        participants = self.rooms[self.room_id]
        try:
            participants.remove(self.user)
        except:
            pass

        await self.group_send_participants()

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

        # handle this new connection that has been established
        if type == 'authenticate':
            await self.authenticate(payload['token'])

        # send a message to the users in this room
        if type == 'message':
            message = payload['message']

            # prevent blank messages from being sent
            if not bool(message) or message.isspace():
                return

            # strip off too many characters
            max_chars = 256
            message = message[0: max_chars]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'message',
                    'payload': {'sender': self.user['display_name'], 'message': message}
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
                'type': 'participants',
                'payload': {'participants': participants}
            }
        )

    async def participants(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def message(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))

    async def exit(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))
