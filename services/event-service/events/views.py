from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .repositories import EventRepository
from .serializers import CreateEventSerializer, EventSerializer
from .services import EventService


@api_view(["GET", "POST"])
def event_collection(request):
    if request.method == "GET":
        events = EventRepository.list_events()
        return Response(EventSerializer(events, many=True).data)

    serializer = CreateEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    event = EventService.create_event(serializer.validated_data)
    return Response(EventSerializer(event).data, status=status.HTTP_201_CREATED)
