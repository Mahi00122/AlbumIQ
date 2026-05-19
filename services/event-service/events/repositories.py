from .models import Event


class EventRepository:
    @staticmethod
    def create_event(**data):
        return Event.objects.create(**data)

    @staticmethod
    def list_events():
        return Event.objects.order_by("-created_at")
