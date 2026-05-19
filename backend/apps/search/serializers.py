from rest_framework import serializers


class GuestSearchRequestSerializer(serializers.Serializer):
    event_code = serializers.CharField(max_length=16)
    selfie = serializers.ImageField()


class MatchedImageSerializer(serializers.Serializer):
    photo_id = serializers.UUIDField()
    image_url = serializers.URLField()
    similarity = serializers.FloatField()

