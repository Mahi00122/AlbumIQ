from django.db import models


class Photo(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_PROCESSING = "PROCESSING"
    STATUS_READY = "READY"

    event_code = models.CharField(max_length=20)
    image_url = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processing_status = models.CharField(max_length=20, default=STATUS_PENDING)

    def __str__(self):
        return f"{self.event_code} - {self.processing_status}"
