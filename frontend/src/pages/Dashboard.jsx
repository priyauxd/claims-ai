import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { RadialKPI, StatKPI } from "../components/KPICard";
import PetCard from "../components/PetCard";
import ActivityTimeline from "../components/ActivityTimeline";

const PETS = [
  { name: "OSLO", breed: "American Bobtail", age: 2, plan: "Vital", status: "expiring", statusLabel: "expires Feb 15", emoji: "🐱" },
  { name: "Blah", breed: "American Bobtail", age: 2, plan: "Vital", status: "active", statusLabel: "Active Coverage", emoji: "🐱" },
  { name: "Luna", breed: "Golden Retriever", age: 2, plan: "Vital", status: "expired", statusLabel: "Expired", emoji: "🐶" },
];

const ACTIVITIES = [
  { type: "claim", title: "Claim Submitted", description: "Claim #CLM-2024-001 for Blah2 has been submitted", time: "2 hours ago" },
  { type: "renew", title: "Policy Renewed", description: "Your policy has been renewed for another year", time: "2 hours ago" },
  { type: "added", title: "New Pet Added", description: "Blah2 has been added to your coverage", time: "2 days ago" },
];

const PET_FILTERS = ["OSLO", "Blah", "Luna"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("OSLO");

  return (
    <div className="min-h-screen bg-paper-secondary flex">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-text-border shrink-0">
            <div>
              <h1 className="font-display text-[28px] text-text-primary leading-tight">
                Good afternoon, Emmanuel! 👋
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Here's what's happening with your pets today
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Talk to Vet — disabled */}
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-100 text-text-disabled text-sm font-medium cursor-not-allowed"
              >
                🩺 Talk to Vet
              </button>

              {/* Invite Friends */}
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-l from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition">
                🎁
                <div className="text-left leading-tight">
                  <p className="font-semibold text-sm">Invite Friends</p>
                  <p className="text-[10px] opacity-90">Earn AED 25 per referral</p>
                </div>
                <span className="text-xs">›</span>
              </button>

              {/* Send a Claim */}
              <button
                onClick={() => navigate("/claim")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-ruby-400 to-ruby-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
              >
                📄 Send a Claim
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">

            {/* Pet filter row */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-primary">🐾 Viewing stats for:</span>
              <div className="flex gap-2">
                {PET_FILTERS.map((pet) => (
                  <button
                    key={pet}
                    onClick={() => setActiveFilter(pet)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                      activeFilter === pet
                        ? "bg-primary-25 border-primary-50 text-primary-500"
                        : "bg-paper-tertiary border-text-border text-text-primary"
                    }`}
                  >
                    {pet}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI row */}
            <div className="flex gap-4">
              <RadialKPI percentage={65} label="Claim ratio" amount="8,992" />
              <RadialKPI percentage={44} label="Coverage Used" amount="8,808" color="#f15c86" />
              <StatKPI icon="🛡️" value="Vital" label="Effective: 04/07/2025" sub="Renewal: 03/07/2026" />
              <StatKPI icon="📋" value="5" label="Claims Submitted" />
              <StatKPI icon="⏳" value="1" label="Pending Claims" />
              <StatKPI icon="💰" value="35,000" label="Reimbursement: 80%" sub="Deductible: AED 500" />
            </div>

            {/* Bottom row: My Pets + Recent Activities */}
            <div className="grid grid-cols-[1fr_340px] gap-4">

              {/* My Pets */}
              <div className="bg-paper-tertiary rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-medium text-text-primary">🐾 My Pets</h2>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-l from-primary-600 to-primary-500 text-white text-xs font-medium shadow hover:opacity-90 transition">
                      + Add a Pet
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-25 bg-white text-primary-500 text-xs font-medium hover:bg-primary-25 transition">
                      View All ↗
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PETS.map((pet) => (
                    <PetCard key={pet.name} {...pet} />
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-paper-tertiary rounded-xl p-5">
                <h2 className="text-base font-medium text-text-primary mb-4 sticky top-0 bg-paper-tertiary">
                  🐾 Recent Activities
                </h2>
                <ActivityTimeline activities={ACTIVITIES} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-b-2xl px-6 py-4 flex items-center justify-between shrink-0">
            <a href="#" className="text-white/90 text-xs font-medium hover:text-white">Contact Us</a>
            <div className="flex gap-2">
              {["📸", "f", "in"].map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/90 text-xs hover:bg-white/20 transition"
                >
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
