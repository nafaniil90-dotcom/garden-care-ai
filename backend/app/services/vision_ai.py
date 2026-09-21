import json
import logging
import base64
import io
from PIL import Image
from app.config import settings

logger = logging.getLogger(__name__)

async def analyze_plant_vision(base64_image: str) -> dict:
    """
    Analyzes plant image using Gemini Vision API with proper base64 PIL image decoding.
    Returns structured JSON with species, health status, diagnosis, and care tips.
    """
    if not settings.GEMINI_API_KEY:
        logger.info("GEMINI_API_KEY not configured in settings")
        return get_error_response("GEMINI_API_KEY не установлен в параметрах сервера")

    try:
        # Decode base64 string into PIL Image
        if "," in base64_image:
            base64_clean = base64_image.split(",")[1]
        else:
            base64_clean = base64_image

        image_bytes = base64.b64decode(base64_clean)
        pil_img = Image.open(io.BytesIO(image_bytes))

        # Import Google GenAI SDK
        from google import genai
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        prompt = """
        Внимательно определи растение и его состояние по фотографии.
        Ты профессиональный ботаник и фитопатолог.
        Определи точный вид и сорт растения (например: Гортензия, Георгин, Яблоня, Роза, Томат и т.д.).

        Выдай ответ СТРОГО в формате JSON без кавычек markdown:
        {
          "species": "Точный вид и сорт растения по фото",
          "health_score": 90,
          "status": "healthy" или "quarantine",
          "diagnosis": "Диагноз по фото или 'Растение здорово'",
          "symptoms": ["симптом или очертание 1", "особенность 2"],
          "care_recommendations": {
             "light": "Требования к свету",
             "watering": "Частота полива",
             "humidity": "Влажность"
          },
          "treatment_plan": ["Рекомендация 1", "Рекомендация 2"],
          "recommended_products": [
             {"title": "Удобрение/Препарат", "price": "250 ₽", "marketplace": "Ozon", "url": "https://ozon.ru"}
          ]
        }
        """

        try:
          response = client.models.generate_content(
              model="gemini-2.0-flash",
              contents=[prompt, pil_img]
          )
        except Exception as model_err:
          logger.warning(f"gemini-2.0-flash failed ({model_err}), trying fallback gemini-1.5-flash")
          response = client.models.generate_content(
              model="gemini-1.5-flash",
              contents=[prompt, pil_img]
          )

        # Parse JSON response
        cleaned_text = response.text.strip()
        if "```" in cleaned_text:
            cleaned_text = cleaned_text.replace("```json", "").replace("```", "")

        parsed = json.loads(cleaned_text.strip())
        logger.info(f"Gemini Vision successfully identified plant: {parsed.get('species')}")
        return parsed

    except Exception as e:
        logger.error(f"Gemini Vision API execution error: {e}", exc_info=True)
        return get_error_response(f"Ошибка вызова Gemini Vision API: {str(e)}")

def get_error_response(error_msg: str) -> dict:
    return {
        "species": "Ошибка обработки фото",
        "health_score": 0,
        "status": "healthy",
        "diagnosis": f"Не удалось проанализировать фото: {error_msg}",
        "symptoms": ["Проверьте ключ GEMINI_API_KEY в настройках Render"],
        "care_recommendations": {
            "light": "Н/Д",
            "watering": "Н/Д",
            "humidity": "Н/Д"
        },
        "treatment_plan": [
            "Убедитесь, что в Render.com добавлена переменная GEMINI_API_KEY с валидным ключом AI Studio"
        ],
        "recommended_products": []
    }
