from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

media_path = []
static_path = []
if settings.DEBUG:
    media_path = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT, view=views.cors_serve)
    static_path = static(settings.STATIC_URL, document_root=settings.STATIC_ROOT, view=views.cors_serve)

urlpatterns = [
    path('session', views.SessionView.as_view()),
    path('login', views.LoginView.as_view()),
    path('signup', views.SignupView.as_view()),
    path('rooms', views.RoomsView.as_view()),
    path('profiles/<int:id>', views.ProfilesView.as_view()),
] + static_path + media_path
