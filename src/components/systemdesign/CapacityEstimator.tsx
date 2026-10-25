import React, { useState } from 'react';
import { CapacityEstimationInput, CapacityEstimationResult } from '../../types/systemDesign';
import { Calculator, HardDrive, Cpu, Zap, Activity, ArrowRight } from 'lucide-react';

export const CapacityEstimator: React.FC = () => {
  const [inputs, setInputs] = useState<CapacityEstimationInput>({
    dauMillion: 50,
    readWriteRatio: 10,
    requestsPerUserPerDay: 20,
    avgPayloadKb: 2,
    dataRetentionYears: 5,
  });

  // Calculate back-of-the-envelope capacity
  const dau = inputs.dauMillion * 1_000_000;
  const totalDailyRequests = dau * inputs.requestsPerUserPerDay;
  const secondsPerDay = 86400;

  // Writes vs Reads
  const writeDailyRequests = totalDailyRequests / (1 + inputs.readWriteRatio);
  const readDailyRequests = writeDailyRequests * inputs.readWriteRatio;

  const writeQps = Math.round(writeDailyRequests / secondsPerDay);
  const readQps = Math.round(readDailyRequests / secondsPerDay);
  const peakQps = Math.round((writeQps + readQps) * 2.5);

  // Bandwidth
  const writeBandwidthBytesSec = writeQps * inputs.avgPayloadKb * 1024;
  const readBandwidthBytesSec = readQps * inputs.avgPayloadKb * 1024;
  const inboundMbps = +((writeBandwidthBytesSec * 8) / (1024 * 1024)).toFixed(2);
  const outboundMbps = +((readBandwidthBytesSec * 8) / (1024 * 1024)).toFixed(2);

  // Storage
  const dailyStorageGb = +((writeDailyRequests * inputs.avgPayloadKb) / (1024 * 1024)).toFixed(2);
  const fiveYearStorageTb = +(
    (dailyStorageGb * 365 * inputs.dataRetentionYears) /
    1024
  ).toFixed(2);

  // 80/20 rule cache: 20% of daily read requests stored in Redis RAM
  const redisRamGb = +(
    (readDailyRequests * 0.2 * inputs.avgPayloadKb) /
    (1024 * 1024)
  ).toFixed(2);

  const applyPreset = (preset: 'tinyurl' | 'twitter' | 'whatsapp' | 'netflix') => {
    switch (preset) {
      case 'tinyurl':
        setInputs({ dauMillion: 100, readWriteRatio: 100, requestsPerUserPerDay: 5, avgPayloadKb: 0.5, dataRetentionYears: 10 });
        break;
      case 'twitter':
        setInputs({ dauMillion: 300, readWriteRatio: 100, requestsPerUserPerDay: 30, avgPayloadKb: 1.5, dataRetentionYears: 5 });
        break;
      case 'whatsapp':
        setInputs({ dauMillion: 1000, readWriteRatio: 1, requestsPerUserPerDay: 50, avgPayloadKb: 0.8, dataRetentionYears: 1 });
        break;
      case 'netflix':
        setInputs({ dauMillion: 250, readWriteRatio: 20, requestsPerUserPerDay: 15, avgPayloadKb: 50, dataRetentionYears: 7 });
        break;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070b18] border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Back-of-the-Envelope Capacity Estimator</h2>
          </div>
          <p className="text-xs text-slate-400">
            Mandatory for FAANG System Design rounds: compute QPS, network throughput, disk footprint, and in-memory cache sizing.
          </p>
        </div>

        {/* Scale Presets */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 mr-1">Presets:</span>
          {(['tinyurl', 'twitter', 'whatsapp', 'netflix'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors uppercase text-[11px]"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Sliders & Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DAU */}
        <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Daily Active Users (DAU)</span>
            <span className="font-mono text-cyan-400 font-bold">{inputs.dauMillion}M users</span>
          </div>
          <input
            type="range"
            min="1"
            max="1000"
            value={inputs.dauMillion}
            onChange={(e) => setInputs({ ...inputs, dauMillion: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Read to Write Ratio */}
        <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Read-to-Write Ratio</span>
            <span className="font-mono text-purple-400 font-bold">{inputs.readWriteRatio} : 1</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={inputs.readWriteRatio}
            onChange={(e) => setInputs({ ...inputs, readWriteRatio: Number(e.target.value) })}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>

        {/* Avg Payload Size */}
        <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Average Request Payload</span>
            <span className="font-mono text-amber-400 font-bold">{inputs.avgPayloadKb} KB</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="100"
            step="0.5"
            value={inputs.avgPayloadKb}
            onChange={(e) => setInputs({ ...inputs, avgPayloadKb: Number(e.target.value) })}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Calculated Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* QPS Metric */}
        <div className="p-4 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono uppercase tracking-wider">Throughput / QPS</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {readQps.toLocaleString()} <span className="text-xs text-slate-400">read/s</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Write: {writeQps.toLocaleString()}/s | Peak: {peakQps.toLocaleString()}/s
          </div>
        </div>

        {/* Bandwidth Metric */}
        <div className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-mono uppercase tracking-wider">Network Throughput</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {outboundMbps > 1000 ? `${(outboundMbps / 1000).toFixed(2)} Gbps` : `${outboundMbps} Mbps`}
          </div>
          <div className="text-xs font-mono text-slate-400">
            Inbound: {inboundMbps} Mbps | Outbound: {outboundMbps} Mbps
          </div>
        </div>

        {/* 5-Year Storage */}
        <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-mono uppercase tracking-wider">5-Year Storage Footprint</span>
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {fiveYearStorageTb} <span className="text-xs text-slate-400">TB</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Daily Storage: {dailyStorageGb} GB / day
          </div>
        </div>

        {/* In-Memory Redis RAM (80/20) */}
        <div className="p-4 bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-800/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-mono uppercase tracking-wider">Redis RAM (80/20 Cache)</span>
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {redisRamGb} <span className="text-xs text-slate-400">GB RAM</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Holding top 20% daily read keys
          </div>
        </div>
      </div>

      {/* Quick Formula Explanations */}
      <div className="p-4 bg-[#090f22] border border-slate-800 rounded-xl text-xs space-y-2">
        <h4 className="font-semibold text-slate-300 font-mono">Standard FAANG Calculation Formulas:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
          <div>• 1 Day = 86,400 seconds ≈ 100,000 seconds (rule of thumb).</div>
          <div>• Peak QPS factor = 2x to 3x average QPS.</div>
          <div>• 80/20 Rule: 80% of read volume is driven by 20% of items.</div>
          <div>• Bandwidth = QPS × Average Payload Size × 8 bits.</div>
        </div>
      </div>
    </div>
  );
};
