from fastapi import FastAPI, UploadFile

from .face_engine import process_face
from .matching import compare_embeddings
from .schemas import MatchRequest


app = FastAPI(title="AI Face Service", version="0.1.0")


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/extract-face")
async def extract_face(file: UploadFile):
    return await process_face(file)


@app.post("/match")
async def match_faces(payload: MatchRequest):
    distance = compare_embeddings(payload.known, payload.unknown)
    return {"distance": distance}
