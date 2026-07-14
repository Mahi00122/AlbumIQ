import random
import string
from django.db import models
from django.contrib.auth.models import User


# 1. Helper function to generate 6-digit code
def generate_event_code():
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


# 2. The Event Model (For the Admin/Photographer)
class Event(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events")
    name = models.CharField(max_length=255)  # e.g., "Priya & Rahul Wedding"
    event_code = models.CharField(
        max_length=6, unique=True, default=generate_event_code
    )
    created_at = models.DateTimeField(auto_now_add=True)

    # We will generate the QR code later using a Python QR library
    qr_code_image = models.ImageField(upload_to="qrcodes/", blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.event_code})"


# 3. The Photo Model (Automatically goes to S3)
class Photo(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="photos")

    # Because of our settings.py, this will upload directly to AWS S3!
    image = models.ImageField(upload_to="event_photos/")

    # We will save the FAISS ID here later so we know which vector belongs to this photo
    faiss_id = models.BigIntegerField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo {self.id} for {self.event.name}"


# 4. The Guest Model (For WhatsApp/Email Re-engagement Loop)
class Guest(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="guests")
    whatsapp_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    # We will store the path to the 50KB client-side cropped selfie here
    selfie = models.ImageField(upload_to="guest_selfies/")

    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Guest {self.id} for {self.event.event_code}"
