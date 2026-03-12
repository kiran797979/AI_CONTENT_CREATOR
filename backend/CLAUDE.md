# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Streamlit-based web app for generating professional content using multiple AI models via the OpenRouter API. Python 3.12+, no build step.

## Running the App

```bash
# Web UI
streamlit run app.py

# Custom port
streamlit run app.py --server.port 8502

# CLI content generation
python generate_content.py "deepseek/deepseek-chat" --prompt "Your prompt"

# Model comparison CLI
python compare_models.py
```

There is no test suite or linting configuration currently set up.

## Architecture

Three core modules with clear separation of concerns:

- **`app.py`** — Main Streamlit app. Handles UI, OpenRouter client creation, content generation with retry/fallback logic, and result display. Key functions: `generate_for_model()` (retry + fallback chain), `_extract_status_code()`, `_get_user_friendly_error()`.
- **`config.py`** — `Config` class loading from `.env` via python-dotenv. Defines available models, fallback chains, retry parameters (max retries, delay, retryable vs non-retryable HTTP codes).
- **`prompt_templates.py`** — `build_prompt()` constructs type-specific prompts from parameters (content type, tone, audience, length, keywords, topic). `format_output()` applies post-processing. `validate_output()` returns quality warnings per content type.

## API & Models

All models accessed through OpenRouter API (`openai` Python client with custom base URL). The default model is `deepseek/deepseek-chat`. Six models available with a fallback chain defined in `Config.FALLBACK_MODELS`.

Error handling classifies HTTP status codes into retryable (429, 500, 502, 503) vs non-retryable (400, 401, 403, 404).

## Environment Setup

Copy `.env.example` to `.env` and set `OPENROUTER_API_KEY`. Optional: `DEFAULT_MODEL`, `DEFAULT_TEMPERATURE`, `STREAMLIT_PORT`.

## Content System

12 content types (LinkedIn, email, ad copy, blog, etc.), 12 tones, 6 length options. Each content type has specific prompt rules and validation checks in `prompt_templates.py`.
