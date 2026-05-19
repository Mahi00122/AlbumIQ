from .models import Photo


class PhotoRepository:
    @staticmethod
    def create_photo(**data):
        return Photo.objects.create(**data)

    @staticmethod
    def list_by_event_code(event_code):
        return Photo.objects.filter(event_code=event_code).order_by("-uploaded_at")
