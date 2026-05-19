import random
import string

from .repositories import EventRepository


class EventService:
    @staticmethod
    def generate_event_code():
        return "WED-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))

    @staticmethod
    def create_event(validated_data):
        event_code = EventService.generate_event_code()
        return EventRepository.create_event(event_code=event_code, qr_code="", **validated_data)
