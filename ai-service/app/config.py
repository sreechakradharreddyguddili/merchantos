import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    APP_NAME = "MerchantOS AI Service"

    APP_VERSION = "1.0.0"

    HOST = os.getenv(
        "AI_SERVICE_HOST",
        "0.0.0.0",
    )

    PORT = int(
        os.getenv(
            "AI_SERVICE_PORT",
            "8000",
        )
    )

    MONGODB_URI = os.getenv(
        "MONGODB_URI",
        "mongodb://127.0.0.1:27017/merchantos",
    )

    GROQ_API_KEY = os.getenv(
        "GROQ_API_KEY",
        "",
    )

    LLM_MODEL = os.getenv(
        "LLM_MODEL",
        "openai/gpt-oss-120b",
    )


settings = Settings()