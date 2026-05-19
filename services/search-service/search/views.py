from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import SearchImageSerializer
from .services import SearchService


@api_view(["POST"])
def search_images(request):
    serializer = SearchImageSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    selfie = request.FILES.get("selfie")
    SearchService.record_search(
        event_code=serializer.validated_data["event_code"],
        selfie_name=selfie.name if selfie else "unknown-selfie",
        total_matches=0,
    )

    return Response(
        {
            "event_code": serializer.validated_data["event_code"],
            "matched_images": [],
            "message": "Search workflow scaffold is ready for AI integration.",
        }
    )
