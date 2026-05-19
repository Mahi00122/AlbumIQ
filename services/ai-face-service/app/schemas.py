from typing import List

from pydantic import BaseModel


class FaceExtractionResponse(BaseModel):
    faces: int
    embedding: List[float]


class MatchRequest(BaseModel):
    known: List[float]
    unknown: List[float]
