from django.urls import path

from .views import (
    ForgotPasswordAPIView,
    LoginAPIView,
    ProfileAPIView,
    RegisterAPIView,
    ResetPasswordAPIView,
)


urlpatterns = [
    path("login/", LoginAPIView.as_view(), name="login"),
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("forgot-password/", ForgotPasswordAPIView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
    path("me/", ProfileAPIView.as_view(), name="profile"),
]
