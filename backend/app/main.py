import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.api.plants import router as plants_router
from app.api.vision import router as vision_router
from app.api.calendar import router as calendar_router
from app.api.knowledge import router as knowledge_router
from app.bot.bot import bot, dp
from app.bot.handlers import router as bot_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing database...")
    await init_db()
    
    # Mount bot router
    dp.include_router(bot_router)
    
    # Start bot polling in background task (non-blocking) only if valid token
    bot_task = None
    if bot.token and "mock_token" not in bot.token:
        try:
            await bot.delete_webhook(drop_pending_updates=True)
            bot_task = asyncio.create_task(dp.start_polling(bot, handle_signals=False))
            logger.info("Aiogram 3 bot polling task initiated.")
        except Exception as e:
            logger.warning(f"Bot polling skipped or conflict handled: {e}")
    else:
        logger.info("Bot token not provided or is mock token, skipping Telegram polling task.")

    yield

    # Shutdown logic
    if bot_task:
        bot_task.cancel()
    try:
        await bot.session.close()
    except Exception:
        pass
    logger.info("Application shutdown complete.")

app = FastAPI(
    title="Мой Персональный Садовник (Garden Care AI) API",
    description="Backend API for Telegram Mini App + Aiogram 3 Bot with Vision AI",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Telegram Mini App & local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(plants_router)
app.include_router(vision_router)
app.include_router(calendar_router)
app.include_router(knowledge_router)

@app.get("/")
async def root():
    return {
        "app": "Мой Персональный Садовник (Garden Care AI)",
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
