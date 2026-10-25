import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  useHorizon,
  extractYouTubeVideoId,
  extractYouTubePlaylistId,
} from '../../context/HorizonContext';
import {
  Youtube,
  Play,
  Plus,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Tv,
  ListVideo,
  SkipForward,
  SkipBack,
  Shuffle,
  ExternalLink,
  Flame,
  Check,
  Film,
  Compass,
  Search,
  Filter,
  CheckCheck,
  RotateCcw,
  Loader2,
  Sparkles,
  Download,
  RefreshCw,
  Trophy,
  Award,
} from 'lucide-react';
import { YouTubeLecture, YouTubePlaylist } from '../../types';

export const YouTubeCinema: React.FC = () => {
  const {
    youtubeLectures,
    selectedLecture,
    setSelectedLecture,
    addCustomYouTubeLecture,
    updateLectureNotes,
    savedPlaylists,
    activePlaylist,
    activePlaylistVideoIndex,
    autoPlayNext,
    setAutoPlayNext,
    setActivePlaylistById,
    setActivePlaylistVideoIndex,
    addCustomYouTubePlaylist,
    toggleVideoCompletedInPlaylist,
    markPlaylistUpToEpisodeWatched,
    playNextInPlaylist,
    playPrevInPlaylist,
    refreshPlaylist,
    isFetchingPlaylist,
    lastWatchedVideoByPlaylist,
    setActiveTab,
  } = useHorizon();

  const [cinemaMode, setCinemaMode] = useState<'playlist' | 'single'>('playlist');
  const [inputUrl, setInputUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('DSA & Algorithms');
  const [urlFeedback, setUrlFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [notesText, setNotesText] = useState(selectedLecture?.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Queue specific search and filtering
  const [queueSearch, setQueueSearch] = useState('');
  const [onlyUnwatched, setOnlyUnwatched] = useState(false);

  const activeEpisodeRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    'All',
    'DSA & Algorithms',
    'Java & Placement DSA',
    'System Design',
    'Core CS',
    'Python',
    'Web Dev',
    'Cybersecurity',
    'DBMS',
  ];

  // Auto-scroll queue to currently playing episode
  useEffect(() => {
    if (activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activePlaylistVideoIndex, activePlaylist?.id]);

  // Current active episode in playlist
  const currentEpisode = activePlaylist?.videos[activePlaylistVideoIndex];

  // Calculated completion metrics for active playlist
  const completedEpisodesCount = activePlaylist?.videos.filter((v) => v.completed).length || 0;
  const totalEpisodesCount = activePlaylist?.videos.length || 0;
  const playlistProgressPercent =
    totalEpisodesCount > 0 ? Math.round((completedEpisodesCount / totalEpisodesCount) * 100) : 0;

  // Milestone quarter definitions
  const milestones = [
    { percent: 25, label: 'Bronze (25%)', emoji: '🥉' },
    { percent: 50, label: 'Silver (50%)', emoji: '🥈' },
    { percent: 75, label: 'Gold (75%)', emoji: '🥇' },
    { percent: 100, label: 'Master (100%)', emoji: '🏆' },
  ];

  // Filtered queue episodes supporting 100+ to 500+ videos with instant search
  const filteredQueueEpisodes = useMemo(() => {
    if (!activePlaylist) return [];
    return activePlaylist.videos
      .map((ep, originalIdx) => ({ ep, originalIdx }))
      .filter(({ ep, originalIdx }) => {
        if (onlyUnwatched && ep.completed) return false;
        if (queueSearch.trim()) {
          const q = queueSearch.trim().toLowerCase();
          const cleanNum = q.replace(/^#/, '');
          const matchesEpNum = (originalIdx + 1).toString() === cleanNum;
          const matchesTitle = ep.title.toLowerCase().includes(q);
          if (!matchesEpNum && !matchesTitle) return false;
        }
        return true;
      });
  }, [activePlaylist, queueSearch, onlyUnwatched]);

  // Embed URL calculation with deep link index & playlist sync
  const embedSrc = useMemo(() => {
    if (cinemaMode === 'playlist' && activePlaylist) {
      const epVideoId = currentEpisode?.videoId;
      if (epVideoId && epVideoId.length === 11) {
        return `https://www.youtube-nocookie.com/embed/${epVideoId}?list=${activePlaylist.playlistId}&index=${activePlaylistVideoIndex + 1}&autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;
      }
      return `https://www.youtube-nocookie.com/embed/videoseries?list=${activePlaylist.playlistId}&index=${activePlaylistVideoIndex + 1}&autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;
    }
    if (selectedLecture) {
      return `https://www.youtube-nocookie.com/embed/${selectedLecture.videoId}?autoplay=0&rel=0&modestbranding=1`;
    }
    return '';
  }, [cinemaMode, activePlaylist, activePlaylistVideoIndex, currentEpisode, selectedLecture]);

  const handleSmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlFeedback(null);
    if (!inputUrl.trim()) return;

    // Check if it's a playlist URL (with or without video ID)
    const playlistId = extractYouTubePlaylistId(inputUrl);
    if (playlistId) {
      const pl = await addCustomYouTubePlaylist(inputUrl, customTitle || undefined, customCategory);
      if (pl) {
        setUrlFeedback({
          type: 'success',
          message: `Loaded YouTube playlist "${pl.title}" with all ${pl.videos.length} videos!`,
        });
        setCinemaMode('playlist');
        setInputUrl('');
        setCustomTitle('');
        setImportModalOpen(false);
        return;
      }
    }

    // Check if it's a single video URL
    const videoId = extractYouTubeVideoId(inputUrl);
    if (videoId) {
      const lecture = addCustomYouTubeLecture(inputUrl, customTitle || undefined);
      if (lecture) {
        setUrlFeedback({
          type: 'success',
          message: `Loaded YouTube video: ${lecture.title}`,
        });
        setCinemaMode('single');
        setInputUrl('');
        setCustomTitle('');
        setImportModalOpen(false);
        return;
      }
    }

    setUrlFeedback({
      type: 'error',
      message: 'Unrecognized link. Please provide a valid YouTube playlist (list=...) or video URL.',
    });
  };

  const handleSelectLecture = (lecture: YouTubeLecture) => {
    setSelectedLecture(lecture);
    setNotesText(lecture.notes || '');
    setNotesSaved(false);
  };

  const handleSaveNotes = () => {
    if (selectedLecture) {
      updateLectureNotes(selectedLecture.id, notesText);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }
  };

  const handleSyncPlaylist = async () => {
    if (!activePlaylist) return;
    setIsRefreshing(true);
    await refreshPlaylist(activePlaylist.playlistId);
    setIsRefreshing(false);
  };

  const handleExportNotes = () => {
    if (!activePlaylist) return;
    const cleanTitle = activePlaylist.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    let md = `# Study Notes: ${activePlaylist.title}\n\n`;
    md += `- **Channel:** ${activePlaylist.channel}\n`;
    md += `- **Domain:** ${activePlaylist.category}\n`;
    md += `- **Progress:** ${completedEpisodesCount} of ${totalEpisodesCount} Episodes (${playlistProgressPercent}%)\n`;
    md += `- **Date Exported:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## Active Session Scratchpad\n\n${notesText.trim() || '_No scratchpad notes jotted down yet._'}\n\n`;
    md += `## Complete Episode Syllabus & Checkmarks\n\n`;
    activePlaylist.videos.forEach((v, i) => {
      md += `${i + 1}. [${v.completed ? 'x' : ' '}] **${v.title}** (${v.duration || 'Video'})\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanTitle}_Notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLectures =
    categoryFilter === 'All'
      ? youtubeLectures
      : youtubeLectures.filter((l) => l.category === categoryFilter);

  return (
    <div className="h-full w-full min-h-0 flex flex-col bg-[#050816] text-slate-100 overflow-y-auto p-6 pb-24 lg:pb-12">
      {/* TOP HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-[#8B5CFF] to-[#35D9FF] flex items-center justify-center shadow-lg shadow-red-500/25">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                YouTube Cinema & Playlists
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-500/20 text-red-300 border border-red-500/30">
                100+ to 500+ Video Crawler
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Add any YouTube playlist (e.g. Apna College 144 C++ or 170+ Java) to watch every single episode with queue navigation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#8B5CFF] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Any Playlist</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('focus')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CFF]/15 border border-[#8B5CFF]/30 hover:bg-[#8B5CFF]/25 text-xs font-semibold text-[#35D9FF] transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4 text-[#FF7A59]" />
            <span>Focus Arena</span>
          </button>
        </div>
      </div>

      {/* VIEW TOGGLE & SMART SEARCH BAR */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/25 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              type="button"
              onClick={() => setCinemaMode('playlist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                cinemaMode === 'playlist'
                  ? 'bg-gradient-to-r from-red-600 to-[#8B5CFF] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListVideo className="w-3.5 h-3.5" />
              <span>Playlists & Full Queue ({savedPlaylists.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setCinemaMode('single')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                cinemaMode === 'single'
                  ? 'bg-gradient-to-r from-red-600 to-[#8B5CFF] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Single Lectures ({youtubeLectures.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Compass className="w-3.5 h-3.5 text-[#35D9FF]" />
            <span>Multi-Page Token Crawler: Extracts all 100+ to 500+ episodes</span>
          </div>
        </div>

        <form onSubmit={handleSmartSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Youtube className="absolute left-3.5 top-3 w-4 h-4 text-red-400" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setUrlFeedback(null);
              }}
              placeholder="Paste any YouTube playlist link (e.g. https://youtu.be/VTLCoHnyACE?list=PL...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500 font-mono"
            />
          </div>

          <div className="w-full sm:w-56">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Series title (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-[#8B5CFF] text-white placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={isFetchingPlaylist}
            className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-[#8B5CFF] hover:bg-[#7a48fc] text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isFetchingPlaylist ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crawling All Videos...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Load in Cinema</span>
              </>
            )}
          </button>
        </form>

        {urlFeedback && (
          <div
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
              urlFeedback.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {urlFeedback.message}
          </div>
        )}
      </div>

      {/* MAIN CINEMA THEATER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: THEATER DISPLAY */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* 16:9 Cinema Container */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black border border-[#8B5CFF]/30 shadow-2xl">
            {embedSrc ? (
              <iframe
                key={embedSrc}
                title={cinemaMode === 'playlist' ? activePlaylist?.title : selectedLecture?.title}
                src={embedSrc}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <Tv className="w-12 h-12 mb-3 text-slate-600" />
                <p>Select or import a playlist above to commence playback</p>
              </div>
            )}
          </div>

          {/* PLAYBACK QUEUE CONTROL BAR (For Playlist Mode) */}
          {cinemaMode === 'playlist' && activePlaylist && (
            <div className="p-4 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={playPrevInPlaylist}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous in Playlist"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={playNextInPlaylist}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#8B5CFF] hover:bg-[#7a48fc] text-white text-xs font-bold transition-colors cursor-pointer"
                  title="Next in Playlist Queue"
                >
                  <span>Next Video</span>
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => setAutoPlayNext((prev) => !prev)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    autoPlayNext
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Auto-Play Next: {autoPlayNext ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Progress Summary & Resume Indicator */}
              <div className="flex items-center gap-3">
                {/* Milestone Chips */}
                <div className="hidden sm:flex items-center gap-1">
                  {milestones.map((m) => {
                    const achieved = playlistProgressPercent >= m.percent;
                    return (
                      <span
                        key={m.percent}
                        title={m.label}
                        className={`text-xs px-2 py-0.5 rounded-full border font-mono transition-all ${
                          achieved
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                            : 'bg-white/5 border-white/5 text-slate-600 opacity-60'
                        }`}
                      >
                        {m.emoji} {m.percent}%
                      </span>
                    );
                  })}
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    <span>Episode {activePlaylistVideoIndex + 1} of {totalEpisodesCount}</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    {completedEpisodesCount} Watched ({playlistProgressPercent}%)
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#35D9FF]/30 flex items-center justify-center font-mono text-xs font-bold text-[#35D9FF]">
                  {playlistProgressPercent}%
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE MEDIA METADATA HEADER */}
          <div className="p-5 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-[#35D9FF] border border-white/10">
                  {cinemaMode === 'playlist' ? activePlaylist?.category : selectedLecture?.category}
                </span>
                <span className="text-xs text-slate-400">
                  {cinemaMode === 'playlist' ? activePlaylist?.channel : selectedLecture?.channel}
                </span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400 font-mono">
                  {cinemaMode === 'playlist'
                    ? `${activePlaylist?.videos.length || 0} Complete Episodes`
                    : selectedLecture?.duration}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                {cinemaMode === 'playlist'
                  ? currentEpisode?.title || activePlaylist?.title
                  : selectedLecture?.title}
              </h3>
              {cinemaMode === 'playlist' && activePlaylist?.description && (
                <p className="text-xs text-slate-400 mt-1 max-w-2xl line-clamp-2">
                  {activePlaylist.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {cinemaMode === 'playlist' && (
                <>
                  <button
                    type="button"
                    onClick={handleSyncPlaylist}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                    title="Check YouTube for new videos in this playlist"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportNotes}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CFF]/20 hover:bg-[#8B5CFF]/30 border border-[#8B5CFF]/30 text-xs text-[#35D9FF] transition-colors cursor-pointer"
                    title="Export all notes and progress as Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Notes</span>
                  </button>
                </>
              )}

              <a
                href={
                  cinemaMode === 'playlist'
                    ? activePlaylist?.url
                    : selectedLecture?.url
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* NOTES & SCRATCHPAD */}
          <div className="p-5 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Bookmark className="w-4 h-4 text-[#8B5CFF]" />
                <h4>Episode Scratchpad & Code Timestamps</h4>
              </div>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#8B5CFF] text-white text-xs font-semibold hover:bg-[#7a48fc] transition-colors cursor-pointer"
              >
                {notesSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </>
                ) : (
                  'Save Notes'
                )}
              </button>
            </div>
            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Record algorithmic proofs, key time complexities, and video timestamps (e.g. 14:20 Binary Search recurrence)..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF] font-mono leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: QUEUE & PLAYLIST SELECTOR */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {cinemaMode === 'playlist' ? (
            /* PLAYLIST QUEUE SIDEBAR */
            <div className="p-5 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <ListVideo className="w-4 h-4 text-[#35D9FF]" />
                  <h3>Active Playlist Queue</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {totalEpisodesCount} Videos Loaded
                </span>
              </div>

              {/* Choose Playlist Dropdown / Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Switch Playlist Series
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {savedPlaylists.map((pl) => {
                    const isCurrent =
                      activePlaylist?.id === pl.id || activePlaylist?.playlistId === pl.playlistId;
                    return (
                      <button
                        key={pl.id}
                        type="button"
                        onClick={() => setActivePlaylistById(pl.id)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isCurrent
                            ? 'bg-[#8B5CFF]/20 border-[#8B5CFF] text-white shadow-sm'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate">{pl.title}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {pl.channel} · {pl.videos.length} videos
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8B5CFF] text-white shrink-0">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              {/* SEARCH & FILTER INSIDE THE 100+ QUEUE */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={queueSearch}
                    onChange={(e) => setQueueSearch(e.target.value)}
                    placeholder="Search episode or #number (e.g. Recursion, #144)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF] font-sans"
                  />
                  {queueSearch && (
                    <button
                      type="button"
                      onClick={() => setQueueSearch('')}
                      className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOnlyUnwatched((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer border ${
                      onlyUnwatched
                        ? 'bg-[#8B5CFF]/30 border-[#8B5CFF] text-[#35D9FF]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Filter className="w-3 h-3" />
                    <span>Unwatched Only</span>
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
                    Showing {filteredQueueEpisodes.length} of {totalEpisodesCount}
                  </span>
                </div>
              </div>

              {/* Episode Queue List (Handles 100+ to 500+ videos smoothly) */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredQueueEpisodes.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No episodes found matching "{queueSearch}"
                  </div>
                ) : (
                  filteredQueueEpisodes.map(({ ep, originalIdx }) => {
                    const isPlaying = activePlaylistVideoIndex === originalIdx;
                    return (
                      <div
                        key={ep.id}
                        ref={isPlaying ? activeEpisodeRef : null}
                        className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                          isPlaying
                            ? 'bg-gradient-to-r from-[#8B5CFF]/30 to-[#35D9FF]/10 border-[#8B5CFF] shadow-md shadow-[#8B5CFF]/20'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {/* Checkbox toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            activePlaylist && toggleVideoCompletedInPlaylist(activePlaylist.id, ep.id)
                          }
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                            ep.completed
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : 'border-white/20 hover:border-[#8B5CFF]'
                          }`}
                          title={ep.completed ? 'Mark uncompleted' : 'Mark completed'}
                        >
                          {ep.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Title and selector */}
                        <button
                          type="button"
                          onClick={() => setActivePlaylistVideoIndex(originalIdx)}
                          className="flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono text-slate-400 shrink-0">
                              #{originalIdx + 1}
                            </span>
                            <span
                              className={`text-xs font-semibold truncate ${
                                isPlaying ? 'text-[#35D9FF]' : ep.completed ? 'text-slate-400 line-through' : 'text-white'
                              }`}
                            >
                              {ep.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-mono">{ep.duration || 'Video'}</span>
                            {isPlaying && (
                              <span className="text-emerald-400 font-mono flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Currently Playing
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Mark up to here bulk button */}
                        <button
                          type="button"
                          onClick={() =>
                            activePlaylist && markPlaylistUpToEpisodeWatched(activePlaylist.id, originalIdx)
                          }
                          className="p-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                          title={`Mark episodes 1 to ${originalIdx + 1} as watched`}
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* SINGLE LECTURES SIDEBAR */
            <div className="p-5 rounded-2xl bg-[#0B1228] border border-[#8B5CFF]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <BookOpen className="w-4 h-4 text-[#35D9FF]" />
                  <h3>Curated Single Lectures</h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {youtubeLectures.length} Total
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#8B5CFF] text-white font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Lecture Items List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredLectures.map((lecture) => {
                  const isSelected = selectedLecture?.id === lecture.id;
                  return (
                    <button
                      key={lecture.id}
                      type="button"
                      onClick={() => handleSelectLecture(lecture)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#8B5CFF]/20 border-[#8B5CFF] shadow-md shadow-[#8B5CFF]/20'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{lecture.title}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>{lecture.channel}</span>
                          <span>·</span>
                          <span className="font-mono">{lecture.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: IMPORT PLAYLIST */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0B1228] border border-[#8B5CFF]/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Youtube className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-base font-bold text-white">Import Complete YouTube Playlist</h3>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the link of any public YouTube playlist (including 100+ to 500+ videos). Our multi-page continuation crawler fetches all episodes, titles, and order automatically.
            </p>

            <form onSubmit={handleSmartSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">
                  YouTube Playlist Link or ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://youtu.be/VTLCoHnyACE?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">
                  Series Title (Optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Apna College Java Placement Course"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#8B5CFF]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 mb-1 block">
                  Domain Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050816] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#8B5CFF]"
                >
                  <option value="DSA & Algorithms">DSA & Algorithms</option>
                  <option value="Java & Placement DSA">Java & Placement DSA</option>
                  <option value="System Design">System Design</option>
                  <option value="Core CS">Core Computer Science</option>
                  <option value="Web Dev">Full Stack Web Development</option>
                  <option value="Cybersecurity">Cybersecurity & Networking</option>
                  <option value="DBMS">Database Management Systems</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFetchingPlaylist}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#8B5CFF] text-white text-xs font-bold shadow-md hover:opacity-95 cursor-pointer disabled:opacity-50"
                >
                  {isFetchingPlaylist ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Crawling All Videos...</span>
                    </>
                  ) : (
                    <>
                      <ListVideo className="w-4 h-4" />
                      <span>Import Full Playlist</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
