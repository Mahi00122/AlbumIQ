import uuid

from django.conf import settings
from django.db import models


def photo_upload_path(instance, filename: str) -> str:
    return f"events/{instance.event.event_code}/photos/{filename}"


class Photo(models.Model):
    class ProcessingStatus(models.TextChoices):
        QUEUED = "queued", "Queued"
        PROCESSING = "processing", "Processing"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey("events.Event", on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to=photo_upload_path)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="uploaded_photos",
        null=True,
        blank=True,
    )
    original_filename = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processing_status = models.CharField(
        max_length=16,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.QUEUED,
    )

    class Meta:
        ordering = ("-uploaded_at",)

    def __str__(self) -> str:
        return self.original_filename or self.image.name

