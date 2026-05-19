from django.contrib import admin

from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("original_filename", "event", "processing_status", "uploaded_at")
    search_fields = ("original_filename", "event__event_code", "event__event_name")
    list_filter = ("processing_status", "uploaded_at")

