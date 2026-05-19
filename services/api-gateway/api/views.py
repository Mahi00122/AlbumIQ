import os

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


AUTH_SERVICE = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")
EVENT_SERVICE = os.getenv("EVENT_SERVICE_URL", "http://localhost:8002")
PHOTO_SERVICE = os.getenv("PHOTO_SERVICE_URL", "http://localhost:8003")
SEARCH_SERVICE = os.getenv("SEARCH_SERVICE_URL", "http://localhost:8004")


def _forward_request(request, base_url, downstream_path):
    url = f"{base_url}{downstream_path}"
    headers = {}
    content_type = request.headers.get("Content-Type", "")
    if content_type:
        headers["Content-Type"] = content_type

    if request.method == "GET":
        response = requests.get(url, params=request.GET.dict(), timeout=15)
    elif "multipart/form-data" in content_type:
        files = [
            (key, (uploaded_file.name, uploaded_file.file, uploaded_file.content_type))
            for key in request.FILES
            for uploaded_file in request.FILES.getlist(key)
        ]
        response = requests.request(
            method=request.method,
            url=url,
            data=request.POST.dict(),
            files=files,
            timeout=30,
        )
    else:
        response = requests.request(
            method=request.method,
            url=url,
            data=request.body or None,
            headers=headers,
            timeout=15,
        )

    try:
        payload = response.json()
    except ValueError:
        payload = {"message": response.text}

    return JsonResponse(payload, safe=False, status=response.status_code)


@csrf_exempt
def auth_proxy(request):
    return _forward_request(request, AUTH_SERVICE, "/api/auth/login/")


@csrf_exempt
def event_proxy(request):
    return _forward_request(request, EVENT_SERVICE, "/api/events/")


@csrf_exempt
def photo_proxy(request):
    return _forward_request(request, PHOTO_SERVICE, "/api/photos/upload/")


@csrf_exempt
def search_proxy(request):
    return _forward_request(request, SEARCH_SERVICE, "/api/search/images/")
