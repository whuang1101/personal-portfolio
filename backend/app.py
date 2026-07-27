from __future__ import annotations

import os
import json
import time
from collections import defaultdict, deque
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request as UrlRequest, urlopen

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr, Field


DIST_DIR = Path(os.getenv("DIST_DIR", "/app/dist"))
CONTACT_TO = os.getenv("CONTACT_TO", "huangwilson89@gmail.com")
RATE_LIMIT = 5
RATE_WINDOW_SECONDS = 3600
requests_by_ip: dict[str, deque[float]] = defaultdict(deque)

app = FastAPI(title="Wilson Huang Portfolio", version="1.0.0", docs_url=None, redoc_url=None)


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(default="Portfolio inquiry", max_length=160)
    message: str = Field(min_length=10, max_length=5000)
    website: str = Field(default="", max_length=0)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "personal-portfolio"}


@app.post("/api/contact", status_code=202)
def contact(payload: ContactRequest, request: Request) -> dict[str, str]:
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    recent = requests_by_ip[client_ip]
    while recent and recent[0] < now - RATE_WINDOW_SECONDS:
        recent.popleft()
    if len(recent) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")

    resend_api_key = os.getenv("RESEND_API_KEY")
    if not resend_api_key:
        raise HTTPException(status_code=503, detail="Email delivery is not configured yet.")

    resend_payload = json.dumps({
        "from": os.getenv("RESEND_FROM", "Wilson Huang Portfolio <onboarding@resend.dev>"),
        "to": [CONTACT_TO],
        "reply_to": payload.email,
        "subject": f"Portfolio: {payload.subject or 'New message'}",
        "text": (
            f"New portfolio message\n\n"
            f"Name: {payload.name}\n"
            f"Email: {payload.email}\n\n"
            f"{payload.message}\n"
        ),
        "tags": [{"name": "source", "value": "portfolio"}],
    }).encode()
    resend_request = UrlRequest(
        "https://api.resend.com/emails",
        data=resend_payload,
        headers={
            "Authorization": f"Bearer {resend_api_key}",
            "Content-Type": "application/json",
            "User-Agent": "wilson-portfolio/1.0",
        },
        method="POST",
    )
    try:
        with urlopen(resend_request, timeout=15) as response:
            if response.status not in (200, 201):
                raise HTTPException(status_code=502, detail="Email delivery failed. Please try again.")
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        raise HTTPException(status_code=502, detail="Email delivery failed. Please try again.") from exc

    recent.append(now)
    return {"status": "accepted", "message": "Your message was sent."}


# Paths that must 404 rather than fall through to the SPA shell. Serving index.html
# with a 200 for these made every unknown URL — including /robots.txt and stray API
# calls — look like a real page to crawlers.
NON_SPA_PREFIXES = ("api/", "assets/")
NON_SPA_SUFFIXES = (
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".pdf",
    ".css", ".js", ".map", ".json", ".txt", ".xml", ".webmanifest",
)


@app.get("/{path:path}", include_in_schema=False)
def site(path: str) -> FileResponse:
    requested = (DIST_DIR / path).resolve()
    if path and requested.is_relative_to(DIST_DIR.resolve()) and requested.is_file():
        return FileResponse(requested)
    if path.startswith(NON_SPA_PREFIXES) or path.endswith(NON_SPA_SUFFIXES):
        raise HTTPException(status_code=404, detail="Not found.")
    index = DIST_DIR / "index.html"
    if not index.is_file():
        raise HTTPException(status_code=503, detail="Frontend build is unavailable.")
    return FileResponse(index)
