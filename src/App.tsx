import React from 'react';
import { HorizonProvider, useHorizon } from './context/HorizonContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { Shell } from './components/layout/Shell';
import { HomeDashboard } from './components/features/HomeDashboard';
import { Trackers3DArena } from './components/features/Trackers3DArena';
import { FocusArena } from './components/features/FocusArena';
import { YouTubeCinema } from './components/features/YouTubeCinema';
import { StudyPlanner } from './components/features/StudyPlanner';
import { RoadmapTimeline } from './components/features/RoadmapTimeline';
import { CybersecurityConsole } from './components/features/CybersecurityConsole';
import { AILaboratory } from './components/features/AILaboratory';
import { ProjectsStudio } from './components/features/ProjectsStudio';
import { PlacementPrep } from './components/features/PlacementPrep';
import { ProgressAnalytics } from './components/features/ProgressAnalytics';
import { SettingsControlRoom } from './components/features/SettingsControlRoom';
import { LeetCodeModuleWrapper } from './components/leetcode/LeetCodeModuleWrapper';
import { SystemDesignStudio } from './components/systemdesign/SystemDesignStudio';
import { MockInterviewHub } from './components/mockinterview/MockInterviewHub';
import { CompensationExplorer } from './components/career/CompensationExplorer';
import { CompanyTracks } from './components/career/CompanyTracks';
import { StarStoryBank } from './components/career/StarStoryBank';
import { ReadinessDashboard } from './components/career/ReadinessDashboard';
import { INITIAL_LEETCODE_PROBLEMS } from './data/problemsData';

const MainAppContent: React.FC = () => {
  const {
    splashActive,
    onboardingActive,
    activeTab,
    setActiveTab,
    solvedLeetCodeIds,
    streakDays,
    setSelectedLeetCodeProblemId,
    completedSystemDesignIds,
    mockSessions,
  } = useHorizon();

  // 1. Cinematic Splash Screen (Always opens on fresh launch)
  if (splashActive) {
    return <SplashScreen />;
  }

  // 2. Guided Mission Setup Onboarding Flow
  if (onboardingActive) {
    return <OnboardingFlow />;
  }

  // 3. Desktop Application Workspace Shell
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'leetcode':
        return <LeetCodeModuleWrapper />;
      case 'systemdesign':
        return <SystemDesignStudio />;
      case 'mockinterview':
        return (
          <MockInterviewHub
            problems={INITIAL_LEETCODE_PROBLEMS}
            onAddInterviewRecord={() => {}}
          />
        );
      case 'compensation':
        return <CompensationExplorer />;
      case 'companytracks':
        return (
          <CompanyTracks
            onOpenProblem={(probId) => {
              setSelectedLeetCodeProblemId(probId);
              setActiveTab('leetcode');
            }}
          />
        );
      case 'starstories':
        return <StarStoryBank />;
      case 'readiness':
        return (
          <ReadinessDashboard
            streakDays={streakDays}
            solvedCount={solvedLeetCodeIds.length}
            totalProblems={INITIAL_LEETCODE_PROBLEMS.length}
            mockInterviewCount={mockSessions.length}
            systemDesignsCount={completedSystemDesignIds.length}
            onNavigateTab={setActiveTab}
          />
        );
      case 'trackers':
        return <Trackers3DArena />;
      case 'focus':
        return <FocusArena />;
      case 'youtube':
        return <YouTubeCinema />;
      case 'planner':
        return <StudyPlanner />;
      case 'roadmap':
        return <RoadmapTimeline />;
      case 'cybersecurity':
        return <CybersecurityConsole />;
      case 'aiml':
        return <AILaboratory />;
      case 'projects':
        return <ProjectsStudio />;
      case 'placement':
        return <PlacementPrep />;
      case 'progress':
        return <ProgressAnalytics />;
      case 'settings':
        return <SettingsControlRoom />;
      default:
        return <HomeDashboard />;
    }
  };

  return <Shell>{renderTabContent()}</Shell>;
};

export default function App() {
  return (
    <HorizonProvider>
      <MainAppContent />
    </HorizonProvider>
  );
}
