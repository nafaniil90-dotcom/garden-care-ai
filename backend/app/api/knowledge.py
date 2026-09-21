from fastapi import APIRouter
from typing import Optional

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge Base"])

@router.get("/articles")
async def search_articles(query: Optional[str] = None):
    articles = [
        {
            "id": 1,
            "title": "Паутинный клещ: первые симптомы и методы борьбы",
            "category": "Вредители и Болезни",
            "symptoms": ["Желтые точки", "Паутина", "Сухие листья"],
            "snippet": "При обнаружении мелких точек и тонкой паутины немедленно изолируйте растение в карантин...",
        },
        {
            "id": 2,
            "title": "Как правильно измерять и подбирать освещенность (Lux)",
            "category": "Уход и Свет",
            "symptoms": ["Вытягивание стеблей", "Потеря вариегатности"],
            "snippet": "Различным группам растений требуется от 500 до 5000 Lux. В этой статье разбираем нормы...",
        }
    ]
    if query:
        q = query.lower()
        return [
            a for a in articles
            if q in a["title"].lower() or any(q in s.lower() for s in a["symptoms"])
        ]
    return articles
