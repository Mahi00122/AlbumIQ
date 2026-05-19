from .repositories import UserRepository


class AuthService:
    @staticmethod
    def login(email):
        return UserRepository.get_by_email(email)
