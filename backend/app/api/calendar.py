from fastapi import APIRouter
from app.services.weather import get_weather_data
from app.services.moon import get_moon_phase

router = APIRouter(prefix="/api/calendar", tags=["Calendar & Weather"])

@router.get("/summary")
async def get_calendar_summary(city: str = "Москва"):
    weather = await get_weather_data(city)
    moon = get_moon_phase()
    return {
        "weather": weather,
        "moon_phase": moon,
        "tasks_summary": {
            "total_today": 2,
            "completed_today": 1,
            "rain_postponed": 1 if weather.get("is_rainy") else 0
        }
    }
