from django.urls import path

from .views import search_images


urlpatterns = [
    path("images/", search_images),
]
