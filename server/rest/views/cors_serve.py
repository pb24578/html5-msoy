from django.contrib.staticfiles.views import serve
from django.conf import settings


def cors_serve(request, path, insecure=False, **kwargs):
    """
    Serves static and media files to allow access for CORS. This should only be ran in development.
    For production, use a separate webserver to host the media and static files instead of Django.
    https://stackoverflow.com/questions/62665049/how-to-fix-cors-error-when-loading-static-file-served-by-django-runserver
    """

    kwargs.pop('document_root')
    response = serve(request, path, insecure=insecure, **kwargs)
    response['Access-Control-Allow-Origin'] = '*'
    return response
