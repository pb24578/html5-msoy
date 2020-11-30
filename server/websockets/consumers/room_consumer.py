from os import sync
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels_presence.models import Room, Presence
import humps
import json


class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['id']
        self.group_name = 'room_%s' % str(self.group_id)

        # add this user to the room
        self.room = await sync_to_async(Room.objects.add)(self.group_name, self.channel_name, user=self.scope['user'])

        # receive all of the users in this room
        presences = await sync_to_async(Presence.objects.filter)(room=self.room)

        def get_old_channel_name():
            for presence in presences:
                if presence.user == self.scope['user'] and presence.channel_name != self.channel_name:
                    # this user is already connected to this room, so return the old channel name
                    return presence.channel_name
            return None

        # if the user is already connected to this room, then kick out the previous channel
        old_channel_name = await sync_to_async(get_old_channel_name)()
        if bool(old_channel_name):
            await self.channel_layer.send(
                old_channel_name,
                {
                    'type': 'kick',
                    'payload': {
                        "sender": "Server",
                        "reason": "You've been kicked out of the server because you connected somewhere else."
                    }
                }
            )

        # join the group channel
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

        # leave the group channel
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        # remove the user from this room
        await sync_to_async(Room.objects.remove)(self.group_name, self.channel_name)

        def prune_room():
            if not bool(self.room.get_users().count()):
                # there are no more users in this room, so delete it
                self.room.delete()
        await sync_to_async(prune_room)()

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

            def get_display_name():
                return self.scope['user'].username
            display_name = await sync_to_async(get_display_name)()

            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'message',
                    'payload': {'sender': display_name, 'message': message}
                }
            )

    async def group_send_participants(self):
        """
        Send the updated list of participants to all of the users in this room.
        """

        def get_participants():
            presences = Presence.objects.filter(room=self.room)
            participants = []
            for presence in presences:
                user = presence.user
                participant = {"id": user.id, "displayName": user.username}
                participants.append(participant)
            return participants
        participants = await sync_to_async(get_participants)()

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

    async def kick(self, event):
        await self.send(text_data=json.dumps(humps.camelize(event)))
