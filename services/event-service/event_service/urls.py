from django.urls import include, path


urlpatterns = [
    path("api/events/", include("events.urls")),
]
