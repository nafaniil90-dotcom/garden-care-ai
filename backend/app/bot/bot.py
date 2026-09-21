import logging
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from app.config import settings

logger = logging.getLogger(__name__)

token = settings.BOT_TOKEN
if not token or ":" not in token:
    token = "123456789:AAH_mock_token_for_local_testing_xyz"

try:
    bot = Bot(
        token=token,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
except Exception as e:
    logger.warning(f"Could not initialize Bot with token ({e}), creating fallback bot instance")
    bot = Bot(
        token="123456789:AAH_mock_token_for_local_testing_xyz",
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )

dp = Dispatcher()
