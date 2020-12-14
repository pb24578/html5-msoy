from django.contrib.staticfiles.views import serve
from django.conf import settings


def cors_serve(request, path, insecure=False, **kwargs):
    """
    Serves static and media files using the CORS configurations.
    https://stackoverflow.com/questions/62665049/how-to-fix-cors-error-when-loading-static-file-served-by-django-runserver
    """

    kwargs.pop('document_root')
    response = serve(request, path, insecure=insecure, **kwargs)

    # use the settings from Django CorsHeaders
    if settings.CORS_ORIGIN_ALLOW_ALL:
        response['Access-Control-Allow-Origin'] = '*'

    return response
