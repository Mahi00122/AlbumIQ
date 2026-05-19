from django.db import models


class User(models.Model):
    ROLE_ADMIN = "ADMIN"
    ROLE_CHOICES = [(ROLE_ADMIN, "Admin")]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_ADMIN)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
