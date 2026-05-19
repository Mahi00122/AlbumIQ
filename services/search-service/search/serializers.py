from rest_framework import serializers


class SearchImageSerializer(serializers.Serializer):
    event_code = serializers.CharField(max_length=20)
