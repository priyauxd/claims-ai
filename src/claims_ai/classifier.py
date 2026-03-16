import json
from typing import Optional

import anthropic

from .config import settings
from .models import ClassificationResult, ClaimPriority, ClaimType

CLASSIFICATION_PROMPT = """You are an expert claims classifier. Analyze the provided claim text and return a JSON object with the following fields:

- claim_type: one of {claim_types}
- priority: one of {priorities}
- confidence: a float between 0.0 and 1.0 indicating your confidence
- reasoning: a brief explanation of your classification decision
- suggested_tags: a list of relevant tags (max 5)

Respond ONLY with valid JSON. No markdown, no extra text.

Claim text:
{claim_text}"""


class ClaimsClassifier:
    def __init__(self) -> None:
        self._client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    def classify(self, claim_text: str, claim_id: Optional[str] = None) -> ClassificationResult:
        prompt = CLASSIFICATION_PROMPT.format(
            claim_types=[t.value for t in ClaimType],
            priorities=[p.value for p in ClaimPriority],
            claim_text=claim_text,
        )

        message = self._client.messages.create(
            model=settings.claude_model,
            max_tokens=512,
            messages=[{"role": "user", "content": prompt}],
        )

        raw = message.content[0].text.strip()
        data = json.loads(raw)

        return ClassificationResult(
            claim_id=claim_id,
            claim_type=ClaimType(data["claim_type"]),
            priority=ClaimPriority(data["priority"]),
            confidence=float(data["confidence"]),
            reasoning=data["reasoning"],
            suggested_tags=data.get("suggested_tags", []),
        )
