from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile

from .classifier import ClaimsClassifier
from .config import settings
from .invoice_extractor import InvoiceExtractor
from .invoice_models import (
    ExtractedInvoice,
    ExtractedLineItem,
    InvoiceValidationResult,
    ItemCategory,
)
from .invoice_validator import validate_invoice
from .models import ClassifyRequest, ClassifyResponse

app = FastAPI(title=settings.app_name, version="0.1.0")
classifier = ClaimsClassifier()
extractor = InvoiceExtractor()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/classify", response_model=ClassifyResponse)
def classify_claim(request: ClassifyRequest) -> ClassifyResponse:
    try:
        result = classifier.classify(
            claim_text=request.claim_text,
            claim_id=request.claim_id,
        )
        return ClassifyResponse(result=result, model=settings.claude_model)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/demo-extract", response_model=InvoiceValidationResult)
def demo_extract(pet_id: str = Query(default="oslo")) -> InvoiceValidationResult:
    """
    Return validation results for a hardcoded sample invoice (Dubai Vet Clinic, Oslo).
    Runs the real validator so microchip / date / policy checks differ per pet_id.
    """
    extracted = ExtractedInvoice(
        microchip_number="900123456789012",
        invoice_date="2025-12-15",
        clinic_name="Dubai Veterinary Clinic",
        clinic_address="Al Barsha, Dubai, UAE",
        clinic_phone="+971 4 123 4567",
        total_amount=1338.75,
        currency="AED",
        line_items=[
            ExtractedLineItem(
                description="Consultation / Examination",
                quantity=1,
                unit_price=250.0,
                amount=250.0,
                category=ItemCategory.CONSULTATION,
            ),
            ExtractedLineItem(
                description="X-Ray (Thoracic)",
                quantity=1,
                unit_price=400.0,
                amount=400.0,
                category=ItemCategory.PROCEDURE,
            ),
            ExtractedLineItem(
                description="Antibiotic Injection",
                quantity=2,
                unit_price=120.0,
                amount=240.0,
                category=ItemCategory.MEDICATION,
            ),
            ExtractedLineItem(
                description="Prescribed Medication (Amoxicillin 250mg)",
                quantity=1,
                unit_price=180.0,
                amount=180.0,
                category=ItemCategory.MEDICATION,
            ),
            ExtractedLineItem(
                description="Vitamin B Complex Supplement",
                quantity=1,
                unit_price=85.0,
                amount=85.0,
                category=ItemCategory.VITAMIN,
            ),
            ExtractedLineItem(
                description="Premium Diet Pet Food (Hills Science Diet)",
                quantity=1,
                unit_price=120.0,
                amount=120.0,
                category=ItemCategory.FOOD,
            ),
        ],
        raw_text_hint=(
            "Veterinary invoice for Oslo (Cocker Spaniel) from Dubai Veterinary Clinic, "
            "December 2025 — consultation, X-ray, antibiotics, medication, and excluded items."
        ),
    )
    return validate_invoice(extracted, pet_id.lower())


@app.post("/extract-invoice", response_model=InvoiceValidationResult)
async def extract_invoice(
    file: UploadFile = File(...),
    pet_id: str = Form(...),
) -> InvoiceValidationResult:
    """
    Accept a vet invoice (image or PDF), extract structured data with Claude vision,
    run policy validation checks, and return coverage + reimbursement estimate.
    """
    try:
        file_bytes = await file.read()
        media_type = file.content_type or "image/jpeg"
        extracted = extractor.extract(file_bytes, media_type)
        return validate_invoice(extracted, pet_id.lower())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
