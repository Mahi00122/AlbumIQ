from django.contrib import admin

from .models import FaceEmbedding


@admin.register(FaceEmbedding)
class FaceEmbeddingAdmin(admin.ModelAdmin):
    list_display = ("photo", "face_index", "created_at")
    search_fields = ("photo__event__event_code", "photo__original_filename")
    list_filter = ("created_at",)

