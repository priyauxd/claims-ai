export function RadialKPI({ percentage, label, amount, color = "#42a9b8" }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="bg-white border border-primary-25 rounded-xl p-4 flex-1 flex flex-col items-center justify-center gap-3 min-h-[160px]">
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-[72px] h-[72px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#e6f8fa" strokeWidth="8" />
            <circle
              cx="40" cy="40" r={r}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-lg text-text-primary">
            {percentage}%
          </span>
        </div>
        <span className="text-xs text-text-secondary">{label}</span>
      </div>
      {amount && (
        <div className="text-center">
          <p className="text-xs text-text-secondary">Claims Approved</p>
          <p className="text-sm font-bold text-text-primary">AED {amount}</p>
        </div>
      )}
    </div>
  );
}

export function StatKPI({ icon, value, label, sub }) {
  return (
    <div className="bg-white border border-primary-25 rounded-xl p-4 flex-1 flex flex-col gap-4 justify-center min-h-[160px]">
      <div className="w-12 h-12 rounded-2xl bg-primary-25 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <p className="font-display text-3xl font-bold text-text-primary leading-tight">{value}</p>
        <p className="text-sm text-text-secondary mt-1">{label}</p>
        {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
