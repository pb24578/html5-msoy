from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        pass