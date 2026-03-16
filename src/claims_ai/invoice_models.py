from typing import Dict, List, Optional

from pydantic import BaseModel, Field

from .models import StrEnum


class ItemCategory(StrEnum):
    CONSULTATION = "consultation"
    MEDICATION = "medication"
    PROCEDURE = "procedure"
    LABORATORY = "laboratory"
    FOOD = "food"
    SUPPLEMENT = "supplement"
    VITAMIN = "vitamin"
    VACCINATION = "vaccination"
    OTHER = "other"


class ValidationStatus(StrEnum):
    PASS = "pass"
    FAIL = "fail"
    WARNING = "warning"
    NOT_FOUND = "not_found"


class ExtractedLineItem(BaseModel):
    description: str
    quantity: Optional[float] = 1.0
    unit_price: Optional[float] = None
    amount: float
    category: ItemCategory


class ExtractedInvoice(BaseModel):
    microchip_number: Optional[str] = None
    invoice_date: Optional[str] = None  # YYYY-MM-DD
    clinic_name: Optional[str] = None
    clinic_address: Optional[str] = None
    clinic_phone: Optional[str] = None
    total_amount: Optional[float] = None
    currency: str = "AED"
    line_items: List[ExtractedLineItem] = Field(default_factory=list)
    raw_text_hint: Optional[str] = None


class CheckResult(BaseModel):
    status: ValidationStatus
    message: str
    value: Optional[str] = None


class CoverageItem(BaseModel):
    description: str
    amount: float
    category: str
    covered: bool
    exclusion_reason: Optional[str] = None


class ReimbursementEstimate(BaseModel):
    total_billed: float
    excluded_amount: float
    eligible_amount: float
    deductible: float
    after_deductible: float
    reimbursement_rate: float
    estimated_reimbursement: float
    currency: str = "AED"
    note: str = "Estimate subject to vet validation and full policy review"


class InvoiceValidationResult(BaseModel):
    extracted: ExtractedInvoice
    microchip_check: CheckResult
    date_check: CheckResult
    clinic_check: CheckResult
    coverage_items: List[CoverageItem]
    reimbursement: ReimbursementEstimate
    pre_filled: Dict[str, str]  # visitDate + amount to auto-fill in form
