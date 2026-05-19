from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(_request):
    return JsonResponse({"status": "ok"})


def api_home(_request):
    return JsonResponse(
        {
            "service": "AI Wedding Photo Finder API",
            "status": "ok",
            "frontend_url": settings.FRONTEND_BASE_URL,
            "health_url": "/api/health/",
            "admin_url": "/admin/",
        }
    )


urlpatterns = [
    path("", api_home, name="api-home"),
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health-check"),
    path("api/auth/", include("apps.users.urls")),
    path("api/events/", include("apps.events.urls")),
    path("api/photos/", include("apps.photos.urls")),
    path("api/search/", include("apps.search.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
