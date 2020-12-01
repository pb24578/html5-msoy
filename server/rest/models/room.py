from django.db import models
from .user import User


class Room(models.Model):
    name = models.CharField(default="Home", max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.name} ({self.id})"
