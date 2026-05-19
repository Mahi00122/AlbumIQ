from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import LoginSerializer, UserSerializer
from .services import AuthService


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = AuthService.login(serializer.validated_data["email"])
    if not user:
        return Response({"message": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(UserSerializer(user).data)
