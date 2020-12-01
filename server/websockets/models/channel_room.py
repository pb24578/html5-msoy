from django.db import models
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest.models import Room, User
from .participant import Participant
from ..signals import participants_changed

channel_layer = get_channel_layer()


class ChannelRoomManager(models.Manager):
    def add(self, room_id, room_channel_name, user_channel_name, user=None):
        try:
            room = Room.objects.get(id=room_id)
            channel_room, created = ChannelRoom.objects.get_or_create(channel_name=room_channel_name, room=room)
            channel_room.add_participant(user_channel_name, user)
        except:
            return
        return channel_room

    def remove(self, room_channel_name, user_channel_name):
        try:
            channel_room = ChannelRoom.objects.get(channel_name=room_channel_name)
        except ChannelRoom.DoesNotExist:
            return
        channel_room.remove_participant(user_channel_name)


class ChannelRoom(models.Model):
    channel_name = models.CharField(
        max_length=255, unique=True, help_text="Group channel name for this room"
    )
    room = models.ForeignKey(Room, default=1, on_delete=models.CASCADE)

    objects = ChannelRoomManager()

    def __str__(self):
        return str(self.room)

    def add_participant(self, channel_name, user=None):
        if user and user.is_authenticated:
            authed_user = user
        else:
            authed_user = None
        
        participant, created = Participant.objects.get_or_create(
            channel_room=self, channel_name=channel_name, user=authed_user
        )

        if created:
            async_to_sync(channel_layer.group_add)(self.channel_name, channel_name)
            self.broadcast_changed(added=True)

    def remove_participant(self, channel_name=None, participant=None):
        if participant is None:
            try:
                participant = Participant.objects.get(channel_room=self, channel_name=channel_name)
            except Participant.DoesNotExist:
                return

        async_to_sync(channel_layer.group_discard)(self.channel_name, participant.channel_name)
        participant.delete()
        self.broadcast_changed(removed=True)
        self.prune_room()

    def get_users(self):
        return User.objects.filter(participant__room=self).distinct()

    def get_anonymous_count(self):
        return self.participant_set.filter(user=None).count()

    def get_participants(self):
        return Participant.objects.filter(channel_room=self).distinct()

    def get_duplicate_participants(self, channel_name, user=None):
        if not user or user.is_anonymous:
            return

        return Participant.objects.filter(channel_room=self, user=user).exclude(channel_name=channel_name)

    def prune_room(self):
        """
        If no more participants exist in this room, then delete it.
        """

        participants_count = self.get_participants().count()
        if participants_count == 0:
            self.delete()

    def broadcast_changed(self, added=False, removed=False):
        participants_changed.send(
            sender=self.__class__,
            channel_room=self,
            added=added,
            removed=removed
        )
