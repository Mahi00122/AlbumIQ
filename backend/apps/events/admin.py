from django.contrib import admin

from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("event_name", "event_code", "event_date", "created_by", "created_at")
    search_fields = ("event_name", "event_code")
    list_filter = ("event_date", "created_at")

