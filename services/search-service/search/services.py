import numpy as np

from .repositories import SearchRepository


class SearchService:
    @staticmethod
    def compare_faces(known, unknown):
        distance = np.linalg.norm(np.array(known) - np.array(unknown))
        return float(distance)

    @staticmethod
    def record_search(event_code, selfie_name, total_matches=0):
        return SearchRepository.create_request(
            event_code=event_code,
            selfie_name=selfie_name,
            total_matches=total_matches,
        )
