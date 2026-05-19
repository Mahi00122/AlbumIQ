from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .repositories import PhotoRepository
from .serializers import PhotoSerializer, UploadPhotosSerializer
from .services import PhotoService


@api_view(["GET"])
def photo_list(request):
    event_code = request.query_params.get("event_code")
    photos = PhotoRepository.list_by_event_code(event_code) if event_code else []
    return Response(PhotoSerializer(photos, many=True).data)


@api_view(["POST"])
def upload_photos(request):
    serializer = UploadPhotosSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    files = request.FILES.getlist("images")
    uploaded = PhotoService.upload_photos(serializer.validated_data["event_code"], files)
    return Response(PhotoSerializer(uploaded, many=True).data, status=status.HTTP_201_CREATED)
