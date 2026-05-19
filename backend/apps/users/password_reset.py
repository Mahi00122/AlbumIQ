from datetime import timedelta
import secrets

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from apps.events.notifications import send_sms_message

from .models import PasswordResetOTP, User


def mask_phone_number(phone_number: str) -> str:
    if len(phone_number) <= 4:
        return phone_number
    return f"{'*' * max(0, len(phone_number) - 4)}{phone_number[-4:]}"


def build_password_reset_message(code: str) -> str:
    return (
        f"FindMyShaadi Pics password reset code: {code}. "
        f"It expires in {settings.PASSWORD_RESET_OTP_TTL_MINUTES} minutes."
    )


def create_password_reset_otp(user: User) -> tuple[PasswordResetOTP, str]:
    PasswordResetOTP.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())

    plain_code = "".join(secrets.choice("0123456789") for _ in range(settings.PASSWORD_RESET_OTP_LENGTH))
    otp = PasswordResetOTP.objects.create(
        user=user,
        code_hash=make_password(plain_code),
        expires_at=timezone.now() + timedelta(minutes=settings.PASSWORD_RESET_OTP_TTL_MINUTES),
    )
    return otp, plain_code


def send_password_reset_otp(user: User):
    otp, plain_code = create_password_reset_otp(user)
    sms_result = send_sms_message(
        to_phone_number=user.phone_number,
        body=build_password_reset_message(plain_code),
    )
    return otp, plain_code, sms_result


def verify_password_reset_otp(*, user: User, plain_code: str) -> PasswordResetOTP | None:
    candidates = PasswordResetOTP.objects.filter(
        user=user,
        used_at__isnull=True,
    ).order_by("-created_at")

    now = timezone.now()
    for otp in candidates:
        if otp.expires_at <= now:
            continue
        if check_password(plain_code, otp.code_hash):
            return otp
    return None
