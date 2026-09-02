from langchain_groq import ChatGroq

from app.config import settings


def get_llm():
    if not settings.GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not configured"
        )

    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.LLM_MODEL,
        temperature=0.2,
        max_tokens=2000,
    )