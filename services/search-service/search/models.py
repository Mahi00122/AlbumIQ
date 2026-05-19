from django.db import models


class SearchRequest(models.Model):
    event_code = models.CharField(max_length=20)
    selfie_name = models.CharField(max_length=255)
    total_matches = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_code} - {self.selfie_name}"
