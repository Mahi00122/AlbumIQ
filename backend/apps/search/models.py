import uuid

from django.db import models


def selfie_upload_path(instance, filename: str) -> str:
    return f"events/{instance.event.event_code}/selfies/{filename}"


class GuestSearch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE, related_name="guest_searches")
    selfie = models.ImageField(upload_to=selfie_upload_path)
    search_time = models.DateTimeField(auto_now_add=True)
    matched_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("-search_time",)

    def __str__(self) -> str:
        return f"{self.event.event_code} search @ {self.search_time:%Y-%m-%d %H:%M:%S}"

