from django.conf import settings

from apps.face_engine.models import FaceEmbedding
from apps.face_engine.services import extract_embeddings, find_matches


def run_guest_search(search):
    query_faces = extract_embeddings(search.selfie.path)
    if not query_faces:
        search.matched_count = 0
        search.save(update_fields=["matched_count"])
        return []

    candidate_embeddings = list(
        FaceEmbedding.objects.select_related("photo").filter(photo__event=search.event)
    )
    best_matches_by_photo = {}

    for query_face in query_faces:
        matches = find_matches(
            query_face.embedding_vector,
            candidate_embeddings,
            threshold=settings.FACE_MATCH_THRESHOLD,
        )
        for match in matches:
            photo = match["embedding"].photo
            existing = best_matches_by_photo.get(photo.id)
            if existing is None or match["distance"] < existing["distance"]:
                best_matches_by_photo[photo.id] = {
                    "photo": photo,
                    "distance": match["distance"],
                    "similarity": match["similarity"],
                }

    ordered_matches = sorted(best_matches_by_photo.values(), key=lambda item: item["distance"])
    search.matched_count = len(ordered_matches)
    search.save(update_fields=["matched_count"])
    return ordered_matches
