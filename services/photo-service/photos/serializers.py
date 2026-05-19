from rest_framework import serializers

from .models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["id", "event_code", "image_url", "uploaded_at", "processing_status"]


class UploadPhotosSerializer(serializers.Serializer):
    event_code = serializers.CharField(max_length=20)
