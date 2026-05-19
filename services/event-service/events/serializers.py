from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "event_name", "event_code", "event_date", "qr_code", "created_at"]


class CreateEventSerializer(serializers.Serializer):
    event_name = serializers.CharField(max_length=255)
    event_date = serializers.DateField()
