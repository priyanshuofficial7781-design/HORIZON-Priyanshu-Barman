import React, { useState, useEffect, useRef } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Flame,
  Clock,
  Sparkles,
  Target,
  History,
  Music,
  Headphones,
  Award,
} from 'lucide-react';

type PresetDuration = 120 | 90 | 60 | 45 | 25;
type AmbienceType = 'none' | 'binaural' | 'cosmic' | 'rain';

export const FocusArena: React.FC = () => {
  const { focusSessions, addFocusSession, tasks } = useHorizon();

  const [selectedDuration, setSelectedDuration] = useState<number>(120);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [sessionGoal, setSessionGoal] = useState<string>('DSA Graph & Two-Pointer Mastery');
  const [ambience, setAmbience] = useState<AmbienceType>('none');
  const [volume, setVolume] = useState<number>(0.3);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [celebrationModal, setCelebrationModal] = useState<boolean>(false);

  // Web Audio Context & Synthesizer Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize or reset timer when selected duration changes
  const handleSelectPreset = (mins: number) => {
    if (isActive) {
      if (!window.confirm('Reset the active focus timer for the new duration?')) return;
    }
    setSelectedDuration(mins);
    setSecondsRemaining(mins * 60);
    setIsActive(false);
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const handleSessionComplete = () => {
    setIsActive(false);
    stopAudioAmbience();
    playCompletionChime();
    addFocusSession({
      title: sessionGoal || 'Deep Work Session',
      durationMinutes: selectedDuration,
      completed: true,
      mode: selectedDuration === 120 ? '120min' : 'custom',
    });
    setCelebrationModal(true);
  };

  const handleEarlyComplete = () => {
    const elapsedMinutes = Math.max(1, Math.round((selectedDuration * 60 - secondsRemaining) / 60));
    setIsActive(false);
    stopAudioAmbience();
    addFocusSession({
      title: sessionGoal || 'Completed Focus Session',
      durationMinutes: elapsedMinutes,
      completed: true,
      mode: 'custom',
    });
    setCelebrationModal(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(selectedDuration * 60);
  };

  // Web Audio Procedural Ambience Generator
  useEffect(() => {
    if (ambience === 'none' || !isActive) {
      stopAudioAmbience();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (ambience === 'binaural') {
        // Binaural theta beats: 216Hz and 222Hz (6Hz differential)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(222, ctx.currentTime);

        const pan1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const pan2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        if (pan1 && pan2) {
          pan1.pan.setValueAtTime(-0.8, ctx.currentTime);
          pan2.pan.setValueAtTime(0.8, ctx.currentTime);
          osc1.connect(pan1).connect(masterGain);
          osc2.connect(pan2).connect(masterGain);
        } else {
          osc1.connect(masterGain);
          osc2.connect(masterGain);
        }

        osc1.start();
        osc2.start();
        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
      } else if (ambience === 'cosmic' || ambience === 'rain') {
        // Procedural Brown / Pink noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brown noise integration filter
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = ambience === 'rain' ? 'bandpass' : 'lowpass';
        filter.frequency.setValueAtTime(ambience === 'rain' ? 800 : 250, ctx.currentTime);

        noise.connect(filter).connect(masterGain);
        noise.start();
        noiseNodeRef.current = noise;
      }
    } catch (e) {
      console.warn('Audio synthesis initialized with fallback:', e);
    }

    return () => {
      stopAudioAmbience();
    };
  }, [ambience, isActive]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  const stopAudioAmbience = () => {
    if (osc1Ref.current) {
      try {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
      } catch {}
      osc1Ref.current = null;
    }
    if (osc2Ref.current) {
      try {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
      } catch {}
      osc2Ref.current = null;
    }
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
        noiseNodeRef.current.disconnect();
      } catch {}
      noiseNodeRef.current = null;
    }
  };

  const playCompletionChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.6); // C6
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  };

  // Formatting helpers
  const totalSeconds = selectedDuration * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100));
  const displayHours = Math.floor(secondsRemaining / 3600);
  const displayMinutes = Math.floor((secondsRemaining % 3600) / 60);
  const displaySeconds = secondsRemaining % 60;

  const timeString =
    displayHours > 0
      ? `${displayHours}:${displayMinutes.toString().padStart(2, '0')}:${displaySeconds
          .toString()
          .padStart(2, '0')}`
      : `${displayMinutes.toString().padStart(2, '0')}:${displaySeconds
          .toString()
          .padStart(2, '0')}`;

  const strokeDashoffset = 754 - (754 * progressPercent) / 100;

  return (
    <div
      className={`h-full w-full min-h-0 flex flex-col bg-[#050816] text-slate-100 overflow-y-auto ${
        fullscreen ? 'fixed inset-0 z-50 p-6 bg-[#050816]' : 'p-6 pb-24 lg:pb-12'
      }`}
    >
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CFF] to-[#35D9FF] flex items-center justify-center shadow-lg shadow-[#8B5CFF]/25">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Focus Arena (120 Mins)</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#8B5CFF]/20 text-[#35D9FF] border border-[#8B5CFF]/30">
                Deep Work Chamber
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-intensity uninterrupted study blocks with procedural binaural audio
            </p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFullscreen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{fullscreen ? 'Exit Zen Mode' : 'Zen Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* MAIN FOCUS ARENA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER COLUMN: CIRCULAR TIMER & CONTROLS */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Cosmic Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#8B5CFF]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#35D9FF]/15 blur-3xl pointer-events-none" />

          {/* DURATION PRESET BUTTONS */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6">
            {([120, 90, 60, 45, 25] as PresetDuration[]).map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSelectPreset(mins)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                  selectedDuration === mins
                    ? 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white shadow-lg shadow-[#8B5CFF]/30 scale-105'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {mins === 120 ? '120 Min (Standard)' : `${mins} Min`}
              </button>
            ))}
          </div>

          {/* CIRCULAR TIMER HUD */}
          <div className="relative z-10 w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
              {/* Background Ring */}
              <circle
                cx="130"
                cy="130"
                r="115"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/5"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="130"
                cy="130"
                r="115"
                stroke="url(#arenaGradient)"
                strokeWidth="10"
                strokeDasharray="722"
                strokeDashoffset={722 - (722 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                fill="transparent"
              />
              <defs>
                <linearGradient id="arenaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CFF" />
                  <stop offset="50%" stopColor="#35D9FF" />
                  <stop offset="100%" stopColor="#FF7A59" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-4xl sm:text-6xl font-bold font-mono tracking-tight text-white tabular-nums">
                {timeString}
              </span>
              <span className="mt-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                {isActive ? 'DEEP WORK IN PROGRESS' : 'READY TO FOCUS'}
              </span>
              <span className="mt-1 text-xs text-[#35D9FF] font-medium max-w-[180px] truncate">
                {sessionGoal || 'Focus Objective'}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`flex items-center gap-2 py-3.5 px-8 rounded-2xl text-sm font-bold shadow-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white hover:opacity-95 shadow-[#8B5CFF]/30 scale-105'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" /> Pause Arena
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Start 120-Min Session
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {isActive && (
              <button
                type="button"
                onClick={handleEarlyComplete}
                className="flex items-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Early & Log
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AMBIENT SOUND GENERATOR & INTENT SETTER */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* SESSION GOAL CARD */}
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-md">
            <div className="flex items-center gap-2.5 mb-3 text-sm font-bold text-white">
              <Target className="w-4 h-4 text-[#8B5CFF]" />
              <h3>Current Session Mission</h3>
            </div>
            <input
              type="text"
              value={sessionGoal}
              onChange={(e) => setSessionGoal(e.target.value)}
              placeholder="e.g. LeetCode Graph Traversal & BFS"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              State your exact deliverable. Deep work requires clear single-task boundaries.
            </p>
          </div>

          {/* PROCEDURAL AMBIENCE SYNTHESIZER */}
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                <Headphones className="w-4 h-4 text-[#35D9FF]" />
                <h3>Focus Ambience (Web Audio)</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                100% Offline
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setAmbience('none')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  ambience === 'none'
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Mute Ambience
              </button>

              <button
                type="button"
                onClick={() => setAmbience('binaural')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  ambience === 'binaural'
                    ? 'bg-[#8B5CFF] text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Binaural Theta (6Hz)
              </button>

              <button
                type="button"
                onClick={() => setAmbience('cosmic')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  ambience === 'cosmic'
                    ? 'bg-[#35D9FF] text-slate-900 font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Cosmic Brown Noise
              </button>

              <button
                type="button"
                onClick={() => setAmbience('rain')}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  ambience === 'rain'
                    ? 'bg-[#10B981] text-white font-bold shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Rainfall Drone
              </button>
            </div>

            {/* Volume Slider */}
            {ambience !== 'none' && (
              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#8B5CFF] cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 w-8 tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* FOCUS SESSIONS HISTORY LOG */}
          <div className="p-6 rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/20 shadow-md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                <History className="w-4 h-4 text-[#FF7A59]" />
                <h3>Recent Deep Work Logs</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {focusSessions.length} logged
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {focusSessions.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  No focus sessions logged yet. Complete your first 120-minute block!
                </div>
              ) : (
                focusSessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {session.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded bg-[#8B5CFF]/20 text-[#35D9FF] text-[11px] font-mono font-bold">
                      {session.durationMinutes}m
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CELEBRATION MODAL */}
      {celebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-[#8B5CFF]/30 bg-[#0B1228] p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#8B5CFF] to-[#35D9FF] flex items-center justify-center shadow-lg shadow-[#8B5CFF]/30">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Mission Accomplished!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Deep work session logged to your Horizon permanent telemetry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCelebrationModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CFF] to-[#35D9FF] text-white text-xs font-bold shadow-md cursor-pointer hover:opacity-95"
            >
              Return to Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
