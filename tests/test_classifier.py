from unittest.mock import MagicMock, patch

import pytest

from claims_ai.classifier import ClaimsClassifier
from claims_ai.models import ClaimPriority, ClaimType


MOCK_RESPONSE = """{
  "claim_type": "medical",
  "priority": "high",
  "confidence": 0.92,
  "reasoning": "Claim describes a surgical procedure with significant medical costs.",
  "suggested_tags": ["surgery", "inpatient", "high-cost"]
}"""


@pytest.fixture
def classifier():
    with patch("claims_ai.classifier.anthropic.Anthropic"):
        c = ClaimsClassifier()
        mock_message = MagicMock()
        mock_message.content[0].text = MOCK_RESPONSE
        c._client.messages.create.return_value = mock_message
        return c


def test_classify_returns_correct_type(classifier):
    result = classifier.classify("Patient underwent emergency appendectomy costing $45,000.")
    assert result.claim_type == ClaimType.MEDICAL


def test_classify_returns_priority(classifier):
    result = classifier.classify("Patient underwent emergency appendectomy costing $45,000.")
    assert result.priority == ClaimPriority.HIGH


def test_classify_confidence_in_range(classifier):
    result = classifier.classify("Patient underwent emergency appendectomy costing $45,000.")
    assert 0.0 <= result.confidence <= 1.0


def test_classify_preserves_claim_id(classifier):
    result = classifier.classify("Some claim text here.", claim_id="CLM-001")
    assert result.claim_id == "CLM-001"
