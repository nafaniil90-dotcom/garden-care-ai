from fastapi import APIRouter
from pydantic import BaseModel
from app.services.vision_ai import analyze_plant_vision

router = APIRouter(prefix="/api/vision", tags=["Vision AI"])

class ImagePayload(BaseModel):
    image_base64: str

@router.post("/diagnose")
async def diagnose_image(payload: ImagePayload):
    diagnosis = await analyze_plant_vision(payload.image_base64)
    return diagnosis
