import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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

export default function SendClaim() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-paper-secondary flex">
      <Sidebar />

      <div className="flex-1 p-6 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-4 px-8 py-6 border-b border-text-border shrink-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-9 h-9 rounded-full border border-text-border flex items-center justify-center text-text-secondary hover:bg-paper-secondary transition"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ruby-400 to-ruby-500 flex items-center justify-center">
                <span className="text-white text-lg">📄</span>
              </div>
              <div>
                <h1 className="font-semibold text-text-primary text-lg">Send a Claim</h1>
                <p className="text-xs text-text-secondary">AI-powered classification & submission</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-8 py-10">

              {step === "form" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-text-primary block mb-2">
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
                    <label className="text-sm font-medium text-text-primary block mb-2">
                      Claim Description <span className="text-ruby-400">*</span>
                    </label>
                    <textarea
                      placeholder="Describe the claim in detail — what happened, when, the costs involved, and any relevant medical or incident details..."
                      value={claimText}
                      onChange={(e) => setClaimText(e.target.value)}
                      rows={8}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 rounded-xl border border-text-border bg-paper-secondary text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-500 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-ruby-500 to-ruby-400 text-white font-semibold text-sm shadow-md hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <span>📄</span> Classify & Submit Claim
                  </button>
                </form>
              )}

              {step === "loading" && (
                <div className="flex flex-col items-center py-24 gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-primary-25 border-t-primary-500 animate-spin" />
                  <p className="text-text-secondary text-sm">Analyzing your claim with AI...</p>
                </div>
              )}

              {step === "result" && result && (
                <div className="space-y-5">
                  <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-green-700">Claim Classified Successfully</p>
                      {result.result.claim_id && (
                        <p className="text-xs text-green-600 mt-0.5">ID: {result.result.claim_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-paper-secondary rounded-xl p-4">
                      <p className="text-xs text-text-secondary mb-1">Claim Type</p>
                      <p className="font-semibold text-text-primary">
                        {TYPE_LABELS[result.result.claim_type] || result.result.claim_type}
                      </p>
                    </div>
                    <div className="bg-paper-secondary rounded-xl p-4">
                      <p className="text-xs text-text-secondary mb-1">Priority</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${PRIORITY_COLORS[result.result.priority] || "bg-gray-100 text-gray-700"}`}>
                        {result.result.priority}
                      </span>
                    </div>
                    <div className="bg-paper-secondary rounded-xl p-4">
                      <p className="text-xs text-text-secondary mb-2">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${result.result.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary">
                          {Math.round(result.result.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="bg-paper-secondary rounded-xl p-4">
                      <p className="text-xs text-text-secondary mb-1">Model</p>
                      <p className="text-sm text-text-primary truncate">{result.model}</p>
                    </div>
                  </div>

                  <div className="bg-paper-secondary rounded-xl p-4">
                    <p className="text-xs text-text-secondary mb-2">AI Reasoning</p>
                    <p className="text-sm text-text-primary leading-relaxed">{result.result.reasoning}</p>
                  </div>

                  {result.result.suggested_tags?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-secondary mb-2">Suggested Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {result.result.suggested_tags.map((tag) => (
                          <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary-25 text-primary-600 border border-primary-50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={reset}
                      className="flex-1 py-3 rounded-full border border-primary-200 text-primary-500 font-medium text-sm hover:bg-primary-25 transition"
                    >
                      Submit Another
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="flex-1 py-3 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-sm hover:opacity-90 transition"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {step === "error" && (
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-red-700">Classification Failed</p>
                      <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
                    </div>
                  </div>
                  <button
                    onClick={reset}
                    className="w-full py-3 rounded-full border border-text-border text-text-secondary font-medium text-sm hover:bg-paper-secondary transition"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-b-2xl px-6 py-4 flex items-center justify-between shrink-0">
            <a href="#" className="text-white/90 text-xs font-medium hover:text-white">Contact Us</a>
            <div className="flex gap-2">
              {["📸", "f", "in"].map((icon) => (
                <button key={icon} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 text-xs hover:bg-white/20 transition">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
