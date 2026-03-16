const NAV_ITEMS = [
  { icon: "⊞", label: "Dashboard", active: true },
  { icon: "🐾", label: "Pets", active: false },
  { icon: "📋", label: "Claims", active: false },
];

const BOTTOM_ITEMS = [
  { icon: "⚙️", label: "Settings" },
  { icon: "→", label: "Logout" },
  { icon: "🎁", label: "Refer" },
];

export default function Sidebar() {
  return (
    <aside className="w-[88px] bg-paper-secondary flex flex-col items-center py-8 gap-4 shrink-0">
      {/* Logo */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow">
        <span className="text-white text-xl font-bold font-display">O</span>
      </div>

      {/* Collapse button */}
      <button className="w-10 h-10 rounded-full border border-primary-25 bg-white shadow-sm flex items-center justify-center text-text-secondary hover:bg-primary-25 transition mb-2">
        <span className="text-xs">›</span>
      </button>

      {/* Main nav */}
      <div className="flex flex-col gap-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
              item.active
                ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-md"
                : "bg-white border border-primary-25 shadow-sm hover:bg-primary-25"
            }`}
          >
            <span className={item.active ? "text-white" : "text-text-secondary"}>
              {item.icon}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="mt-auto flex flex-col gap-3">
        {BOTTOM_ITEMS.map((item) => (
          <button
            key={item.label}
            title={item.label}
            className="w-14 h-14 rounded-full bg-white border border-primary-25 shadow-sm flex items-center justify-center text-text-secondary hover:bg-primary-25 transition"
          >
            <span className="text-sm">{item.icon}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
