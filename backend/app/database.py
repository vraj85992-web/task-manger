from typing import Optional
from supabase import create_client, Client
from app.config import settings

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """
    Get or initialize the Supabase client.
    Raises ValueError if SUPABASE_URL or SUPABASE_KEY is missing.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError(
            "Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_KEY in backend/.env"
        )

    _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase_client
