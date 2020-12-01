from django.db import models
from rest.models import User


class Participant(models.Model):
    channel_room = models.ForeignKey("ChannelRoom", on_delete=models.CASCADE)
    channel_name = models.CharField(
        max_length=255, help_text="Reply channel for connection that is present"
    )
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.channel_name

    class Meta:
        unique_together = [("channel_room", "channel_name")]
