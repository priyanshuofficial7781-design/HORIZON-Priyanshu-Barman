import React, { useState } from 'react';
import { COMPENSATION_BENCHMARKS } from '../../data/compensationData';
import { CompensationLevel } from '../../types/career';
import {
  DollarSign,
  TrendingUp,
  Award,
  Building2,
  PieChart,
  ShieldCheck,
  Check,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

export const CompensationExplorer: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  const companies = ['All', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Uber'];

  const filtered = COMPENSATION_BENCHMARKS.filter(
    (c) => selectedCompany === 'All' || c.company === selectedCompany
  );

  const formatAmount = (usdVal: number) => {
    if (currency === 'USD') {
      return `$${usdVal.toLocaleString()}`;
    }
    // Approximate USD to INR purchasing power / converted package
    // 1 USD approx 86 INR
    const inrLakhs = (usdVal * 86) / 100000;
    if (inrLakhs >= 100) {
      return `₹${(inrLakhs / 100).toFixed(2)} Cr`;
    }
    return `₹${inrLakhs.toFixed(1)} L`;
  };

  return (
    <div className="flex flex-col h-full bg-[#050816] text-slate-100 overflow-y-auto p-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-r from-[#0d162d] via-[#091024] to-[#0d162d] border border-slate-800 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
                Tier-1 Compensation Intelligence
              </span>
              <span className="text-xs text-slate-400 font-mono">Verified Tech Offers</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Level-by-Level FAANG Salary Explorer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Accurate breakdown of Base Pay, Equity RSUs, and Bonuses from L3/SDE 1 to L5/Senior across Google, Meta, Amazon, Microsoft, and Uber.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex bg-[#070b16] p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currency === 'USD'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currency === 'INR'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              INR (₹ Lakhs/Cr)
            </button>
          </div>
        </div>

        {/* Company Filters */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px] mr-1">Filter by Firm:</span>
          {companies.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCompany(c)}
              className={`px-3 py-1 rounded-lg border transition-all ${
                selectedCompany === c
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold'
                  : 'bg-[#080d1a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-[#090f22] border border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all space-y-4 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200">
                  {item.company}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{item.yearsOfExp}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.level}</h3>
                <div className="text-xs text-slate-400">{item.title}</div>
              </div>

              {/* Total Annual Compensation Big Metric */}
              <div className="p-3 bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-xl space-y-0.5">
                <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">
                  Total Yearly Package
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {formatAmount(item.totalCompensationYearly)}
                  <span className="text-xs text-slate-400 font-normal"> / year</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Base Salary</span>
                  <span className="text-slate-200 font-semibold">{formatAmount(item.baseSalary)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Stock RSUs (Yearly)</span>
                  <span className="text-purple-300 font-semibold">{formatAmount(item.equityYearly)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Annual Bonus</span>
                  <span className="text-amber-300 font-semibold">{formatAmount(item.bonusYearly)}</span>
                </div>
              </div>

              {/* Vesting Schedule */}
              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                <span className="text-slate-300 font-semibold">Vesting: </span>
                {item.vestingSchedule}
              </div>
            </div>

            {/* Perks tags */}
            <div className="pt-2 flex flex-wrap gap-1">
              {item.samplePerks.slice(0, 2).map((perk, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-slate-400 border border-slate-800"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
