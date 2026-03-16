const TYPE_STYLES = {
  claim: { bg: "bg-red-50", icon: "📄", color: "text-red-400" },
  renew: { bg: "bg-primary-25", icon: "🔄", color: "text-primary-500" },
  added: { bg: "bg-blue-50", icon: "➕", color: "text-blue-400" },
};

export default function ActivityTimeline({ activities }) {
  return (
    <div className="flex flex-col">
      {activities.map((item, idx) => {
        const style = TYPE_STYLES[item.type] || TYPE_STYLES.added;
        return (
          <div key={idx} className="flex gap-3 relative pb-6 last:pb-0">
            {/* Vertical line */}
            {idx < activities.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-200" />
            )}
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl ${style.bg} flex items-center justify-center shrink-0 z-10`}
            >
              <span className="text-base">{style.icon}</span>
            </div>
            {/* Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-text-primary">{item.title}</p>
              <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
              <p className="text-xs text-text-secondary mt-1">{item.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
