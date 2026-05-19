from io import BytesIO
import secrets
import string

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import qrcode

from .models import Event


def generate_event_code(length: int = 4) -> str:
    alphabet = string.ascii_uppercase + string.digits

    while True:
        candidate = f"WED-{''.join(secrets.choice(alphabet) for _ in range(length))}"
        if not Event.objects.filter(event_code=candidate).exists():
            return candidate


def build_guest_portal_url(event_code: str) -> str:
    base_url = settings.FRONTEND_BASE_URL.rstrip("/")
    return f"{base_url}/event/{event_code}"


def generate_qr_code_asset(event_code: str) -> str:
    guest_url = build_guest_portal_url(event_code)
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(guest_url)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    image.save(buffer, format="PNG")

    asset_path = f"qr_codes/{event_code.lower()}.png"
    if default_storage.exists(asset_path):
        default_storage.delete(asset_path)

    default_storage.save(asset_path, ContentFile(buffer.getvalue()))
    return default_storage.url(asset_path)

