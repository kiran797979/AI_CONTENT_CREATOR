import asyncio
import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import AsyncOpenAI

from config import Config
from prompt_templates import build_prompt

app = FastAPI(title="AI Content Studio API", version="1.0.0")

# Racer Models (Directly from your approved list)
RACER_MODELS = [
    "google/gemma-3-12b-it:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "minimax/minimax-m2.5:free",
    "google/gemma-3-4b-it:free",
    "google/gemma-3n-4b-it:free",
]

def _parse_allowed_origins() -> list[str]:
    raw_value = os.getenv("CORS_ORIGINS", "")
    if raw_value.strip():
        return [origin.strip() for origin in raw_value.split(",") if origin.strip()]
    return ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    contentType: str
    tone: str
    length: str
    targetAudience: str = Field(default="")
    keywords: str = Field(default="")
    topic: str = Field(default="")
    model: str = Field(default="")
    prompt: str = Field(default="")

class GenerateResponse(BaseModel):
    content: str

CONTENT_TYPE_MAP = {
    "linkedin": "LinkedIn Post",
    "email": "Professional Email",
    "blog": "Blog Post",
    "social-media": "Social Media",
    "product-description": "Product Description",
    "ad-copy": "Advertisement Copy",
    "press-release": "Press Release",
    "newsletter": "Newsletter",
    "tweet-thread": "Tweet Thread",
    "youtube-description": "YouTube Description",
    "sales-pitch": "Sales Pitch",
    "landing-page": "Landing Page",
}

TONE_MAP = {
    "professional": "Professional",
    "casual": "Casual",
    "persuasive": "Persuasive",
    "informative": "Informative",
    "friendly": "Friendly",
    "formal": "Formal",
}

LENGTH_MAP = {
    "short": "Short",
    "medium": "Medium",
    "long": "Long",
}

PROMPT_TEMPLATE_CONTENT_TYPE_COMPAT_MAP = {
    "Social Media": "Social Media Caption",
    "Newsletter": "Newsletter Content",
    "Landing Page": "Landing Page Copy",
}

def _map_content_type(value: str) -> str:
    mapped = CONTENT_TYPE_MAP.get(value.lower(), value)
    return PROMPT_TEMPLATE_CONTENT_TYPE_COMPAT_MAP.get(mapped, mapped)

def _map_tone(value: str) -> str:
    return TONE_MAP.get(value.lower(), value)

def _map_length(value: str) -> str:
    return LENGTH_MAP.get(value.lower(), value)

def _build_effective_prompt(payload: GenerateRequest, mapped_content_type: str, mapped_tone: str, mapped_length: str) -> str:
    if payload.prompt and payload.prompt.strip():
        return payload.prompt.strip()

    if not payload.topic or not payload.topic.strip():
        raise HTTPException(status_code=400, detail={"error": "Topic Required", "message": "topic is required when prompt is empty"})

    return build_prompt(
        content_type=mapped_content_type,
        tone=mapped_tone,
        audience=payload.targetAudience or "General",
        length=mapped_length,
        keywords=payload.keywords or "",
        topic=payload.topic,
    )

def _get_async_client() -> AsyncOpenAI:
    if not Config.validate_api_key():
        Config.OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
        if not Config.validate_api_key():
            raise HTTPException(
                status_code=500, 
                detail={
                    "error": "Configuration Error", 
                    "message": "OPENROUTER_API_KEY is missing in Render environment."
                }
            )

    return AsyncOpenAI(
        api_key=Config.OPENROUTER_API_KEY,
        base_url=Config.OPENROUTER_BASE_URL,
        timeout=Config.OPENROUTER_TIMEOUT,
    )

async def _call_single_model(client: AsyncOpenAI, model_id: str, prompt: str) -> Optional[str]:
    """Execute a single model call. Returns content or None if it fails."""
    try:
        response = await client.chat.completions.create(
            model=model_id,
            messages=[{"role": "user", "content": prompt}],
        )
        content = (response.choices[0].message.content or "").strip()
        return content if content else None
    except Exception:
        return None

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/")
def root() -> dict[str, str]:
    return {
        "service": "AI Content Studio API (Race Mode Active 🏁)",
        "status": "ok",
    }

@app.post("/generate", response_model=GenerateResponse)
async def generate(payload: GenerateRequest) -> GenerateResponse:
    try:
        mapped_content_type = _map_content_type(payload.contentType)
        mapped_tone = _map_tone(payload.tone)
        mapped_length = _map_length(payload.length)
        
        prompt_text = _build_effective_prompt(payload, mapped_content_type, mapped_tone, mapped_length)
        client = _get_async_client()

        # START THE RACE 🏁
        tasks = [
            asyncio.create_task(_call_single_model(client, model, prompt_text)) 
            for model in RACER_MODELS
        ]

        # Wait for the first success
        while tasks:
            done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
            
            for task in done:
                result = task.result()
                if result:
                    # WE HAVE A WINNER! Cancel everyone else immediately.
                    for p_task in pending:
                        p_task.cancel()
                    return GenerateResponse(content=result)
            
            # If we're here, the finished tasks failed. Loop again with remaining tasks.
            tasks = list(pending)

        # If zero tasks left and no result
        raise HTTPException(status_code=503, detail={"error": "Circuit Breaker", "message": "All free models are currently busy. Please try again in a few seconds."})

    except HTTPException as e:
        raise e
    except Exception as exc:
        raise HTTPException(
            status_code=500, 
            detail={"error": "Internal Server Error", "message": str(exc)}
        ) from exc


