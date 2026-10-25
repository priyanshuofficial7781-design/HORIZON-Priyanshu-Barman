import React, { useState } from 'react';
import { useHorizon } from '../../context/HorizonContext';
import { SemesterNumber } from '../../types';
import { Subject3DIcon } from '../common/GraphicAssets';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const {
    setOnboardingActive,
    onboardingStep,
    setOnboardingStep,
    profile,
    updateProfile,
    setActiveTab,
  } = useHorizon();

  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    profile.goals.length > 0
      ? profile.goals
      : ['DSA & Competitive Programming', 'Cybersecurity', 'AI/ML']
  );
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(profile.semester);
  const [selectedHours, setSelectedHours] = useState<string>(profile.dailyStudyHours || '4-6 hrs');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    profile.studyDays.length > 0 ? profile.studyDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  );
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(
    profile.learningPriorities.length > 0
      ? profile.learningPriorities
      : [
          'C++ / DSA',
          'Aptitude',
          'Mathematics',
          'Python',
          'Cybersecurity',
          'AI / ML',
          'University Subjects',
          'Projects & Placement',
        ]
  );

  const goalOptions = [
    'DSA & Competitive Programming',
    'Cybersecurity',
    'AI/ML',
    'Build Projects',
    'Get Placed',
    'Other',
  ];

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hourOptions = ['4-6 hrs', '6-8 hrs', '8-10 hrs'];

  const prioritySubjects = [
    { id: 'C++ / DSA', label: 'C++ / DSA', iconKey: 'cpp-dsa' },
    { id: 'Aptitude', label: 'Aptitude', iconKey: 'aptitude' },
    { id: 'Mathematics', label: 'Mathematics', iconKey: 'math' },
    { id: 'Python', label: 'Python', iconKey: 'python' },
    { id: 'Cybersecurity', label: 'Cybersecurity', iconKey: 'cybersecurity' },
    { id: 'AI / ML', label: 'AI / ML', iconKey: 'aiml' },
    { id: 'University Subjects', label: 'University Subjects', iconKey: 'university' },
    { id: 'Projects & Placement', label: 'Projects & Placement', iconKey: 'projects' },
  ];

  const toggleGoal = (label: string) => {
    setSelectedGoals(prev =>
      prev.includes(label) ? (prev.length > 1 ? prev.filter(g => g !== label) : prev) : [...prev, label]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? (prev.length > 1 ? prev.filter(d => d !== day) : prev) : [...prev, day]
    );
  };

  const togglePriority = (id: string) => {
    setSelectedPriorities(prev =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter(p => p !== id) : prev) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (onboardingStep === 1) {
      updateProfile({ goals: selectedGoals });
      setOnboardingStep(2);
    } else if (onboardingStep === 2) {
      updateProfile({
        semester: selectedSemester,
        dailyStudyHours: selectedHours,
        studyDays: selectedDays,
      });
      setOnboardingStep(3);
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleFinishOnboarding = () => {
    updateProfile({
      goals: selectedGoals,
      semester: selectedSemester,
      dailyStudyHours: selectedHours,
      studyDays: selectedDays,
      learningPriorities: selectedPriorities,
      onboarded: true,
    });
    setOnboardingActive(false);
    setActiveTab('home');
  };

  const handleSkip = () => {
    updateProfile({ onboarded: true });
    setOnboardingActive(false);
    setActiveTab('home');
  };

  const stepsList = [
    { num: '01', label: 'Welcome' },
    { num: '02', label: 'Goals' },
    { num: '03', label: 'Study Plan' },
    { num: '04', label: 'Preferences' },
  ];

  // Map step number to sidebar active index:
  // Step 1: Welcome & Goals (highlights (01) or (02))
  // Step 2: Study Plan (highlights (03))
  // Step 3: Preferences (highlights (04))
  const activeSidebarIndex = onboardingStep === 1 ? 0 : onboardingStep === 2 ? 2 : 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/95 backdrop-blur-2xl p-4 sm:p-6 overflow-y-auto select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#8B5CFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#35D9FF]/12 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card matching collage */}
      <div className="relative w-full max-w-5xl bg-[#0B1228]/95 border border-[#8B5CFF]/25 rounded-3xl shadow-[0_0_50px_rgba(5,8,22,0.9)] overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        {/* LEFT SIDEBAR: Step Indicator */}
        <aside className="w-full md:w-56 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#8B5CFF]/15 bg-[#080D20]/80 flex flex-row md:flex-col justify-between shrink-0">
          <div className="space-y-4 w-full">
            <div className="hidden md:flex items-center gap-2 mb-6 text-slate-400 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#35D9FF] animate-pulse" />
              <span>HORIZON SETUP</span>
            </div>

            <div className="flex flex-row md:flex-col gap-2 w-full justify-between md:justify-start">
              {stepsList.map((step, idx) => {
                const isActive = idx === activeSidebarIndex;
                const isPassed = idx < activeSidebarIndex;
                return (
                  <div
                    key={step.num}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B5CFF]/30 to-[#35D9FF]/20 text-white border border-[#8B5CFF]/50 shadow-md shadow-[#8B5CFF]/20 font-bold'
                        : isPassed
                        ? 'text-slate-300 opacity-80'
                        : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] shrink-0 ${
                        isActive
                          ? 'bg-[#35D9FF] text-slate-950 font-bold'
                          : isPassed
                          ? 'bg-[#8B5CFF]/30 text-[#C4B5FD]'
                          : 'bg-[#111A35] text-slate-500'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="truncate">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            BCA Career Command
          </div>
        </aside>

        {/* MAIN ONBOARDING CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-10">
          {/* STEP 1: WELCOME & GOALS (Panel 2 of Collage) */}
          {onboardingStep === 1 && (
            <div className="space-y-7 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="max-w-md">
                  <h2 className="text-3xl font-extrabold font-['Outfit'] text-white tracking-tight">
                    Welcome to Horizon
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Your all-in-one learning and career companion for BCA, Cybersecurity, and AI/ML.
                  </p>
                </div>

                {/* 3D Holographic Laptop Asset matching collage */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 self-center sm:self-start">
                  <img
                    src="/assets/horizon/onboarding_laptop.png"
                    alt="3D Holographic Laptop"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(53,217,255,0.4)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">
                  What are your current goals?
                </label>
                {/* 6 Goal Pills matching collage */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {goalOptions.map(goal => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-3 rounded-2xl text-xs font-semibold text-center transition-all duration-150 cursor-pointer border ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#8B5CFF]/30 to-[#35D9FF]/20 border-[#35D9FF] text-white shadow-lg shadow-[#8B5CFF]/20 scale-[1.02]'
                            : 'bg-[#111A35]/60 hover:bg-[#111A35] border-slate-700/80 text-slate-300 hover:text-white'
                        }`}
                      >
                        {goal}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLAN YOUR STUDY (Panel 3 of Collage) */}
          {onboardingStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="max-w-md">
                  <h2 className="text-3xl font-extrabold font-['Outfit'] text-white tracking-tight">
                    Plan Your Study
                  </h2>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Tell us how you like to learn, and we'll create a personalized plan for you.
                  </p>
                </div>

                {/* 3D Holographic Calendar & Clock Asset matching collage */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 self-center sm:self-start">
                  <img
                    src="/assets/horizon/onboarding_calendar.png"
                    alt="3D Holographic Calendar"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(139,92,255,0.4)]"
                  />
                </div>
              </div>

              {/* Current Semester */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                  Current Semester
                </label>
                <div className="grid grid-cols-6 gap-2.5 max-w-sm">
                  {([1, 2, 3, 4, 5, 6] as SemesterNumber[]).map(sem => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setSelectedSemester(sem)}
                      className={`h-11 rounded-xl font-mono font-bold text-sm transition-all duration-150 cursor-pointer border ${
                        selectedSemester === sem
                          ? 'bg-[#35D9FF] border-[#35D9FF] text-slate-950 shadow-md shadow-[#35D9FF]/40 font-extrabold scale-105'
                          : 'bg-[#111A35]/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Study Hours */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                  Daily Study Hours
                </label>
                <div className="flex flex-wrap gap-3">
                  {hourOptions.map(hr => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setSelectedHours(hr)}
                      className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer border ${
                        selectedHours === hr
                          ? 'bg-[#8B5CFF] border-[#8B5CFF] text-white shadow-md shadow-[#8B5CFF]/30 font-bold'
                          : 'bg-[#111A35]/80 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {hr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 font-mono">
                  Study Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysList.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-11 h-11 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#35D9FF] border-[#35D9FF] text-slate-950 shadow-md shadow-[#35D9FF]/30'
                            : 'bg-[#111A35]/70 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE YOUR LEARNING PRIORITIES (Panel 4 of Collage) */}
          {onboardingStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-3xl font-extrabold font-['Outfit'] text-white tracking-tight">
                  Choose Your Learning Priorities
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Please select subjects you want to focus on. You can change this later in settings.
                </p>
              </div>

              {/* 8 Subject Cards with exact 3D Icons matching collage */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {prioritySubjects.map(sub => {
                  const isSelected = selectedPriorities.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => togglePriority(sub.id)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#111A35] to-[#0B1228] border-[#35D9FF] shadow-lg shadow-[#35D9FF]/20 scale-[1.02]'
                          : 'bg-[#0B1228] border-slate-800 text-slate-400 hover:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="w-12 h-12 mb-2 flex items-center justify-center">
                        <Subject3DIcon type={sub.iconKey} className="w-10 h-10" />
                      </div>
                      <span className="text-xs font-semibold text-white leading-tight">
                        {sub.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONBOARDING BOTTOM CONTROLS matching collage */}
          <div className="pt-6 border-t border-[#8B5CFF]/15 flex items-center justify-between gap-4 mt-6">
            {onboardingStep === 1 ? (
              <button
                type="button"
                onClick={handleSkip}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skip for now
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111A35] hover:bg-[#172346] border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {onboardingStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CFF] to-[#3B82F6] hover:from-[#9D71FF] hover:to-[#60A5FA] text-white font-bold text-xs shadow-lg shadow-[#8B5CFF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#8B5CFF] via-[#3B82F6] to-[#35D9FF] hover:opacity-95 text-slate-950 font-extrabold text-xs shadow-[0_0_25px_rgba(53,217,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
