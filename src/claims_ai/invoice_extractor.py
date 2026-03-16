import base64
import json

import anthropic

from .config import settings
from .invoice_models import ExtractedInvoice, ExtractedLineItem, ItemCategory

EXTRACTION_PROMPT = """\
You are an expert veterinary invoice analyzer for a UAE pet insurance company (currency: AED).

Examine this veterinary invoice and return a single JSON object with these fields:

{
  "microchip_number": "pet chip/microchip number as a string, or null if not visible",
  "invoice_date": "date in YYYY-MM-DD format, or null",
  "clinic_name": "veterinary clinic or hospital name, or null",
  "clinic_address": "full address including city, or null",
  "clinic_phone": "phone number, or null",
  "total_amount": numeric total invoice amount, or null,
  "currency": "AED",
  "line_items": [
    {
      "description": "item name",
      "quantity": 1,
      "unit_price": null,
      "amount": 0.0,
      "category": "<see categories below>"
    }
  ],
  "raw_text_hint": "one sentence summary of what this invoice is for"
}

Category values (pick the most fitting):
  consultation  – vet visit fee, examination, check-up
  medication    – prescribed drugs, treatments, injections
  procedure     – surgery, dental, X-ray, ultrasound, grooming procedure
  laboratory    – blood test, urinalysis, biopsy, culture
  food          – pet food, prescription diet, special diet kibble
  supplement    – omega-3, joint support, probiotics, nutraceuticals
  vitamin       – vitamins, vitamin C, vitamin supplements
  vaccination   – vaccine administration and fees
  other         – anything else

Respond ONLY with valid JSON. No markdown fences, no extra text.\
"""


class InvoiceExtractor:
    def __init__(self) -> None:
        self._client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    def extract(self, file_bytes: bytes, media_type: str) -> ExtractedInvoice:
        encoded = base64.standard_b64encode(file_bytes).decode("utf-8")

        if media_type == "application/pdf":
            content_block = {
                "type": "document",
                "source": {"type": "base64", "media_type": "application/pdf", "data": encoded},
            }
        else:
            # Normalise common MIME variants
            if media_type not in ("image/jpeg", "image/png", "image/gif", "image/webp"):
                media_type = "image/jpeg"
            content_block = {
                "type": "image",
                "source": {"type": "base64", "media_type": media_type, "data": encoded},
            }

        message = self._client.messages.create(
            model=settings.claude_model,
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": [
                        content_block,
                        {"type": "text", "text": EXTRACTION_PROMPT},
                    ],
                }
            ],
        )

        raw = message.content[0].text.strip()
        data = json.loads(raw)

        line_items = []
        for item in data.get("line_items", []):
            try:
                category = ItemCategory(item.get("category", "other"))
            except ValueError:
                category = ItemCategory.OTHER
            line_items.append(
                ExtractedLineItem(
                    description=item.get("description", ""),
                    quantity=item.get("quantity", 1.0),
                    unit_price=item.get("unit_price"),
                    amount=float(item.get("amount", 0.0)),
                    category=category,
                )
            )

        return ExtractedInvoice(
            microchip_number=data.get("microchip_number"),
            invoice_date=data.get("invoice_date"),
            clinic_name=data.get("clinic_name"),
            clinic_address=data.get("clinic_address"),
            clinic_phone=data.get("clinic_phone"),
            total_amount=data.get("total_amount"),
            currency=data.get("currency", "AED"),
            line_items=line_items,
            raw_text_hint=data.get("raw_text_hint"),
        )
