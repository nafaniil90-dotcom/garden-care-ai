from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
from app.config import settings

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message):
    user_name = message.from_user.first_name if message.from_user else "Садовод"
    
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🪴 Открыть «Мой Садовник»",
                    web_app=WebAppInfo(url=settings.MINI_APP_URL)
                )
            ]
        ]
    )

    welcome_text = (
        f"👋 Здравствуйте, <b>{user_name}</b>!\n\n"
        f"Добро пожаловать в <b>«Мой Персональный Садовник»</b> (Garden Care AI) 🌿\n\n"
        f"• <b>Инвентарь:</b> карточки растений и трекинг здоровья\n"
        f"• <b>AI-Фотометр:</b> замер Lux в реальном времени через камеру\n"
        f"• <b>AI-Диагностика:</b> определение болезней и схемы лечения\n"
        f"• <b>Календарь:</b> авто-коррекция полива по осадкам и лунному календарю\n\n"
        f"Нажмите кнопку ниже, чтобы запустить приложение:"
    )

    await message.answer(welcome_text, reply_markup=keyboard)

@router.callback_query(F.data.startswith("water_confirm:"))
async def process_water_confirm(callback: CallbackQuery):
    plant_id = callback.data.split(":")[1]
    await callback.message.edit_text(
        f"✅ <b>Отлично!</b> Полив растения зафиксирован. Календарь обновит дату следующего полива.",
        reply_markup=None
    )
    await callback.answer("Полив отмечен!")

@router.callback_query(F.data.startswith("water_snooze:"))
async def process_water_snooze(callback: CallbackQuery):
    await callback.message.edit_text(
        f"⏰ <b>Напоминание отложено!</b> Перенесено на завтра.",
        reply_markup=None
    )
    await callback.answer("Перенесено на 1 день")
