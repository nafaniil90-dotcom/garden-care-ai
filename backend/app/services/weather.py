import httpx
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

async def get_weather_data(city: str = "Брест", lat: Optional[float] = None, lon: Optional[float] = None) -> dict:
    """
    Fetches weather data from OpenWeatherMap by exact lat/lon coordinates or city name.
    """
    if settings.OPENWEATHER_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                if lat is not None and lon is not None:
                    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&lang=ru&appid={settings.OPENWEATHER_API_KEY}"
                else:
                    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&lang=ru&appid={settings.OPENWEATHER_API_KEY}"

                res = await client.get(url, timeout=5.0)
                if res.status_code == 200:
                    data = res.json()
                    temp = data["main"]["temp"]
                    weather_main = data.get("weather", [{}])[0].get("main", "").lower()
                    description = data.get("weather", [{}])[0].get("description", "").capitalize()
                    
                    is_rainy = "rain" in data or any(w in weather_main for w in ["rain", "drizzle", "thunderstorm"])
                    is_hot_sun = temp >= 25.0 and "clear" in weather_main
                    is_frost_risk = temp <= 2.0

                    return {
                        "temp_c": temp,
                        "description": description,
                        "is_rainy": is_rainy,
                        "is_hot_sun": is_hot_sun,
                        "is_frost_risk": is_frost_risk,
                        "location_label": data.get("name", city)
                    }
        except Exception as e:
            logger.warning(f"Weather API request error: {e}")

    # Fallback micro-location weather response for demonstration
    return {
        "temp_c": 21.5,
        "description": "Умеренный дождь в районе участка",
        "is_rainy": True,
        "is_hot_sun": False,
        "is_frost_risk": False,
        "location_label": f"{city} (Участок)"
    }
