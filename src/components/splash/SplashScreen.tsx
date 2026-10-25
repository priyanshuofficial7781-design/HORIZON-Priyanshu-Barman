import React from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { CosmicLandscapeIllustration } from '../common/GraphicAssets';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { setSplashActive, setOnboardingActive, profile } = useHorizon();

  const handleGetStarted = () => {
    setSplashActive(false);
    setOnboardingActive(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#050816] text-slate-100 overflow-hidden select-none">
      {/* Background illustration with astronaut & cosmic horizon artwork */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/horizon/splash_full.png"
          alt="Horizon Cosmic Planet"
          className="w-full h-full object-cover object-bottom filter brightness-[0.88] contrast-[1.05]"
        />
        {/* Subtle vignette & ambient glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#050816]/30 to-[#050816]/80 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CFF] to-[#35D9FF] p-[1.5px] shadow-lg shadow-[#8B5CFF]/30">
            <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#35D9FF]" />
            </div>
          </div>
          <div>
            <span className="font-['Outfit'] text-lg font-bold tracking-wider text-white">HORIZON</span>
            <span className="text-[9px] tracking-widest text-[#35D9FF] uppercase block font-mono">BCA COMMAND</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-[#0B1228]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#8B5CFF]/20">
          <span className="w-2 h-2 rounded-full bg-[#35D9FF]" />
          <span>SEMESTER {profile.semester} · READY</span>
        </div>
      </header>

      {/* Hero Visual Center matching Panel 1 of collage */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto my-auto -mt-4">
        {/* Celestial Arc over HORIZON Wordmark */}
        <div className="relative mb-2">
          <svg
            className="w-48 sm:w-64 h-12 mx-auto overflow-visible"
            viewBox="0 0 240 60"
            fill="none"
          >
            <path
              d="M 10 50 Q 120 -5 230 50"
              stroke="url(#arc-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_#35D9FF]"
            />
            <defs>
              <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CFF" />
                <stop offset="50%" stopColor="#35D9FF" />
                <stop offset="100%" stopColor="#8B5CFF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Large HORIZON Brand Wordmark */}
          <h1 className="font-['Outfit'] text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-widest text-white -mt-3 drop-shadow-[0_0_35px_rgba(53,217,255,0.45)]">
            HORIZON
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg font-medium tracking-wide text-slate-200 mb-3">
          Plan <span className="text-[#35D9FF]">·</span> Learn <span className="text-[#8B5CFF]">·</span> Build <span className="text-[#35D9FF]">·</span> Grow
        </p>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-400 font-mono mb-8 max-w-md">
          Your BCA journey, now with direction.
        </p>

        {/* Primary Action Button - Pill shape matching collage */}
        <button
          type="button"
          onClick={handleGetStarted}
          className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] hover:from-[#9D71FF] hover:to-[#60A5FA] text-white font-bold text-sm shadow-[0_0_30px_rgba(139,92,255,0.5)] hover:shadow-[0_0_40px_rgba(53,217,255,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>

        <p className="mt-6 text-xs text-slate-400 font-mono tracking-wider">
          Big dreams. Better plans.
        </p>
      </main>

      {/* Atmospheric Minimal Footer */}
      <footer className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto w-full text-xs text-slate-500 font-mono">
        <span>Desktop Command Suite</span>
        <span>Horizon BCA</span>
      </footer>
    </div>
  );
};
