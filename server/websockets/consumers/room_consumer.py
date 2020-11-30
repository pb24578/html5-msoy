from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import humps
import json


class RoomConsumer(AsyncWebsocketConsumer):
    rooms = dict()

    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['id']
        self.group_name = 'room_%s' % str(self.group_id)

        # initialize this room's list of users if it hasn't already been
        if self.group_id not in self.rooms:
            self.rooms[self.group_id] = []
        participants = self.rooms[self.group_id]

        def get_user():
            user = self.scope['user']
            return {"id": user.id, "display_name": user.username, "channel_name": self.channel_name}

        # attempt to receive the user based on its token
        try:
            self.user = await sync_to_async(get_user)()

            # disconnect the previous user's connection if it's trying to connect multiple times to this room
            for participant in participants:
                if participant["id"] == self.user["id"]:
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
        except Exception as e:
            self.user = {"id": 0, "display_name": "Anonymous", "channel_name": self.channel_name}

        # append this user into the room's users list
        participants.append(self.user)

        # join this room
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        await self.group_send_participants()

    async def disconnect(self, close_code):
        """
        Disconnects the user session from the room.
        """

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        participants = self.rooms[self.group_id]
        try:
            participants.remove(self.user)
        except:
            pass

        await self.close()

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
                self.group_name,
                {
                    'type': 'message',
                    'payload': {'sender': self.user['display_name'], 'message': message}
                }
            )

    async def group_send_participants(self):
        """
        Send the updated list of participants to all of the users in this room.
        """

        participants = self.rooms[self.group_id]

        await self.channel_layer.group_send(
            self.group_name,
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
