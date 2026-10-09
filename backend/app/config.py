import os
from typing import List
from dotenv import load_dotenv

# Load .env file from backend root if present
load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS allowed origins
    _cors: str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    CORS_ORIGINS: List[str] = [origin.strip() for origin in _cors.split(",") if origin.strip()]

settings = Settings()
