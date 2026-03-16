const STATUS_STYLES = {
  active: "bg-green-50 text-green-600 border-primary-200",
  expiring: "bg-yellow-50 text-yellow-600 border-yellow-200",
  expired: "bg-red-50 text-red-500 border-red-200",
};

const BORDER_COLORS = {
  active: "border-l-primary-200",
  expiring: "border-l-yellow-400",
  expired: "border-l-ruby-300",
};

export default function PetCard({ name, breed, age, plan, status, statusLabel, emoji = "🐾" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${BORDER_COLORS[status]} p-4 relative`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-25 border-2 border-gray-200 flex items-center justify-center text-2xl shrink-0">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ruby-300 truncate">{name}</p>
          <p className="text-xs text-text-secondary">{breed}</p>
          <p className="text-xs text-text-secondary">{age} yo</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLES[status]} whitespace-nowrap`}
        >
          {statusLabel}
        </span>
      </div>
      {plan && (
        <p className="text-xs text-text-secondary mt-2 ml-[60px]">Plan: {plan}</p>
      )}
    </div>
  );
}
