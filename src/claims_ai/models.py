from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class StrEnum(str, Enum):
    pass


class ClaimType(StrEnum):
    MEDICAL = "medical"
    PROPERTY = "property"
    AUTO = "auto"
    LIABILITY = "liability"
    LIFE = "life"
    WORKERS_COMP = "workers_comp"
    OTHER = "other"


class ClaimPriority(StrEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class ClassifyRequest(BaseModel):
    claim_text: str = Field(..., min_length=10, description="Raw claim text to classify")
    claim_id: Optional[str] = Field(default=None, description="Optional claim identifier")


class ClassificationResult(BaseModel):
    claim_id: Optional[str]
    claim_type: ClaimType
    priority: ClaimPriority
    confidence: float = Field(..., ge=0.0, le=1.0)
    reasoning: str
    suggested_tags: List[str] = Field(default_factory=list)


class ClassifyResponse(BaseModel):
    result: ClassificationResult
    model: str
