from django.urls import path

from .views import event_collection


urlpatterns = [
    path("", event_collection),
]
