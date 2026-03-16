from fastapi import FastAPI, HTTPException

from .classifier import ClaimsClassifier
from .config import settings
from .models import ClassifyRequest, ClassifyResponse

app = FastAPI(title=settings.app_name, version="0.1.0")
classifier = ClaimsClassifier()


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
