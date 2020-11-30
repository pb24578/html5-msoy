from django.contrib import admin
from channels_presence.models import Room, Presence

admin.site.register(Room)
admin.site.register(Presence)