from django.urls import include, path


urlpatterns = [
    path("api/search/", include("search.urls")),
]
