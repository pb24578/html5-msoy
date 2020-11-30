from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from urllib.parse import parse_qs


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        return token.user
    except:
        return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return TokenAuthMiddlewareInstance(scope, self)

class TokenAuthMiddlewareInstance:
    """
    Token authorization middleware for Django Channels 2
    """

    def __init__(self, scope, middleware):
        self.scope = scope
        self.middleware = middleware
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        close_old_connections()
        try:
            query_params = parse_qs(self.scope['query_string'].decode('utf8'))
            token_key = query_params.get('token', (None,))[0]
            user = await get_user(token_key)
            self.scope['user'] = user
        except Exception as e:
            self.scope['user'] = AnonymousUser()
        inner = self.inner(self.scope)
        return await inner(receive, send)

TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
