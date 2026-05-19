from django.urls import path

from .views import auth_proxy, event_proxy, photo_proxy, search_proxy


urlpatterns = [
    path("auth/", auth_proxy),
    path("events/", event_proxy),
    path("photos/", photo_proxy),
    path("search/", search_proxy),
]
