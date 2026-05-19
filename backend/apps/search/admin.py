from django.contrib import admin

from .models import GuestSearch


@admin.register(GuestSearch)
class GuestSearchAdmin(admin.ModelAdmin):
    list_display = ("event", "matched_count", "search_time")
    search_fields = ("event__event_code", "event__event_name")
    list_filter = ("search_time",)

