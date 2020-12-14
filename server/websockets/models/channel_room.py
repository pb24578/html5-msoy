from django.db import models
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest.models import Room, User
from .participant import Participant
from ..signals import participants_changed

channel_layer = get_channel_layer()


class ChannelRoomManager(models.Manager):
    def add(self, room_id, room_channel_name, user_channel_name, user=None):
        """
        Creates a new room if it doesn't exist, then adds a new channel into the room.
        """

        try:
            room = Room.objects.get(id=room_id)
            channel_room, created = ChannelRoom.objects.get_or_create(channel_name=room_channel_name, room=room)
            channel_room.add_participant(user_channel_name, user)
        except Exception as e:
            return

        return channel_room

    def remove(self, room_channel_name, user_channel_name):
        """
        Removes a channel (using its channel name) from the room.
        """

        try:
            channel_room = ChannelRoom.objects.get(channel_name=room_channel_name)
            channel_room.remove_participant(user_channel_name)
        except ChannelRoom.DoesNotExist:
            return


class ChannelRoom(models.Model):
    channel_name = models.CharField(
        max_length=255, unique=True, help_text="Group channel name for this room"
    )
    room = models.ForeignKey(Room, default=1, on_delete=models.CASCADE)

    objects = ChannelRoomManager()

    def __str__(self):
        return str(self.room)

    def add_participant(self, channel_name, user=None):
        """
        Adds a new channel into the room.
        """

        if user and user.is_authenticated:
            authed_user = user
            duplicate_participant = Participant.objects.filter(user=authed_user).first()
            if bool(duplicate_participant):
                # remove the duplicate participant from this room
                duplicate_participant.delete()
                async_to_sync(channel_layer.send)(
                    duplicate_participant.channel_name,
                    {
                        'type': 'connection.error',
                        'payload': {
                            'sender': 'Server',
                            'reason': "You've been kicked out of the server because you connected somewhere else."
                        }
                    }
                )
        else:
            authed_user = None
        
        participant, created = Participant.objects.get_or_create(
            channel_room=self, channel_name=channel_name, user=authed_user
        )

        if created:
            async_to_sync(channel_layer.group_add)(self.channel_name, channel_name)
            self.broadcast_changed(added=True)

        return created

    def remove_participant(self, channel_name=None):
        """
        Removes an existing channel from the room.
        """
        
        try:
            participant = Participant.objects.get(channel_room=self, channel_name=channel_name)
        except Participant.DoesNotExist:
            return

        async_to_sync(channel_layer.group_discard)(self.channel_name, channel_name)
        participant.delete()
        self.broadcast_changed(removed=True)
        self.prune_room()

    def get_users(self):
        """
        Returns all of the authenticated users in this room. This does not include anonymous users.
        """

        return User.objects.filter(participant__room=self).distinct()

    def get_anonymous_count(self):
        """
        Returns the number of anonymous users in this room.
        """

        return self.participant_set.filter(user=None).count()

    def get_participants(self):
        """
        Returns all of the participants in this room.
        """

        return Participant.objects.filter(channel_room=self).distinct()

    def prune_room(self):
        """
        Deletes the room if no more participants exist in this room.
        """

        participants_count = self.get_participants().count()
        if participants_count == 0:
            self.delete()

    def broadcast_changed(self, added=False, removed=False):
        """
        Broadcasts that the participants have changed to the entire room.
        This should be called whenever participants are either added or removed from the room.
        """

        participants_changed.send(
            sender=self.__class__,
            channel_room=self,
            added=added,
            removed=removed
        )
