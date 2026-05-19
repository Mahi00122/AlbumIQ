from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import generics, permissions, response, status
from rest_framework.views import APIView

from .password_reset import mask_phone_number, send_password_reset_otp, verify_password_reset_otp
from .serializers import (
    ForgotPasswordSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)


User = get_user_model()


class LoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = serializer.validated_data

        return response.Response(
            {
                "user": UserSerializer(payload["user"]).data,
                "access": payload["access"],
                "refresh": payload["refresh"],
            },
            status=status.HTTP_200_OK,
        )


class RegisterAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        login_payload = LoginSerializer(
            data={
                "email": user.email,
                "password": request.data.get("password", ""),
            }
        )
        login_payload.is_valid(raise_exception=True)
        payload = login_payload.validated_data

        return response.Response(
            {
                "message": "Photographer account created successfully.",
                "user": UserSerializer(payload["user"]).data,
                "access": payload["access"],
                "refresh": payload["refresh"],
            },
            status=status.HTTP_201_CREATED,
        )


class ForgotPasswordAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email, is_active=True).first()

        if not user:
            return response.Response(
                {
                    "message": "If a photographer account exists, a reset code will be sent.",
                    "delivery_status": "skipped",
                },
                status=status.HTTP_200_OK,
            )

        _, plain_code, sms_result = send_password_reset_otp(user)
        payload = {
            "message": "Reset code processed for this photographer account.",
            "delivery_status": sms_result.status,
            "delivery_detail": sms_result.detail,
            "phone_hint": mask_phone_number(user.phone_number),
        }
        if settings.DEBUG and settings.SMS_PROVIDER.lower() == "console":
            payload["debug_code"] = plain_code
        return response.Response(payload, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if not user:
            return response.Response(
                {"detail": "Invalid email or reset code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp = verify_password_reset_otp(user=user, plain_code=serializer.validated_data["otp_code"])
        if not otp:
            return response.Response(
                {"detail": "Invalid or expired reset code."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        otp.used_at = timezone.now()
        otp.save(update_fields=["used_at"])

        return response.Response(
            {"message": "Password updated successfully. You can sign in now."},
            status=status.HTTP_200_OK,
        )


class ProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "PUT"):
            return ProfileUpdateSerializer
        return UserSerializer
