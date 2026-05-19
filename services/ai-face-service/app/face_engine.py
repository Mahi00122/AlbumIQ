from PIL import Image


async def process_face(file):
    image = Image.open(file.file)
    image = image.convert("RGB")
    width, height = image.size

    # Placeholder embedding for initial service scaffold.
    embedding = [round(width / 1000, 4), round(height / 1000, 4), 0.5123, 0.2811]
    return {
        "faces": 1,
        "embedding": embedding,
    }
