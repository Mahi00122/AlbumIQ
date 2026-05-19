from celery import shared_task

from apps.face_engine.models import FaceEmbedding
from apps.face_engine.services import FaceEngineUnavailable, extract_embeddings

from .models import Photo


@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, retry_kwargs={"max_retries": 3})
def process_photo_embeddings(self, photo_id: str):
    photo = Photo.objects.get(id=photo_id)
    photo.processing_status = Photo.ProcessingStatus.PROCESSING
    photo.save(update_fields=["processing_status"])

    try:
        detections = extract_embeddings(photo.image.path)

        FaceEmbedding.objects.filter(photo=photo).delete()
        FaceEmbedding.objects.bulk_create(
            [
                FaceEmbedding(
                    photo=photo,
                    face_index=index,
                    embedding_vector=detected.embedding_vector,
                    face_location=detected.face_location,
                )
                for index, detected in enumerate(detections)
            ]
        )

        photo.processing_status = Photo.ProcessingStatus.COMPLETED
        photo.save(update_fields=["processing_status"])
        return {"photo_id": photo_id, "faces_found": len(detections)}
    except FaceEngineUnavailable:
        photo.processing_status = Photo.ProcessingStatus.FAILED
        photo.save(update_fields=["processing_status"])
        return {"photo_id": photo_id, "faces_found": 0, "status": "failed"}
    except Exception:
        photo.processing_status = Photo.ProcessingStatus.FAILED
        photo.save(update_fields=["processing_status"])
        raise
