import re

from django.contrib.auth import get_user_model, password_validation
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()
PHONE_PATTERN = re.compile(r"^\+?[0-9]{10,15}$")


def normalize_phone_number(value: str) -> str:
    cleaned = re.sub(r"[\s\-()]", "", value or "")
    if not PHONE_PATTERN.match(cleaned):
        raise serializers.ValidationError("Enter a valid phone number with country code if needed.")
    return cleaned


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "username", "full_name", "phone_number", "first_name", "last_name")


class ProfileUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    phone_number = serializers.CharField()

    class Meta:
        model = User
        fields = ("id", "email", "username", "full_name", "phone_number", "first_name", "last_name")
        read_only_fields = ("id", "email", "username")

    def validate_phone_number(self, value):
        return normalize_phone_number(value)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        password = attrs["password"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError("Invalid email or password.") from exc

        if not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return email

    def validate_phone_number(self, value):
        return normalize_phone_number(value)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        password_validation.validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        full_name = validated_data["full_name"].strip()
        email = validated_data["email"]
        phone_number = validated_data["phone_number"]
        password = validated_data["password"]

        base_username = email.split("@")[0][:120] or "photographer"
        username = base_username
        suffix = 1

        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            full_name=full_name,
            phone_number=phone_number,
            password=password,
        )

        return user


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.RegexField(regex=r"^[0-9]{6}$", max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        user = User.objects.filter(email__iexact=attrs["email"]).first()
        password_validation.validate_password(attrs["new_password"], user=user)
        return attrs
