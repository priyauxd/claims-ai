import { useState } from "react";

const PRIORITY_COLORS = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

const TYPE_LABELS = {
  medical: "Medical",
  auto: "Auto",
  property: "Property",
  liability: "Liability",
  life: "Life",
  workers_comp: "Workers Comp",
  other: "Other",
};

export default function SendClaimModal({ onClose }) {
  const [step, setStep] = useState("form"); // form | loading | result | error
  const [claimText, setClaimText] = useState("");
  const [claimId, setClaimId] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStep("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim_text: claimText,
          claim_id: claimId || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Classification failed");
      }

      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch (err) {
      setErrorMsg(err.message);
      setStep("error");
    }
  }

  function reset() {
    setStep("form");
    setClaimText("");
    setClaimId("");
    setResult(null);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-text-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ruby-400 flex items-center justify-center">
              <span className="text-white text-lg">📄</span>
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">Send a Claim</h2>
              <p className="text-xs text-text-secondary">AI-powered classification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper-tertiary flex items-center justify-center text-text-secondary hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-primary block mb-1">
                  Claim ID <span className="text-text-secondary font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CLM-2024-001"
                  value={claimId}
                  onChange={(e) => setClaimId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-text-border bg-paper-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary block mb-1">
                  Claim Description <span className="text-ruby-400">*</span>
                </label>
                <textarea
                  placeholder="Describe the claim in detail — what happened, when, the costs involved, and any relevant medical or incident details..."
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  rows={5}
                  required
                  minLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-text-border bg-paper-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-ruby-500 to-ruby-400 text-white font-semibold text-sm shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <span>📄</span> Classify & Submit Claim
              </button>
            </form>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary-25 border-t-primary-500 animate-spin" />
              <p className="text-text-secondary text-sm">Analyzing your claim with AI...</p>
            </div>
          )}

          {step === "result" && result && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-700 text-sm">Claim Classified Successfully</p>
                  {result.result.claim_id && (
                    <p className="text-xs text-green-600">ID: {result.result.claim_id}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-paper-secondary rounded-xl p-3">
                  <p className="text-xs text-text-secondary mb-1">Claim Type</p>
                  <p className="font-semibold text-text-primary text-sm">
                    {TYPE_LABELS[result.result.claim_type] || result.result.claim_type}
                  </p>
                </div>
                <div className="bg-paper-secondary rounded-xl p-3">
                  <p className="text-xs text-text-secondary mb-1">Priority</p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      PRIORITY_COLORS[result.result.priority] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {result.result.priority}
                  </span>
                </div>
                <div className="bg-paper-secondary rounded-xl p-3">
                  <p className="text-xs text-text-secondary mb-1">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${result.result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {Math.round(result.result.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <div className="bg-paper-secondary rounded-xl p-3">
                  <p className="text-xs text-text-secondary mb-1">Model</p>
                  <p className="text-xs text-text-primary truncate">{result.model}</p>
                </div>
              </div>

              <div className="bg-paper-secondary rounded-xl p-3">
                <p className="text-xs text-text-secondary mb-1">AI Reasoning</p>
                <p className="text-sm text-text-primary">{result.result.reasoning}</p>
              </div>

              {result.result.suggested_tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.result.suggested_tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-primary-25 text-primary-600 border border-primary-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={reset}
                  className="flex-1 py-2.5 rounded-full border border-primary-200 text-primary-500 font-medium text-sm hover:bg-primary-25 transition"
                >
                  Submit Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-sm hover:opacity-90 transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-700 text-sm">Classification Failed</p>
                  <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="w-full py-2.5 rounded-full border border-text-border text-text-secondary font-medium text-sm hover:bg-paper-secondary transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
