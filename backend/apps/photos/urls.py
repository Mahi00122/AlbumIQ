from django.urls import path

from .views import PhotoStatusAPIView, PhotoUploadAPIView


urlpatterns = [
    path("upload/", PhotoUploadAPIView.as_view(), name="photo-upload"),
    path("status/<uuid:event_id>/", PhotoStatusAPIView.as_view(), name="photo-status"),
]

