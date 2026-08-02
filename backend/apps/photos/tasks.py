from celery import shared_task
from deepface import DeepFace
from .models import Photo
import os


# We kept the excellent retry logic from the starter template!
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_photo_embeddings(self, photo_id: str):
    try:
        # 1. Get the photo from the database
        photo = Photo.objects.get(id=photo_id)
        print(f"Starting AI processing for Photo ID: {photo.id}")

        # 2. Get the file path
        img_path = photo.image.path

        # 3. Extract 512-dimensional embeddings using our new ArcFace model!
        detections = DeepFace.represent(
            img_path=img_path, model_name="ArcFace", enforce_detection=False
        )

        print(f"SUCCESS: Extracted {len(detections)} face(s) from Photo {photo_id}")

        # We will connect FAISS and FaceEmbedding in the next phase!

        return {"photo_id": photo_id, "faces_found": len(detections)}

    except Photo.DoesNotExist:
        print(f"Error: Photo {photo_id} not found.")
        return {"photo_id": photo_id, "faces_found": 0, "status": "failed - not found"}
    except Exception as e:
        print(f"AI Processing Error: {str(e)}")
        raise
