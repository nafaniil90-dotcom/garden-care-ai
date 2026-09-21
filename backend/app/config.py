import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    BOT_TOKEN: str = "123456789:AAH_mock_token_for_local_testing_xyz"
    MINI_APP_URL: str = "http://localhost:3000"
    GEMINI_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""
    DATABASE_URL: str = "sqlite+aiosqlite:///./garden_care.db"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
