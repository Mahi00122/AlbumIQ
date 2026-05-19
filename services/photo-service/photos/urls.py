from django.urls import path

from .views import photo_list, upload_photos


urlpatterns = [
    path("", photo_list),
    path("upload/", upload_photos),
]
