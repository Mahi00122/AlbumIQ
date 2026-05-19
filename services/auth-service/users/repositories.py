from .models import User


class UserRepository:
    @staticmethod
    def get_by_email(email):
        return User.objects.filter(email=email).first()

    @staticmethod
    def create_user(data):
        return User.objects.create(**data)
