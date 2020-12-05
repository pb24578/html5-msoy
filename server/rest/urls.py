from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('session', views.SessionView.as_view()),
    path('login', views.LoginView.as_view()),
    path('signup', views.SignupView.as_view()),
    path('profiles/<int:id>', views.ProfilesView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
