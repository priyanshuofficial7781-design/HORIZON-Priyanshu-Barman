import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ArrowRight,
  Terminal,
} from 'lucide-react';

export const CybersecurityConsole: React.FC = () => {
  const { cyberModules, toggleCyberLabCompleted } = useHorizon();
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // 9 Modules matching Panel 9 in collage
  const modulesList = [
    {
      id: 'cs-1',
      num: 1,
      title: 'Networking Fundamentals',
      ratio: '100/100',
      completed: true,
      objectives: [
        'Understand OSI & TCP/IP Reference Models',
        'Learn about IP addressing, subnets, and CIDR notation',
        'Explore common network tools (Wireshark loopback, ping, traceroute)',
      ],
      labs: [
        { id: 'cs-l1', title: 'Loopback Packet Capture in Wireshark', cmd: 'wireshark -k -i lo', completed: true },
        { id: 'cs-l2', title: 'DNS Resolution Audit (dig +trace)', cmd: 'dig +trace example.com', completed: true },
      ],
    },
    {
      id: 'cs-2',
      num: 2,
      title: 'Linux & Command Line',
      ratio: '0/150',
      completed: false,
      objectives: [
        'Master Linux file system permissions (chmod, chown, SUID/SGID)',
        'Audit active processes and open listening sockets with lsof & ss',
        'Configure UFW host firewall rules with default deny policy',
      ],
      labs: [
        { id: 'cs-l3', title: 'Audit SUID binaries safely', cmd: 'find / -perm -4000 -type f 2>/dev/null', completed: false },
        { id: 'cs-l4', title: 'UFW Firewall Rule Policy Configuration', cmd: 'sudo ufw default deny incoming && sudo ufw allow 22/tcp', completed: false },
      ],
    },
    {
      id: 'cs-3',
      num: 3,
      title: 'Python Scripting',
      ratio: '0/120',
      completed: false,
      objectives: [
        'Write safe socket scanners to audit open ports on local host',
        'Parse Apache/Nginx web server access logs for repeated 404 bursts',
        'Hash integrity checker using Python hashlib (SHA-256 baseline verification)',
      ],
      labs: [
        { id: 'cs-l5', title: 'SHA-256 File Integrity Monitor', cmd: 'python3 integrity_checker.py --watch /safe-lab/config/', completed: false },
      ],
    },
    {
      id: 'cs-4',
      num: 4,
      title: 'Operating Systems',
      ratio: '0/100',
      completed: false,
      objectives: [
        'Process isolation, memory segments, and kernel vs user mode',
        'File system structures, inode allocation, and access controls',
      ],
      labs: [
        { id: 'cs-l6', title: 'Kernel Ring Buffer Audit (dmesg)', cmd: 'dmesg -T | grep -i security', completed: false },
      ],
    },
    {
      id: 'cs-5',
      num: 5,
      title: 'Web Security',
      ratio: '0/120',
      completed: false,
      objectives: [
        'Understand SQL Injection vulnerabilities and parameterized queries',
        'Mitigate Reflected and Stored Cross-Site Scripting (XSS)',
        'Analyze insecure direct object references (IDOR) in REST APIs',
      ],
      labs: [
        { id: 'cs-l7', title: 'OWASP Juice Shop Safe Docker Lab', cmd: 'docker run --rm -p 3000:3000 bkimminich/juice-shop', completed: false },
      ],
    },
    {
      id: 'cs-6',
      num: 6,
      title: 'Defensive Security',
      ratio: '0/100',
      completed: false,
      objectives: [
        'Explore SIEM concepts and centralized log analysis (ELK Stack)',
        'Understand Snort / Suricata network intrusion detection rules',
      ],
      labs: [],
    },
    {
      id: 'cs-7',
      num: 7,
      title: 'Security Analysis',
      ratio: '0/90',
      completed: false,
      objectives: [
        'Vulnerability scanning methodologies and CVE scoring standards',
        'Threat modeling using STRIDE framework',
      ],
      labs: [],
    },
    {
      id: 'cs-8',
      num: 8,
      title: 'Practice Labs',
      ratio: '0/60',
      completed: false,
      objectives: [
        'OverTheWire Bandit wargame levels 1 to 15 (SSH & text processing)',
        'PicoCTF cryptography & reverse engineering challenges',
      ],
      labs: [],
    },
    {
      id: 'cs-9',
      num: 9,
      title: 'Portfolio Projects',
      ratio: '0/40',
      completed: false,
      objectives: [
        'Build a lightweight Intrusion Detection Log Analyzer in Python',
        'Publish open-source security hardening script with test suite',
      ],
      labs: [],
    },
  ];

  const activeModule = modulesList[activeModuleIndex] || modulesList[0];

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6 pb-24 lg:pb-12 animate-in fade-in duration-200 select-none">
      {/* Header matching Panel 9 in collage */}
      <div className="pb-3 border-b border-[#8B5CFF]/15">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white">
          Cybersecurity Path
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">
          Learn · Practice · Build
        </p>
      </div>

      {/* Main Split Layout: Left List of 9 modules | Right 3D Shield & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 9 Numbered Circular Modules (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          {modulesList.map((mod, idx) => {
            const isSelected = idx === activeModuleIndex;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModuleIndex(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#111A35] to-[#0B1228] border-[#35D9FF] shadow-lg shadow-[#35D9FF]/15 scale-[1.01]'
                    : 'bg-[#0B1228]/80 hover:bg-[#111A35] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-[#35D9FF] text-slate-950 shadow-md'
                        : mod.completed
                        ? 'bg-[#8B5CFF] text-white'
                        : 'bg-[#111A35] border border-slate-700 text-slate-400'
                    }`}
                  >
                    {mod.num}
                  </div>
                  <span className="text-xs font-semibold text-white truncate">
                    {mod.title}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                  {mod.ratio}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: 3D Holographic Shield & Active Module Details (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Glowing 3D Shield Asset matching Panel 9 */}
          <div className="relative flex items-center justify-center p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-2xl overflow-hidden min-h-[220px]">
            <div className="absolute inset-0 bg-radial from-[#35D9FF]/15 via-transparent to-transparent pointer-events-none" />
            <img
              src="/assets/horizon/cyber_shield.png"
              alt="Holographic Security Shield"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain filter drop-shadow-[0_0_30px_rgba(53,217,255,0.6)]"
            />
          </div>

          {/* Module Objective & Learning Action Card */}
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-slate-800 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#35D9FF] block">
                MODULE {activeModule.num} DETAIL
              </span>
              <h2 className="text-lg font-bold text-white font-['Outfit'] mt-0.5">
                Module {activeModule.num}: {activeModule.title}
              </h2>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2 font-mono">
                Objectives
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeModule.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35D9FF] mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Labs if present */}
            {activeModule.labs.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 font-mono block">
                  Safe Terminal Laboratories
                </span>
                {activeModule.labs.map(lab => (
                  <div
                    key={lab.id}
                    className="p-3 rounded-xl bg-[#111A35] border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="text-slate-200 font-medium truncate">{lab.title}</p>
                      <code className="text-[10px] text-cyan-300 font-mono">{lab.cmd}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(lab.cmd)}
                      className="p-1.5 rounded-lg bg-[#0B1228] border border-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      title="Copy safe lab command"
                    >
                      {copiedCmd === lab.cmd ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] hover:from-[#9D71FF] hover:to-[#60A5FA] text-white font-bold text-xs shadow-md shadow-[#8B5CFF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
