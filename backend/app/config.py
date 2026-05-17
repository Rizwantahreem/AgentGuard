from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    lobstertrap_url: str = "http://localhost:8080"
    database_url: str = "sqlite:///./agentguard.db"
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
