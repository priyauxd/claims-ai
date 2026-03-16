from fastapi import FastAPI, File, Form, HTTPException, UploadFile

from .classifier import ClaimsClassifier
from .config import settings
from .invoice_extractor import InvoiceExtractor
from .invoice_models import InvoiceValidationResult
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
