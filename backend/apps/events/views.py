from rest_framework import generics, permissions

from .models import Event
from .serializers import EventSerializer


class EventListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(created_by=self.request.user).prefetch_related("photos")


class EventRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "event_code"
    lookup_url_kwarg = "code"
    queryset = Event.objects.all()

