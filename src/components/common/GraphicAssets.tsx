import React from 'react';

/**
 * High-fidelity vector illustrations and futuristic icons for Horizon
 */

export const CosmicLandscapeIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <radialGradient id="cosmic-glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#8B5CFF" stopOpacity="0.35" />
        <stop offset="50%" stopColor="#35D9FF" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#050816" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="planet-glow" cx="45%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="35%" stopColor="#8B5CFF" />
        <stop offset="70%" stopColor="#2E1065" />
        <stop offset="100%" stopColor="#0B1228" />
      </radialGradient>
      <linearGradient id="horizon-beam" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#35D9FF" stopOpacity="0.1" />
        <stop offset="50%" stopColor="#35D9FF" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#8B5CFF" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="mountains-back" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2E1065" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0B1228" />
      </linearGradient>
      <linearGradient id="mountains-front" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1E1B4B" />
        <stop offset="100%" stopColor="#050816" />
      </linearGradient>
      <filter id="glow-blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Cosmic atmosphere */}
    <rect width="1200" height="600" fill="#050816" />
    <circle cx="600" cy="240" r="400" fill="url(#cosmic-glow)" />

    {/* Distant stars */}
    <g opacity="0.6">
      <circle cx="120" cy="80" r="1.5" fill="#FFFFFF" />
      <circle cx="280" cy="140" r="1.2" fill="#35D9FF" />
      <circle cx="450" cy="60" r="2" fill="#FFFFFF" />
      <circle cx="780" cy="90" r="1.5" fill="#C4B5FD" />
      <circle cx="950" cy="160" r="1.8" fill="#FFFFFF" />
      <circle cx="1080" cy="70" r="1.2" fill="#35D9FF" />
      <circle cx="180" cy="220" r="1.2" fill="#FFFFFF" />
      <circle cx="890" cy="230" r="1.5" fill="#FFFFFF" />
      <circle cx="620" cy="110" r="2.2" fill="#FFFFFF" />
    </g>

    {/* Glowing Celestial Planet / Horizon Rim */}
    <circle cx="820" cy="380" r="280" fill="url(#planet-glow)" opacity="0.9" />
    <path
      d="M 540 380 A 280 280 0 0 1 1100 380"
      stroke="url(#horizon-beam)"
      strokeWidth="4"
      filter="url(#glow-blur)"
    />

    {/* Mountain Ridges */}
    <path
      d="M0 450 L120 380 L260 430 L410 350 L580 420 L750 330 L920 400 L1080 340 L1200 420 L1200 600 L0 600 Z"
      fill="url(#mountains-back)"
      opacity="0.8"
    />
    <path
      d="M0 500 L180 430 L360 480 L520 410 L690 470 L870 390 L1040 460 L1200 410 L1200 600 L0 600 Z"
      fill="url(#mountains-front)"
    />

    {/* Foreground Explorer / Student Silhouette looking out to Horizon */}
    <g transform="translate(340, 395) scale(0.65)" opacity="0.95">
      {/* Explorer helmet with cyan visor reflection */}
      <circle cx="30" cy="20" r="16" fill="#050816" stroke="#8B5CFF" strokeWidth="1.5" />
      <path d="M 24 16 Q 34 16 38 22" stroke="#35D9FF" strokeWidth="3" strokeLinecap="round" />
      {/* Backpack & suit */}
      <rect x="18" y="36" width="24" height="42" rx="6" fill="#0B1228" stroke="#8B5CFF" strokeWidth="1" />
      <rect x="8" y="40" width="10" height="26" rx="3" fill="#111A35" />
      {/* Arms & Legs */}
      <path d="M 18 42 L 8 60 M 42 42 L 52 58" stroke="#0B1228" strokeWidth="6" strokeLinecap="round" />
      <path d="M 24 78 L 20 110 M 36 78 L 42 110" stroke="#050816" strokeWidth="8" strokeLinecap="round" />
      {/* Cliff ledge */}
      <path d="M -30 110 Q 30 108 90 112 L 80 150 L -40 150 Z" fill="#050816" />
    </g>
  </svg>
);

export const Subject3DIcon: React.FC<{ type: string; color?: string; className?: string }> = ({
  type,
  className = 'w-10 h-10',
}) => {
  const iconMap: Record<string, string> = {
    'Code': '/assets/horizon/icon_cpp.png',
    'cpp-dsa': '/assets/horizon/icon_cpp.png',
    'C++ / DSA': '/assets/horizon/icon_cpp.png',
    'Sparkles': '/assets/horizon/icon_aptitude.png',
    'aptitude': '/assets/horizon/icon_aptitude.png',
    'Aptitude': '/assets/horizon/icon_aptitude.png',
    'Calculator': '/assets/horizon/icon_math.png',
    'math': '/assets/horizon/icon_math.png',
    'mathematics': '/assets/horizon/icon_math.png',
    'Mathematics': '/assets/horizon/icon_math.png',
    'Terminal': '/assets/horizon/icon_python.png',
    'python': '/assets/horizon/icon_python.png',
    'Python': '/assets/horizon/icon_python.png',
    'ShieldAlert': '/assets/horizon/icon_cyber.png',
    'cybersecurity': '/assets/horizon/icon_cyber.png',
    'Cybersecurity': '/assets/horizon/icon_cyber.png',
    'Brain': '/assets/horizon/icon_aiml.png',
    'aiml': '/assets/horizon/icon_aiml.png',
    'AI / ML': '/assets/horizon/icon_aiml.png',
    'BookOpen': '/assets/horizon/icon_university.png',
    'university': '/assets/horizon/icon_university.png',
    'University Subjects': '/assets/horizon/icon_university.png',
    'FolderGit2': '/assets/horizon/icon_projects.png',
    'projects': '/assets/horizon/icon_projects.png',
    'Projects & Placement': '/assets/horizon/icon_projects.png',
    'Projects': '/assets/horizon/icon_projects.png',
    'Coffee': '/assets/horizon/icon_cpp.png',
    'java': '/assets/horizon/icon_cpp.png',
  };

  const imgPath = iconMap[type];

  if (imgPath) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
        <img
          src={imgPath}
          alt={type}
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(53,217,255,0.35)] transition-transform duration-200 group-hover:scale-110"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center rounded-xl p-2.5 bg-gradient-to-br from-[#8B5CFF]/20 to-[#35D9FF]/10 border border-[#8B5CFF]/30 shadow-lg shadow-[#8B5CFF]/20 shrink-0 ${className}`}>
      <span className="text-xs font-bold text-[#35D9FF]">{type.slice(0, 2).toUpperCase()}</span>
    </div>
  );
};
