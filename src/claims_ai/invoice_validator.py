from datetime import date
from typing import Dict, Optional

from .invoice_models import (
    CheckResult,
    CoverageItem,
    ExtractedInvoice,
    InvoiceValidationResult,
    ItemCategory,
    ReimbursementEstimate,
    ValidationStatus,
)

# ── Mock databases ─────────────────────────────────────────────────────────────
# In production these would be database lookups.

MICROCHIP_DB: Dict[str, str] = {
    "oslo": "900123456789012",
    "blah": "900987654321098",
    "luna": "900111222333444",
}

POLICY_DB: Dict[str, dict] = {
    "oslo": {
        "start": date(2025, 4, 7),
        "end": date(2026, 3, 7),
        "deductible": 500.0,
        "reimbursement_rate": 0.80,
        "annual_limit": 35000.0,
    },
    "blah": {
        "start": date(2025, 4, 7),
        "end": date(2026, 3, 7),
        "deductible": 500.0,
        "reimbursement_rate": 0.80,
        "annual_limit": 35000.0,
    },
    "luna": {
        "start": date(2024, 3, 1),
        "end": date(2025, 3, 1),
        "deductible": 500.0,
        "reimbursement_rate": 0.80,
        "annual_limit": 35000.0,
    },
}

CLINIC_DB = [
    {
        "name": "Dubai Veterinary Clinic",
        "aliases": ["dubai vet", "dvc"],
        "emirate": "Dubai",
    },
    {
        "name": "Veterinary Hospital Abu Dhabi",
        "aliases": ["vh abu dhabi", "vhad"],
        "emirate": "Abu Dhabi",
    },
    {
        "name": "Al Barsha Veterinary Clinic",
        "aliases": ["al barsha vet", "al barsha"],
        "emirate": "Dubai",
    },
    {
        "name": "German Veterinary Clinic",
        "aliases": ["german vet", "gvc"],
        "emirate": "Dubai",
    },
    {
        "name": "Jumeirah Veterinary Clinic",
        "aliases": ["jumeirah vet", "jvc"],
        "emirate": "Dubai",
    },
]

# Categories that are not reimbursable
EXCLUDED_CATEGORIES = {
    ItemCategory.FOOD,
    ItemCategory.SUPPLEMENT,
    ItemCategory.VITAMIN,
}

EXCLUSION_REASONS: Dict[ItemCategory, str] = {
    ItemCategory.FOOD: "Pet food is not covered under your policy",
    ItemCategory.SUPPLEMENT: "Nutritional supplements are not covered",
    ItemCategory.VITAMIN: "Vitamins and supplements are not covered",
}


# ── Check helpers ──────────────────────────────────────────────────────────────

def _check_microchip(extracted_chip: Optional[str], pet_id: str) -> CheckResult:
    expected = MICROCHIP_DB.get(pet_id)

    if not extracted_chip:
        return CheckResult(
            status=ValidationStatus.NOT_FOUND,
            message="No microchip number on invoice — our team will verify manually",
            value=None,
        )

    normalised = extracted_chip.replace(" ", "").replace("-", "")

    if expected and normalised == expected:
        return CheckResult(
            status=ValidationStatus.PASS,
            message=f"Microchip matches {pet_id.capitalize()}'s registered record",
            value=extracted_chip,
        )

    return CheckResult(
        status=ValidationStatus.WARNING,
        message="Microchip number doesn't match our records — vet team will verify",
        value=extracted_chip,
    )


def _check_date(invoice_date_str: Optional[str], pet_id: str) -> CheckResult:
    policy = POLICY_DB.get(pet_id, {})

    if not invoice_date_str:
        return CheckResult(
            status=ValidationStatus.NOT_FOUND,
            message="No invoice date found",
            value=None,
        )

    try:
        invoice_date = date.fromisoformat(invoice_date_str)
    except ValueError:
        return CheckResult(
            status=ValidationStatus.WARNING,
            message=f"Could not parse date: {invoice_date_str}",
            value=invoice_date_str,
        )

    start: Optional[date] = policy.get("start")
    end: Optional[date] = policy.get("end")

    if start and end:
        if start <= invoice_date <= end:
            return CheckResult(
                status=ValidationStatus.PASS,
                message=f"Invoice date is within policy period ({start} – {end})",
                value=invoice_date_str,
            )
        else:
            return CheckResult(
                status=ValidationStatus.FAIL,
                message=(
                    f"Invoice date {invoice_date_str} is outside policy period "
                    f"({start} \u2013 {end})"
                ),
                value=invoice_date_str,
            )

    return CheckResult(
        status=ValidationStatus.WARNING,
        message="Could not verify policy dates — vet team will check",
        value=invoice_date_str,
    )


def _check_clinic(clinic_name: Optional[str]) -> CheckResult:
    if not clinic_name:
        return CheckResult(
            status=ValidationStatus.NOT_FOUND,
            message="No clinic name found on invoice — you can confirm below",
            value=None,
        )

    lower = clinic_name.lower()
    for clinic in CLINIC_DB:
        if (
            lower in clinic["name"].lower()
            or clinic["name"].lower() in lower
            or any(alias in lower for alias in clinic["aliases"])
        ):
            return CheckResult(
                status=ValidationStatus.PASS,
                message=f"Clinic verified in our network ({clinic['emirate']})",
                value=clinic["name"],
            )

    return CheckResult(
        status=ValidationStatus.WARNING,
        message=f'"{clinic_name}" not found in our network — vet team will verify',
        value=clinic_name,
    )


# ── Main validator ─────────────────────────────────────────────────────────────

def validate_invoice(extracted: ExtractedInvoice, pet_id: str) -> InvoiceValidationResult:
    policy = POLICY_DB.get(
        pet_id,
        {"deductible": 500.0, "reimbursement_rate": 0.80},
    )

    microchip_check = _check_microchip(extracted.microchip_number, pet_id)
    date_check = _check_date(extracted.invoice_date, pet_id)
    clinic_check = _check_clinic(extracted.clinic_name)

    # ── Coverage calculation ───────────────────────────────────────────────────
    coverage_items = []
    total_billed = 0.0
    excluded_amount = 0.0

    for item in extracted.line_items:
        covered = item.category not in EXCLUDED_CATEGORIES
        reason = EXCLUSION_REASONS.get(item.category) if not covered else None
        coverage_items.append(
            CoverageItem(
                description=item.description,
                amount=item.amount,
                category=item.category.value,
                covered=covered,
                exclusion_reason=reason,
            )
        )
        total_billed += item.amount
        if not covered:
            excluded_amount += item.amount

    # Fallback: if no line items were extracted, use invoice total as-is
    if not extracted.line_items and extracted.total_amount:
        total_billed = extracted.total_amount

    eligible_amount = max(0.0, total_billed - excluded_amount)
    deductible: float = policy.get("deductible", 500.0)
    rate: float = policy.get("reimbursement_rate", 0.80)
    after_deductible = max(0.0, eligible_amount - deductible)
    estimated_reimbursement = after_deductible * rate

    reimbursement = ReimbursementEstimate(
        total_billed=round(total_billed, 2),
        excluded_amount=round(excluded_amount, 2),
        eligible_amount=round(eligible_amount, 2),
        deductible=deductible,
        after_deductible=round(after_deductible, 2),
        reimbursement_rate=rate,
        estimated_reimbursement=round(estimated_reimbursement, 2),
    )

    pre_filled: Dict[str, str] = {
        "visitDate": extracted.invoice_date or "",
        "amount": str(round(total_billed, 2)) if total_billed > 0 else "",
    }

    return InvoiceValidationResult(
        extracted=extracted,
        microchip_check=microchip_check,
        date_check=date_check,
        clinic_check=clinic_check,
        coverage_items=coverage_items,
        reimbursement=reimbursement,
        pre_filled=pre_filled,
    )
