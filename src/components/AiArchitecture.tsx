import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Layers, 
  Sparkles, 
  Sliders, 
  Lock, 
  Maximize2, 
  ExternalLink,
  Cpu,
  Compass,
  Building2,
  RefreshCw,
  Video,
  Grid,
  ChevronRight,
  Eye
} from 'lucide-react';
import { aiVideosList } from '../data/aiPromptsData';
import { useData } from '../data/DataContext';
import { AiCategory, AiPromptData } from '../types';
import { soundManager } from '../utils/sound';

interface AiArchitectureProps {
  onNavigateConsultation?: () => void;
  onSetCursorText?: (text?: string) => void;
}

const CATEGORIES: { id: 'ALL' | AiCategory; label: string }[] = [
  { id: 'ALL', label: 'All Disciplines' },
  { id: 'ARCHITECTURE', label: 'Architecture' },
  { id: 'INTERIOR DESIGN', label: 'Interior Design' },
  { id: 'RENOVATION', label: 'Renovation' },
  { id: 'EXTERIOR', label: 'Exterior' },
  { id: 'MATERIALS', label: 'Materials' },
  { id: 'LIGHTING', label: 'Lighting' },
  { id: 'VISUALIZATION', label: 'Visualization' }
];

const formatPrice = (price: string | number | undefined, currency = 'INR') => {
  const numericValue = Number(String(price ?? '').replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(numericValue)) return price || '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(numericValue);
};

export const AiArchitecture: React.FC<AiArchitectureProps> = ({ 
  onNavigateConsultation,
  onSetCursorText
}) => {
  const { data } = useData();
  const navigate = useNavigate();
  const section = data.sections.aiArchitecture;
  const aiPromptsLibrary = data.aiPrompts.filter((item: AiPromptData & { published?: boolean }) => item.published !== false);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AiCategory>('ALL');
  const [activePromptId, setActivePromptId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState<boolean>(false);
  const [selectedPromptModal, setSelectedPromptModal] = useState<AiPromptData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter prompts by category
  const filteredPrompts = selectedCategory === 'ALL' 
    ? aiPromptsLibrary 
    : aiPromptsLibrary.filter(p => p.category === selectedCategory);

  // Active featured prompt
  const activePrompt = aiPromptsLibrary.find((p: AiPromptData) => p.id === activePromptId) || filteredPrompts[0] || aiPromptsLibrary[0];

  // Match video or fallback to default
  const activeVideo = activePrompt ? aiVideosList.find(v => v.promptId === activePrompt.id) || aiVideosList[0] : aiVideosList[0];

  // When category changes, auto-select the first prompt in that category
  const handleCategorySelect = (cat: 'ALL' | AiCategory) => {
    soundManager.playTick(950);
    setSelectedCategory(cat);
    const matches = cat === 'ALL' ? aiPromptsLibrary : aiPromptsLibrary.filter(p => p.category === cat);
    if (matches.length > 0) {
      setActivePromptId(matches[0].id);
      setVideoError(false);
      setIsPlaying(true);
    }
  };

  // Select specific prompt
  const handleSelectPrompt = (prompt: AiPromptData) => {
    soundManager.playClick();
    setActivePromptId(prompt.id);
    setVideoError(false);
    setIsPlaying(true);
  };

  // Video play/pause toggle
  const togglePlayPause = () => {
    soundManager.playClick();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {
          setVideoError(true);
        });
        setIsPlaying(true);
      }
    }
  };

  // Copy prompt micro-interaction
  const handleCopyPrompt = (prompt: AiPromptData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (prompt.type === 'FREE') {
      navigator.clipboard.writeText(prompt.fullPrompt);
      setCopiedId(prompt.id);
      soundManager.playClick();
      setTimeout(() => {
        setCopiedId(null);
      }, 2200);
    } else {
      soundManager.playClick();
      navigate(`/checkout/ai-prompts/${prompt.id}`);
    }
  };

  // Auto-play control on prompt change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay policy or video not reachable
        });
      }
    }
  }, [activePromptId, isPlaying]);

  useEffect(() => {
    if (!activePrompt && aiPromptsLibrary[0]) {
      setActivePromptId(aiPromptsLibrary[0].id);
    }
  }, [activePrompt, aiPromptsLibrary]);

  if (section?.published === false || !activePrompt) return null;

  return (
    <section 
      id="ai-architecture" 
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0e1015] border-t border-white/10 overflow-hidden"
    >
      {/* 16. ARCHITECTURAL TECHNICAL GRAPHICAL BACKGROUND (Opacity 0.04 - 0.07) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <svg 
          className={`w-full h-full text-white transition-opacity duration-1000 ${isPlaying ? 'opacity-[0.06]' : 'opacity-[0.03]'}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="#bfa37c" />
            </pattern>
            <pattern id="archSubGrid" width="240" height="240" patternUnits="userSpaceOnUse">
              <rect width="240" height="240" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
              <path d="M 0 120 L 240 120 M 120 0 L 120 240" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)" />
          <rect width="100%" height="100%" fill="url(#archSubGrid)" />

          {/* Floor Plan Fragments & Parametric Curves */}
          <g className="text-white/40" stroke="currentColor" fill="none" strokeWidth="1">
            {/* Parametric Bezier curves */}
            <path d="M -100,200 C 300,50 600,450 1100,150 S 1600,500 2000,200" strokeWidth="0.75" strokeDasharray="6,4" />
            <path d="M -50,280 C 350,130 650,530 1150,230 S 1650,580 2050,280" strokeWidth="0.5" />
            
            {/* Dimension Lines & Coordinate Markers */}
            <line x1="80" y1="120" x2="380" y2="120" strokeWidth="1" />
            <line x1="80" y1="110" x2="80" y2="130" strokeWidth="1" />
            <line x1="380" y1="110" x2="380" y2="130" strokeWidth="1" />
            <text x="210" y="112" fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">
              LOD 350 / CONTROLNET-CANNY
            </text>

            <line x1="1200" y1="400" x2="1500" y2="400" strokeWidth="1" />
            <text x="1350" y="392" fontSize="9" fontFamily="monospace" fill="currentColor" textAnchor="middle">
              DIFFUSION LATENT MATRIX · 4K
            </text>
          </g>
        </svg>

        {/* Ambient Radial Spotlight */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#bfa37c]/8 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* ================================================== */}
        {/* 1. AI SECTION — HERO EXPERIENCE */}
        {/* ================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#bfa37c] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#181a24] border border-white/10">
              <Cpu className="w-3.5 h-3.5 text-[#bfa37c]" />
              <span>{section.eyebrow}</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-extrabold text-white tracking-tight leading-[0.98]">
              {section.title}
            </h2>

            <p className="text-sm sm:text-base text-[#c4c6cf] max-w-xl font-normal leading-relaxed pt-1">
              {section.subtitle}
            </p>
          </div>

          {/* Laboratory Status Badge */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#9a9da8] bg-[#14161f] px-4 py-2.5 rounded-xl border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium">LIVE COMPUTATIONAL LAB</span>
            <span className="text-white/20">|</span>
            <span>PROMPT / {activePrompt.code.split('/')[1] || '001'}</span>
          </div>
        </div>

        {/* ================================================== */}
        {/* 12. CATEGORY FILTERS (ARCHITECTURE + INTERIORS + ...) */}
        {/* ================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/10">
          <span className="text-[10px] font-sans font-bold text-[#8e929b] uppercase tracking-[0.16em] pr-2 shrink-0 hidden sm:inline">
            DISCIPLINE:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#c5a880] text-[#090a0f] font-bold shadow-md shadow-[#c5a880]/20'
                      : 'bg-[#13151c] text-[#8e929b] hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================== */}
        {/* 2, 3, 4, 5, 6, 7. CINEMATIC VIDEO & PROMPT CONNECTION */}
        {/* ================================================== */}
        <div className="rounded-2xl bg-[#13151c] border border-white/15 overflow-hidden shadow-2xl">
          {/* Top Architectural Annotation Strip */}
          <div className="px-5 py-3 border-b border-white/10 bg-[#0f1016] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-[#8e929b]">
            <div className="flex items-center gap-3">
              <span className="text-[#c5a880] font-bold">AI WORKFLOW / {activePrompt.code.split('/')[1]?.trim() || '001'}</span>
              <span className="text-white/20">|</span>
              <span className="text-white uppercase font-sans font-semibold tracking-wider">
                {activePrompt.category}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="hidden sm:inline">ENGINE: {activePrompt.parameters?.engine || 'MIDJOURNEY v6.1'}</span>
              <span className="text-white/20 hidden sm:inline">|</span>
              <span className={`px-2 py-0.5 rounded font-sans font-bold uppercase tracking-wider ${
                activePrompt.type === 'FREE' ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/30'
              }`}>
                {activePrompt.type} PROMPT
              </span>
            </div>
          </div>

          {/* Main Stage: Desktop Split (Video Left/Center + Prompt Panel Right) · Mobile Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Cinematic Video Frame (7 Cols on desktop) */}
            <div 
              className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] lg:min-h-[500px] bg-[#07080b] flex items-center justify-center overflow-hidden group border-b lg:border-b-0 lg:border-r border-white/10"
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
            >
              {/* Corner Crosshairs */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-white/30 z-20 select-none">+</div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-white/30 z-20 select-none">+</div>
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/30 z-20 select-none">+</div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30 z-20 select-none">+</div>

              {/* Video Element or AI_VIDEO_PLACEHOLDER Fallback */}
              {!videoError && activePrompt.videoUrl ? (
                <video
                  ref={videoRef}
                  src={activePrompt.videoUrl}
                  poster={activePrompt.resultImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover filter contrast-105 transition-opacity duration-700"
                />
              ) : (
                /* 19. AI_VIDEO_PLACEHOLDER COMPONENT */
                <div className="relative w-full h-full min-h-[360px] bg-[#090a0f] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  {/* Poster image background */}
                  <img
                    src={activePrompt.resultImage}
                    alt={activePrompt.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-xs"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/80 to-[#090a0f]/60" />
                  
                  <div className="relative z-10 space-y-3 max-w-sm">
                    <div className="w-12 h-12 rounded-2xl bg-[#13151c] border border-white/15 flex items-center justify-center mx-auto text-[#c5a880]">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-[#c5a880] uppercase tracking-[0.2em]">
                        AI_VIDEO_PLACEHOLDER
                      </div>
                      <div className="text-base font-sans font-bold text-white uppercase tracking-wider">
                        AI WORKFLOW VIDEO
                      </div>
                      <p className="text-xs text-[#8e929b]">
                        Cinematic workflow render in 4K resolution coming soon.
                      </p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
                      STATUS: HIGH-RES POSTER LOADED
                    </span>
                  </div>
                </div>
              )}

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f]/90 via-transparent to-transparent pointer-events-none" />

              {/* Play / Pause Minimal Controller */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="p-2.5 rounded-xl bg-[#090a0f]/85 hover:bg-[#c5a880] text-white hover:text-[#090a0f] border border-white/15 backdrop-blur-md transition-all shadow-lg active:scale-95"
                  title={isPlaying ? 'Pause Workflow Video' : 'Play Workflow Video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div className="px-3 py-1.5 rounded-xl bg-[#090a0f]/85 border border-white/15 backdrop-blur-md text-[10px] font-mono text-white/90">
                  <span>{isPlaying ? '● LIVE GENERATION' : '❚❚ PAUSED'}</span>
                </div>
              </div>

              {/* Bottom Right Annotation */}
              <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
                <div className="px-3 py-1.5 rounded-xl bg-[#090a0f]/85 border border-white/15 backdrop-blur-md text-[10px] font-sans text-[#b5b5b5]">
                  <span>4K LATENT DIFFUSION</span>
                </div>
              </div>
            </div>

            {/* 5. CONNECTED PROMPT PANEL (5 Cols on desktop, stacked on mobile) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#11131a]">
              <div className="space-y-5">
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#c5a880] tracking-[0.2em]">
                      {activePrompt.code}
                    </span>
                    <span className="text-[10px] font-sans uppercase text-[#8e929b] tracking-wider">
                      {activePrompt.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-bold text-white leading-snug">
                    {activePrompt.title}
                  </h3>
                </div>

                {/* 6 & 7. PROMPT PREVIEW BOX (Truncated with [••••] for Premium) */}
                <div className="p-4 rounded-xl bg-[#090a0f] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#8e929b]">
                    <span>PROMPT MATRIX SYNTAX</span>
                    <span className="text-[#c5a880] font-mono">{activePrompt.parameters?.aspectRatio || '--ar 16:9'}</span>
                  </div>

                  {activePrompt.type === 'FREE' ? (
                    <div className="p-3 rounded-lg bg-[#13151c] border border-white/5 font-mono text-xs text-[#e8e9ed] leading-relaxed select-all max-h-32 overflow-y-auto no-scrollbar">
                      &ldquo;{activePrompt.previewText}&rdquo;
                    </div>
                  ) : (
                    /* Premium Truncated Preview */
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-[#13151c] border border-white/5 font-mono text-xs text-[#e8e9ed] leading-relaxed">
                        &ldquo;{activePrompt.previewText.slice(0, 110)}...&rdquo;
                        <div className="mt-2 text-[11px] font-mono text-[#c5a880] tracking-widest select-none">
                          [••••••••••••••••••••••••••••••••••••••••••••]
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-sans text-[#8e929b]">
                        <Lock className="w-3 h-3 text-[#c5a880]" />
                        <span>Complete commercial prompt parameters unlocked on purchase</span>
                      </div>
                    </div>
                  )}

                  {/* Parameter Tags */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-sans text-[#8e929b]">
                    <div>
                      <span className="text-white/50 block">LIGHTING:</span>
                      <span className="text-white truncate block">{activePrompt.parameters?.lighting || 'Natural Daylight'}</span>
                    </div>
                    <div>
                      <span className="text-white/50 block">MATERIALS:</span>
                      <span className="text-white truncate block">{activePrompt.parameters?.materials || 'Travertine & Glass'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: 6. COPY FREE PROMPT vs 7. GET FULL PROMPT */}
              <div className="space-y-3 pt-2">
                {activePrompt.type === 'FREE' ? (
                  <button
                    onClick={(e) => handleCopyPrompt(activePrompt, e)}
                    className="w-full py-4 rounded-xl bg-[#c5a880] text-[#090a0f] font-sans font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#d8be96] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#c5a880]/15"
                  >
                    {copiedId === activePrompt.id ? (
                      <>
                        <Check className="w-4 h-4 text-[#090a0f]" />
                        <span>PROMPT COPIED ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>COPY FREE PROMPT</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleCopyPrompt(activePrompt, e)}
                    className="w-full py-4 rounded-xl bg-[#c5a880] text-[#090a0f] font-sans font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#d8be96] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#c5a880]/15"
                  >
                    <Lock className="w-4 h-4" />
                    <span>GET FULL PROMPT ({formatPrice(activePrompt.price || '29', activePrompt.currency)}) →</span>
                  </button>
                )}

                {/* Subtext info */}
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8e929b] px-1">
                  <span>FORMAT: MIDJOURNEY / SDXL</span>
                  <button
                    onClick={() => setSelectedPromptModal(activePrompt)}
                    className="text-[#c5a880] hover:underline flex items-center gap-1"
                  >
                    <span>INSPECT MATRIX</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full Prompt Inspection Modal */}
      <AnimatePresence>
        {selectedPromptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedPromptModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#13151c] border border-white/20 rounded-2xl p-6 sm:p-8 z-10 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#c5a880]">{selectedPromptModal.code}</span>
                  <span className="text-white/20">|</span>
                  <span className="text-xs font-sans text-white uppercase font-bold">{selectedPromptModal.category}</span>
                </div>
                <button
                  onClick={() => setSelectedPromptModal(null)}
                  className="text-[#8e929b] hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#090a0f] border border-white/10">
                <img
                  src={selectedPromptModal.resultImage}
                  alt={selectedPromptModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-sans font-bold text-white">{selectedPromptModal.title}</h3>
                
                <div className="p-4 rounded-xl bg-[#090a0f] border border-white/10 space-y-2">
                  <div className="text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-wider">
                    COMPLETE PROMPT MATRIX
                  </div>
                  {selectedPromptModal.type === 'FREE' ? (
                    <p className="text-xs font-mono text-[#e8e9ed] bg-[#13151c] p-3 rounded select-all leading-relaxed">
                      {selectedPromptModal.fullPrompt}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-[#e8e9ed] bg-[#13151c] p-3 rounded leading-relaxed">
                        {selectedPromptModal.previewText}
                      </p>
                      <div className="text-xs text-[#c5a880] font-sans">
                        Full prompt matrix available upon purchase ({formatPrice(selectedPromptModal.price || '29', selectedPromptModal.currency)}).
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedPromptModal(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-sans text-white uppercase tracking-wider"
                >
                  Close
                </button>
                {selectedPromptModal.type === 'FREE' ? (
                  <button
                    onClick={(e) => {
                      handleCopyPrompt(selectedPromptModal, e);
                    }}
                    className="px-5 py-2 rounded-lg bg-[#c5a880] text-[#090a0f] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#d8be96] flex items-center gap-1.5"
                  >
                    {copiedId === selectedPromptModal.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedPromptModal.id ? 'COPIED' : 'COPY PROMPT'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/checkout/ai-prompts/${selectedPromptModal.id}`)}
                    className="px-5 py-2 rounded-lg bg-[#c5a880] text-[#090a0f] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#d8be96] flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>BUY PROMPT ({formatPrice(selectedPromptModal.price || '29', selectedPromptModal.currency)})</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
