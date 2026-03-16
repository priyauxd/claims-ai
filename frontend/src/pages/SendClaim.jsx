import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Introduction" },
  { id: 2, label: "Select Pet" },
  { id: 3, label: "Claim Reason" },
  { id: 4, label: "Visit Date" },
  { id: 5, label: "Amount" },
  { id: 6, label: "Documents" },
  { id: 7, label: "Comments" },
  { id: 8, label: "Review & Submit" },
];

const PETS = [
  { id: "oslo",  name: "Oslo",  breed: "Cocker Spaniel",    age: 7, status: "expiring", statusLabel: "Expires Feb 15", emoji: "🐶" },
  { id: "blah",  name: "Blah",  breed: "American Bobtail",  age: 2, status: "active",   statusLabel: "Active Coverage", emoji: "🐱" },
  { id: "luna",  name: "Luna",  breed: "Golden Retriever",  age: 2, status: "expired",  statusLabel: "Expired", emoji: "🐶" },
];

const CLAIM_REASONS = [
  "S.he had an accident",
  "S.he is sick",
  "I lost my pet",
  "I need pet assistance",
  "My pet passed away",
  "I had to cancel my vacation",
];

const PET_MASCOT = "https://www.figma.com/api/mcp/asset/bef444c5-9b24-4e70-9155-42c80d4f24a1";

const MASCOT_MESSAGES = [
  "That's the way to go! 🐾",
  "Easy, one pet at a time! 🎯",
  "We're here to help! 💙",
  "Every detail counts! 📅",
  "Let's figure this out! 💰",
  "Almost there! 📎",
  "Your words matter! 💬",
  "One last look! 🔍",
];

const PRIORITY_COLORS = {
  urgent: "bg-red-100 text-red-700",
  high:   "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-green-100 text-green-700",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StepsBadge({ stepNum, currentStep }) {
  const done    = stepNum < currentStep;
  const active  = stepNum === currentStep;
  const bgColor = done ? "bg-primary-500" : active ? "bg-ruby-400" : "bg-gray-300";
  return (
    <div className="relative shrink-0 w-12 h-12">
      <span className={`text-4xl ${done || active ? "opacity-100" : "opacity-30"}`}>🐾</span>
      <div className={`absolute bottom-2 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow ${bgColor}`}>
        {done ? "✓" : stepNum}
      </div>
    </div>
  );
}

function StepsSidebar({ currentStep }) {
  const progress = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);
  return (
    <div className="w-[220px] shrink-0 bg-paper-tertiary rounded-xl px-5 py-4 flex flex-col gap-2">
      <p className="text-primary-500 text-sm font-medium">Send a Claim</p>
      <p className="text-xs text-gray-300">Follow the steps to submit your claim</p>

      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-primary-500 mt-1">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-primary-25 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step list */}
      <div className="flex flex-col mt-2">
        {STEPS.map((step, idx) => {
          const done   = step.id < currentStep;
          const active = step.id === currentStep;
          return (
            <div key={step.id} className="relative">
              <div className="flex items-center gap-3 py-1">
                <StepsBadge stepNum={step.id} currentStep={currentStep} />
                <span className={`text-sm ${active ? "text-primary-500 font-medium" : done ? "text-primary-400" : "text-text-primary"}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="absolute left-6 top-[52px] w-px h-4 bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MascotBubble({ message }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <img src={PET_MASCOT} alt="mascot" className="w-14 h-14 rounded-full object-cover border-2 border-primary-200" />
      <div className="bg-white border-2 border-primary-500 rounded-2xl px-4 py-2">
        <p className="text-primary-500 text-base">{message}</p>
      </div>
    </div>
  );
}

function NavButtons({ step, onBack, onNext, nextLabel = "Next Step →", nextDisabled = false, loading = false }) {
  return (
    <div className="flex items-center gap-3 pt-4">
      {step > 1 && (
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-text-secondary shadow-sm hover:bg-paper-secondary transition"
        >
          ‹
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex-1 h-12 rounded-full bg-gradient-to-l from-primary-600 to-primary-500 text-white font-medium text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Classifying…
          </>
        ) : nextLabel}
      </button>
    </div>
  );
}

// ── Step screens ─────────────────────────────────────────────────────────────

function Step1Intro({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 py-8">
      <MascotBubble message="That's the way to go! 🐾" />
      <h2 className="font-display text-3xl text-primary-600 text-center">
        A few steps is all we need from you! 🎉
      </h2>
      <div className="bg-paper-tertiary rounded-[46px] p-8 w-full max-w-xl text-center">
        <p className="text-[#4a5565] text-lg leading-7">
          Please have your vet bill and medical documents handy to send us a pic. 📸
        </p>
        <div className="text-6xl mt-6">🧾 + 📋</div>
      </div>
      <NavButtons step={1} onNext={onNext} nextLabel="Let's Begin 🚀" />
    </div>
  );
}

function Step2SelectPet({ value, onChange, onBack, onNext }) {
  const STATUS_STYLES = {
    active:   "bg-green-50 text-green-600",
    expiring: "bg-yellow-50 text-yellow-600",
    expired:  "bg-red-50 text-red-500",
  };
  return (
    <div className="flex flex-col flex-1 gap-4">
      <MascotBubble message="Easy, one pet at a time! 🎯" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        Which pet buddy is this claim for? 🐕
      </h2>
      <div className="flex flex-col gap-3 mt-2">
        {PETS.map((pet) => {
          const selected = value === pet.id;
          const disabled = pet.status === "expired";
          return (
            <button
              key={pet.id}
              onClick={() => !disabled && onChange(pet.id)}
              disabled={disabled}
              className={`flex items-center gap-4 p-4 rounded-2xl border-l-4 border border-solid text-left transition ${
                selected
                  ? "bg-primary-25 border-l-primary-500 border-primary-200"
                  : disabled
                  ? "bg-gray-50 border-l-gray-200 border-gray-100 opacity-50 cursor-not-allowed"
                  : "bg-white border-l-primary-200 border-gray-100 hover:bg-primary-25"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary-25 flex items-center justify-center text-2xl border-2 border-gray-200 shrink-0">
                {pet.emoji}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ruby-300">{pet.name}</p>
                <p className="text-xs text-text-secondary">{pet.breed}</p>
                <p className="text-xs text-text-secondary">{pet.age} yo</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[pet.status]}`}>
                {pet.statusLabel}
              </span>
            </button>
          );
        })}
      </div>
      <NavButtons step={2} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function Step3ClaimReason({ value, onChange, onBack, onNext }) {
  return (
    <div className="flex flex-col flex-1 gap-4">
      <MascotBubble message="We're here to help! 💙" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        Oh no, what happened? 😰
      </h2>
      <div className="flex flex-col gap-1 mt-2">
        {CLAIM_REASONS.map((reason) => {
          const selected = value === reason;
          return (
            <button
              key={reason}
              onClick={() => onChange(reason)}
              className={`flex items-center gap-5 px-6 h-14 rounded-2xl text-left text-primary-600 transition ${
                selected ? "bg-primary-25 font-medium" : "bg-paper-tertiary hover:bg-primary-25"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                selected ? "border-primary-500 bg-primary-500" : "border-primary-200"
              }`}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <span className="text-base">{reason}</span>
            </button>
          );
        })}
      </div>
      <NavButtons step={3} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function Step4VisitDate({ value, onChange, onBack, onNext }) {
  return (
    <div className="flex flex-col flex-1 gap-6">
      <MascotBubble message="Every detail counts! 📅" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        When was the vet visit? 📅
      </h2>
      <div className="bg-paper-tertiary rounded-2xl p-6">
        <label className="text-sm font-medium text-text-primary block mb-2">
          Visit Date <span className="text-ruby-400">*</span>
        </label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 rounded-xl border border-text-border bg-white text-text-primary focus:outline-none focus:border-primary-500 text-sm"
        />
      </div>
      <NavButtons step={4} onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

function Step5Amount({ value, onChange, onBack, onNext }) {
  return (
    <div className="flex flex-col flex-1 gap-6">
      <MascotBubble message="Let's figure this out! 💰" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        How much was the bill? 💰
      </h2>
      <div className="bg-paper-tertiary rounded-2xl p-6">
        <label className="text-sm font-medium text-text-primary block mb-2">
          Claim Amount (AED) <span className="text-ruby-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">AED</span>
          <input
            type="number"
            placeholder="0.00"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min="1"
            className="w-full pl-14 pr-4 py-3 rounded-xl border border-text-border bg-white text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm"
          />
        </div>
      </div>
      <NavButtons step={5} onBack={onBack} onNext={onNext} nextDisabled={!value || Number(value) <= 0} />
    </div>
  );
}

function Step6Documents({ files, onChange, onBack, onNext }) {
  function handleDrop(e) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    onChange([...files, ...dropped]);
  }
  function handleInput(e) {
    const picked = Array.from(e.target.files);
    onChange([...files, ...picked]);
  }
  function removeFile(idx) {
    onChange(files.filter((_, i) => i !== idx));
  }
  return (
    <div className="flex flex-col flex-1 gap-6">
      <MascotBubble message="Almost there! 📎" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        Upload your documents 📎
      </h2>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-primary-200 rounded-2xl p-8 flex flex-col items-center gap-3 bg-primary-25 cursor-pointer hover:bg-primary-50 transition"
        onClick={() => document.getElementById("doc-upload").click()}
      >
        <span className="text-4xl">📂</span>
        <p className="text-sm text-text-secondary text-center">
          Drag & drop vet bills or medical documents here<br />
          <span className="text-primary-500 font-medium">or click to browse</span>
        </p>
        <p className="text-xs text-text-secondary">PDF, JPG, PNG — max 10 MB each</p>
        <input id="doc-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleInput} />
      </div>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-paper-tertiary rounded-xl px-4 py-2">
              <span>📄</span>
              <span className="flex-1 text-sm text-text-primary truncate">{f.name}</span>
              <span className="text-xs text-text-secondary">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => removeFile(i)} className="text-text-secondary hover:text-ruby-400 text-sm ml-2">✕</button>
            </div>
          ))}
        </div>
      )}
      <NavButtons step={6} onBack={onBack} onNext={onNext} nextLabel="Next Step →" />
    </div>
  );
}

function Step7Comments({ value, onChange, onBack, onNext }) {
  return (
    <div className="flex flex-col flex-1 gap-6">
      <MascotBubble message="Your words matter! 💬" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        Any additional comments? 💬
      </h2>
      <div className="bg-paper-tertiary rounded-2xl p-6 flex-1">
        <label className="text-sm font-medium text-text-primary block mb-2">
          Comments <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <textarea
          rows={6}
          placeholder="Describe what happened, any treatment details, or anything else that may help process your claim faster…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-text-border bg-white text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm resize-none"
        />
      </div>
      <NavButtons step={7} onBack={onBack} onNext={onNext} nextLabel="Review & Submit →" />
    </div>
  );
}

function Step8Review({ data, onBack, onSubmit, loading, result, error }) {
  const pet = PETS.find((p) => p.id === data.pet);

  if (result) {
    return (
      <div className="flex flex-col flex-1 gap-5">
        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-700">Claim Submitted & Classified!</p>
            {result.result.claim_id && <p className="text-xs text-green-600 mt-0.5">ID: {result.result.claim_id}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-paper-secondary rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">Claim Type</p>
            <p className="font-semibold text-text-primary capitalize">{result.result.claim_type}</p>
          </div>
          <div className="bg-paper-secondary rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">Priority</p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${PRIORITY_COLORS[result.result.priority] || "bg-gray-100 text-gray-700"}`}>
              {result.result.priority}
            </span>
          </div>
          <div className="bg-paper-secondary rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-2">AI Confidence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${result.result.confidence * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-text-primary">{Math.round(result.result.confidence * 100)}%</span>
            </div>
          </div>
          <div className="bg-paper-secondary rounded-xl p-4">
            <p className="text-xs text-text-secondary mb-1">Model</p>
            <p className="text-xs text-text-primary truncate">{result.model}</p>
          </div>
        </div>
        <div className="bg-paper-secondary rounded-xl p-4">
          <p className="text-xs text-text-secondary mb-1">AI Reasoning</p>
          <p className="text-sm text-text-primary leading-relaxed">{result.result.reasoning}</p>
        </div>
        {result.result.suggested_tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.result.suggested_tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary-25 text-primary-600 border border-primary-50">{tag}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  const claimText = [
    `Pet: ${pet?.name} (${pet?.breed}, ${pet?.age} yo)`,
    `Reason: ${data.reason}`,
    `Visit date: ${data.visitDate}`,
    `Amount: AED ${data.amount}`,
    data.comments ? `Comments: ${data.comments}` : null,
  ].filter(Boolean).join(". ");

  return (
    <div className="flex flex-col flex-1 gap-4">
      <MascotBubble message="One last look! 🔍" />
      <h2 className="font-display text-3xl text-primary-500 text-center">
        Review & Submit 🔍
      </h2>

      {error && (
        <div className="bg-red-50 rounded-xl p-3 text-red-600 text-sm flex gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {[
          { label: "Pet",        value: pet ? `${pet.emoji} ${pet.name} — ${pet.breed}, ${pet.age} yo` : "—" },
          { label: "Reason",     value: data.reason || "—" },
          { label: "Visit Date", value: data.visitDate || "—" },
          { label: "Amount",     value: data.amount ? `AED ${Number(data.amount).toLocaleString()}` : "—" },
          { label: "Documents",  value: data.files.length > 0 ? `${data.files.length} file(s) attached` : "None" },
          { label: "Comments",   value: data.comments || "—" },
        ].map((row) => (
          <div key={row.label} className="flex gap-3 bg-paper-tertiary rounded-xl px-4 py-3">
            <span className="text-xs font-medium text-text-secondary w-24 shrink-0 pt-0.5">{row.label}</span>
            <span className="text-sm text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>

      <NavButtons
        step={8}
        onBack={onBack}
        onNext={() => onSubmit(claimText)}
        nextLabel="Submit Claim ✓"
        loading={loading}
      />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function SendClaim() {
  const navigate  = useNavigate();
  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");

  const [formData, setFormData] = useState({
    pet:       "",
    reason:    "",
    visitDate: "",
    amount:    "",
    files:     [],
    comments:  "",
  });

  function update(field) {
    return (val) => setFormData((prev) => ({ ...prev, [field]: val }));
  }

  function next() { setStep((s) => Math.min(s + 1, 8)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  async function handleSubmit(claimText) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_text: claimText }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Submission failed");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1Intro onNext={next} />;
      case 2: return <Step2SelectPet value={formData.pet} onChange={update("pet")} onBack={back} onNext={next} />;
      case 3: return <Step3ClaimReason value={formData.reason} onChange={update("reason")} onBack={back} onNext={next} />;
      case 4: return <Step4VisitDate value={formData.visitDate} onChange={update("visitDate")} onBack={back} onNext={next} />;
      case 5: return <Step5Amount value={formData.amount} onChange={update("amount")} onBack={back} onNext={next} />;
      case 6: return <Step6Documents files={formData.files} onChange={update("files")} onBack={back} onNext={next} />;
      case 7: return <Step7Comments value={formData.comments} onChange={update("comments")} onBack={back} onNext={next} />;
      case 8: return <Step8Review data={formData} onBack={back} onSubmit={handleSubmit} loading={loading} result={result} error={error} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-paper-secondary flex items-start justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-text-border">
          <h1 className="font-display text-2xl text-text-primary">Send a Claim</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-9 h-9 rounded-full border border-text-border flex items-center justify-center text-text-secondary hover:bg-paper-secondary transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex gap-6 p-6 min-h-[680px]">
          <StepsSidebar currentStep={step} />

          {/* Main content */}
          <div className="flex-1 border border-primary-25 rounded-xl p-6 flex flex-col">
            {stepContent()}

            {/* Done state: back to dashboard */}
            {result && (
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-sm hover:opacity-90 transition"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
