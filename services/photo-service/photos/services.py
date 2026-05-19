from .cloudinary_service import CloudinaryService
from .repositories import PhotoRepository


class PhotoService:
    @staticmethod
    def upload_photos(event_code, files):
        uploaded = []
        for file in files:
            image_url = CloudinaryService.upload_image(file)
            photo = PhotoRepository.create_photo(event_code=event_code, image_url=image_url)
            uploaded.append(photo)
        return uploaded
