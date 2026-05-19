from .models import SearchRequest


class SearchRepository:
    @staticmethod
    def create_request(**data):
        return SearchRequest.objects.create(**data)
