# Claims AI — Pet Insurance Claims Portal

An AI-powered claims processing portal for Oslo pet insurance. Pet parents submit vet invoices and receive instant extraction, policy validation, and reimbursement estimates — all before the claim reaches a vet.

---

## Demo flow

| Step | What happens |
|------|-------------|
| 1 Introduction | Welcome screen |
| 2 Select Pet | Choose the insured pet (Oslo, Blah, Luna) |
| 3 Claim Reason | Pick reason (accident, illness, assistance…) |
| 4 Visit Date | Date of vet visit |
| 5 Amount | Total billed |
| 6 **Documents** | Upload invoice — or click **Try with sample invoice** |
| 7 **Invoice Review** | AI extracts microchip, date, clinic & line items; validates against policy; shows covered vs excluded items and estimated reimbursement |
| 8 Comments | Optional notes |
| 9 Review & Submit | AI classifies claim type + priority via Claude |

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 · Vite · Tailwind CSS |
| Backend | Python 3.9 · FastAPI · Pydantic v2 |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Invoice extraction | Claude vision API (image + PDF) |
| Claim classification | Claude text API |

---

## Running locally

### 1 — Clone

```bash
git clone https://github.com/priyauxd/claims-ai.git
cd claims-ai
```

### 2 — Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -e .

# Create .env
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

uvicorn claims_ai.main:app --reload --port 8000
# → http://localhost:8000/docs
```

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies `/api/*` to the FastAPI backend at `:8000`.

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/classify` | Classify claim text (type + priority) |
| `POST` | `/extract-invoice` | Upload vet invoice → extract + validate |
| `GET` | `/demo-extract?pet_id=oslo` | Hardcoded sample invoice with live validation |
| `GET` | `/docs` | Interactive Swagger UI |

---

## Invoice validation checks

1. **Microchip** — extracted chip number matched against pet registry
2. **Date** — invoice date checked against policy start/end
3. **Clinic** — clinic name matched against approved network
4. **Coverage** — line items categorised; food, vitamins, and supplements excluded
5. **Reimbursement estimate** — eligible amount → deductible (AED 500) → 80% rate

> All checks run before submission reaches the vet team.

---

## Project structure

```
claims-ai/
├── src/claims_ai/
│   ├── main.py               # FastAPI app + endpoints
│   ├── invoice_extractor.py  # Claude vision → structured data
│   ├── invoice_validator.py  # Policy rules + coverage + reimbursement
│   ├── invoice_models.py     # Pydantic models for invoice pipeline
│   ├── classifier.py         # Claim type + priority classifier
│   ├── models.py             # Shared Pydantic models
│   └── config.py             # Settings (API key, model)
├── frontend/
│   ├── src/pages/
│   │   ├── SendClaim.jsx     # 9-step claims wizard
│   │   └── Dashboard.jsx     # Pet dashboard
│   ├── src/components/       # Sidebar, KPI cards, pet cards, timeline
│   └── public/
│       └── sample-invoice.svg  # Demo vet invoice (Dubai Veterinary Clinic)
└── pyproject.toml
```
