from base64 import b64encode
from dataclasses import dataclass
import json
import logging
from urllib import error, parse, request

from django.conf import settings


logger = logging.getLogger(__name__)


@dataclass
class SMSNotificationResult:
    status: str
    detail: str

    @property
    def sent(self) -> bool:
        return self.status == "sent"


def send_sms_message(*, to_phone_number: str, body: str) -> SMSNotificationResult:
    if not to_phone_number:
        return SMSNotificationResult(status="skipped", detail="Recipient phone number is missing.")

    provider = settings.SMS_PROVIDER.lower()
    if not provider:
        return SMSNotificationResult(
            status="skipped",
            detail="SMS provider is not configured. Set SMS_PROVIDER=twilio to enable delivery.",
        )

    if provider == "console":
        logger.info("Console SMS to %s: %s", to_phone_number, body)
        return SMSNotificationResult(status="sent", detail="SMS logged to console provider.")

    if provider != "twilio":
        return SMSNotificationResult(
            status="skipped",
            detail="Unsupported SMS provider. Use twilio or console.",
        )

    if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not settings.TWILIO_FROM_NUMBER:
        return SMSNotificationResult(
            status="skipped",
            detail="Twilio credentials are incomplete. Add account SID, auth token, and from number.",
        )

    auth_value = b64encode(
        f"{settings.TWILIO_ACCOUNT_SID}:{settings.TWILIO_AUTH_TOKEN}".encode("utf-8")
    ).decode("utf-8")
    payload = parse.urlencode(
        {
            "To": to_phone_number,
            "From": settings.TWILIO_FROM_NUMBER,
            "Body": body,
        }
    ).encode("utf-8")
    sms_url = (
        f"https://api.twilio.com/2010-04-01/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"
    )
    http_request = request.Request(
        sms_url,
        data=payload,
        headers={
            "Authorization": f"Basic {auth_value}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )

    try:
        with request.urlopen(http_request, timeout=15) as http_response:
            response_payload = json.loads(http_response.read().decode("utf-8"))
    except error.HTTPError as exc:
        try:
            response_payload = json.loads(exc.read().decode("utf-8"))
            detail = response_payload.get("message") or response_payload.get("detail") or "Twilio rejected the SMS request."
        except Exception:
            detail = "Twilio rejected the SMS request."
        return SMSNotificationResult(status="failed", detail=detail)
    except Exception as exc:
        return SMSNotificationResult(status="failed", detail=str(exc))

    return SMSNotificationResult(
        status="sent",
        detail=response_payload.get("sid", "SMS sent successfully."),
    )


def build_event_code_sms_message(*, photographer_name: str, event_name: str, event_code: str, event_date, guest_portal_url: str) -> str:
    display_name = photographer_name or "Photographer"
    return (
        f"Hi {display_name}, your FindMyShaadi Pics event '{event_name}' is ready. "
        f"Event code: {event_code}. Date: {event_date}. Guest portal: {guest_portal_url}"
    )


def send_event_code_sms(*, to_phone_number: str, photographer_name: str, event_name: str, event_code: str, event_date, guest_portal_url: str) -> SMSNotificationResult:
    return send_sms_message(
        to_phone_number=to_phone_number,
        body=build_event_code_sms_message(
            photographer_name=photographer_name,
            event_name=event_name,
            event_code=event_code,
            event_date=event_date,
            guest_portal_url=guest_portal_url,
        ),
    )
