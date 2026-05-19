from django.urls import path

from .views import EventListCreateAPIView, EventRetrieveAPIView


urlpatterns = [
    path("", EventListCreateAPIView.as_view(), name="event-list-create"),
    path("<str:code>/", EventRetrieveAPIView.as_view(), name="event-detail"),
]

