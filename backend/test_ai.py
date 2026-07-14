# test_ai.py
from deepface import DeepFace

# Extract 512-dimensional embeddings using ArcFace
print("Loading model and extracting face...")
embedding = DeepFace.represent(img_path="test.jpg", model_name="ArcFace")[0][
    "embedding"
]

print(f"Success! Extracted {len(embedding)} dimensions.")
# If this prints "Success! Extracted 512 dimensions.", the AI is working perfectly!
