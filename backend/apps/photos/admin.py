from django.contrib import admin
from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "image", "faiss_id", "uploaded_at")
    list_filter = ("event", "uploaded_at")
