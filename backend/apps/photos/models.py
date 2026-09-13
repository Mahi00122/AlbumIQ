from django.db import models
from apps.events.models import Event
from django.db.models.signals import post_save
from django.dispatch import receiver


class Photo(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="event_photos/")
    faiss_id = models.BigIntegerField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo {self.id} for {self.event.event_name}"


# This "listens" for anytime a new Photo is saved
@receiver(post_save, sender=Photo)
def trigger_ai_processing(sender, instance, created, **kwargs):
    if created:  # Only run this if it's a BRAND NEW photo
        from .tasks import process_photo_embeddings

        # .delay() is the magic word that sends it to the Celery background worker!
        process_photo_embeddings.delay(instance.id)
