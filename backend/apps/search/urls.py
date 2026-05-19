from django.urls import path

from .views import GuestSearchAPIView


urlpatterns = [
    path("", GuestSearchAPIView.as_view(), name="guest-search"),
]

