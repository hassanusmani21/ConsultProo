import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Home, 
  ArrowRight, 
  Check, 
  Copy,
  Sparkles, 
  Lock, 
  Download, 
  X, 
  Layers, 
  Maximize2,
  FileText,
  Compass,
  Terminal
} from 'lucide-react';
import { ebooksList } from '../data/ebooksData';
import { villaPlans } from '../data/villaPlansData';
import { aiPromptsLibrary } from '../data/aiPromptsData';
import { EbookProduct, VillaPlan, AiPromptData } from '../types';
import { soundManager } from '../utils/sound';

interface ShopSectionProps {
  onSetCursorText?: (text?: string) => void;
  onNavigateConsult?: () => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({ onSetCursorText, onNavigateConsult }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'ebooks' | 'plans' | 'prompts'>('all');
  const [selectedEbook, setSelectedEbook] = useState<EbookProduct | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<VillaPlan | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<AiPromptData | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [selectedPlotSize, setSelectedPlotSize] = useState<string>('');
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  const handleOpenEbook = (ebook: EbookProduct) => {
    soundManager.playClick();
    setSelectedEbook(ebook);
  };

  const handleOpenPlan = (plan: VillaPlan) => {
    soundManager.playClick();
    setSelectedPlan(plan);
    setSelectedPlotSize(plan.plotSizes[0] || '');
  };

  const handleOpenPrompt = (prompt: AiPromptData) => {
    soundManager.playClick();
    setSelectedPrompt(prompt);
  };

  const handleCopyPrompt = (prompt: AiPromptData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (prompt.type !== 'FREE') {
      handleOpenPrompt(prompt);
      return;
    }

    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopiedPromptId(prompt.id);
    soundManager.playClick();
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleSimulatePurchase = (productTitle: string) => {
    soundManager.playClick();
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setSelectedEbook(null);
      setSelectedPlan(null);
    }, 2000);
  };

  return (
    <section 
      id="shop" 
      className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f4ef] text-[#12141a] border-t border-[#12141a]/10 overflow-hidden bg-light-grid"
    >
      {/* Ambient Warm Stone Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#bfa37c]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#ebe7df] border border-[#bfa37c]/30">
              <Compass className="w-3.5 h-3.5 text-[#9e825d]" />
              <span>DIGITAL PRODUCTS & READY DRAWINGS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-[#12141a] tracking-tight leading-[1.0]">
              STUDIO{' '}
              <span className="font-serif italic font-normal text-[#9e825d] tracking-normal">
                SHOP.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4a4d57] font-normal leading-relaxed max-w-xl">
              Practical guides, structured AI frameworks, and ready-to-build architectural villa drawing sets.
            </p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="grid w-full max-w-full grid-cols-4 items-center gap-1 p-1 rounded-xl bg-[#ebe7df] border border-[#12141a]/10 md:w-auto md:flex md:gap-1.5 md:p-1.5">
            <button
              onClick={() => {
                soundManager.playTick(900);
                setActiveCategory('all');
              }}
              className={`min-w-0 px-1.5 py-2 rounded-lg text-[8px] sm:text-xs font-sans uppercase tracking-[0.06em] sm:tracking-[0.12em] transition-all md:shrink-0 md:px-4 ${
                activeCategory === 'all'
                  ? 'bg-[#12141a] text-[#ffffff] font-bold shadow-md'
                  : 'text-[#4a4d57] hover:text-[#12141a]'
              }`}
            >
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick(900);
                setActiveCategory('ebooks');
              }}
              className={`min-w-0 px-1.5 py-2 rounded-lg text-[8px] sm:text-xs font-sans uppercase tracking-[0.06em] sm:tracking-[0.12em] transition-all flex items-center justify-center gap-1 md:shrink-0 md:px-4 md:gap-1.5 ${
                activeCategory === 'ebooks'
                  ? 'bg-[#12141a] text-[#ffffff] font-bold shadow-md'
                  : 'text-[#4a4d57] hover:text-[#12141a]'
              }`}
            >
              <BookOpen className="hidden w-3.5 h-3.5 sm:block" />
              <span className="hidden sm:inline">Ebooks & Guides</span>
              <span className="sm:hidden">Ebooks</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick(900);
                setActiveCategory('prompts');
              }}
              className={`min-w-0 px-1.5 py-2 rounded-lg text-[8px] sm:text-xs font-sans uppercase tracking-[0.06em] sm:tracking-[0.12em] transition-all flex items-center justify-center gap-1 md:shrink-0 md:px-4 md:gap-1.5 ${
                activeCategory === 'prompts'
                  ? 'bg-[#12141a] text-[#ffffff] font-bold shadow-md'
                  : 'text-[#4a4d57] hover:text-[#12141a]'
              }`}
            >
              <Sparkles className="hidden w-3.5 h-3.5 sm:block" />
              <span className="hidden sm:inline">Prompt Library</span>
              <span className="sm:hidden">Prompts</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick(900);
                setActiveCategory('plans');
              }}
              className={`min-w-0 px-1.5 py-2 rounded-lg text-[8px] sm:text-xs font-sans uppercase tracking-[0.06em] sm:tracking-[0.12em] transition-all flex items-center justify-center gap-1 md:shrink-0 md:px-4 md:gap-1.5 ${
                activeCategory === 'plans'
                  ? 'bg-[#12141a] text-[#ffffff] font-bold shadow-md'
                  : 'text-[#4a4d57] hover:text-[#12141a]'
              }`}
            >
              <Home className="hidden w-3.5 h-3.5 sm:block" />
              <span className="hidden sm:inline">Ready Villa Plans</span>
              <span className="sm:hidden">Plans</span>
            </button>
          </div>
        </div>

        {/* ================= CATEGORY 1: EBOOKS & GUIDES ================= */}
        {(activeCategory === 'all' || activeCategory === 'ebooks') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#12141a]/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#12141a] tracking-[0.15em] uppercase">
                <BookOpen className="w-4 h-4 text-[#9e825d]" />
                <span>EBOOKS & ARCHITECTURAL GUIDES</span>
              </div>
              <span className="text-[11px] font-sans text-[#747783] font-medium">Instant PDF + Template Downloads</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ebooksList.map((ebook) => (
                <div
                  key={ebook.id}
                  onClick={() => handleOpenEbook(ebook)}
                  onMouseEnter={() => onSetCursorText?.('VIEW')}
                  onMouseLeave={() => onSetCursorText?.(undefined)}
                  className="group rounded-2xl bg-[#ffffff] border border-[#12141a]/10 hover:border-[#bfa37c] p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Book Cover Presentation Board */}
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#ebe7df] border border-[#12141a]/10">
                      <img
                        src={ebook.coverImage}
                        alt={ebook.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141a]/80 via-transparent to-transparent opacity-75" />
                      
                      {ebook.badge && (
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#ffffff]/95 border border-[#12141a]/10 text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-wider shadow-sm">
                          {ebook.badge}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-[10px] font-sans font-bold text-[#f5f4ef] uppercase tracking-wider">
                          {ebook.pagesCount}
                        </div>
                      </div>
                    </div>

                    {/* Title & Short Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-sans font-bold text-[#12141a] group-hover:text-[#9e825d] transition-colors leading-snug">
                        {ebook.title}
                      </h3>
                      <p className="text-xs font-sans text-[#4a4d57] leading-relaxed line-clamp-2">
                        {ebook.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-4 mt-4 border-t border-[#12141a]/10 flex items-center justify-between">
                    <span className="text-lg font-sans font-extrabold text-[#12141a]">
                      {ebook.price}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEbook(ebook);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f2eee6] group-hover:bg-[#12141a] text-[#12141a] group-hover:text-[#ffffff] text-[11px] sm:text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center gap-1"
                    >
                      <span>VIEW DETAILS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CATEGORY 2: PROMPT LIBRARY ================= */}
        {activeCategory === 'prompts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#12141a]/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#12141a] tracking-[0.15em] uppercase">
                <Sparkles className="w-4 h-4 text-[#9e825d]" />
                <span>CURATED ARCHITECTURAL PROMPT LIBRARY</span>
              </div>
              <span className="text-[11px] font-sans text-[#747783] font-medium">
                {aiPromptsLibrary.length} Midjourney / SDXL prompt matrices
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {aiPromptsLibrary.map((prompt) => {
                const isCopied = copiedPromptId === prompt.id;

                return (
                  <div
                    key={prompt.id}
                    onClick={() => handleOpenPrompt(prompt)}
                    onMouseEnter={() => onSetCursorText?.(prompt.type === 'FREE' ? 'COPY' : 'VIEW')}
                    onMouseLeave={() => onSetCursorText?.(undefined)}
                    className="group rounded-xl bg-[#ffffff] border border-[#12141a]/10 hover:border-[#bfa37c] overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 flex flex-col"
                  >
                    <div className="relative aspect-[16/10] bg-[#ebe7df] overflow-hidden">
                      <img
                        src={prompt.resultImage}
                        alt={prompt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141a]/75 via-transparent to-[#12141a]/10" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#ffffff]/95 border border-[#12141a]/10 text-[10px] font-mono font-bold text-[#9e825d] shadow-sm">
                        {prompt.code}
                      </div>
                      <div
                        className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider border ${
                          prompt.type === 'FREE'
                            ? 'bg-emerald-50/95 text-emerald-700 border-emerald-200'
                            : 'bg-[#f2eee6]/95 text-[#9e825d] border-[#bfa37c]/40'
                        }`}
                      >
                        {prompt.type}
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-sans font-bold text-[#747783] uppercase tracking-wider truncate">
                          {prompt.category}
                        </div>
                        <h3 className="text-sm font-sans font-bold text-[#12141a] group-hover:text-[#9e825d] transition-colors leading-snug line-clamp-2">
                          {prompt.title}
                        </h3>
                        <p className="text-xs font-sans text-[#4a4d57] leading-relaxed line-clamp-2">
                          {prompt.previewText}
                        </p>
                      </div>

                      <div className="mt-auto p-3 rounded-lg bg-[#faf8f5] border border-[#12141a]/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#747783]">
                          <span className="flex items-center gap-1 text-[#9e825d]">
                            <Terminal className="w-3 h-3" />
                            Matrix
                          </span>
                          <span>{prompt.parameters?.aspectRatio || '16:9'}</span>
                        </div>
                        <div className="text-[11px] font-mono text-[#4a4d57] leading-relaxed line-clamp-2">
                          {prompt.parameters?.engine || 'Midjourney / SDXL'}
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <button
                        onClick={(e) => handleCopyPrompt(prompt, e)}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                          prompt.type === 'FREE'
                            ? 'bg-[#f2eee6] text-[#12141a] hover:bg-[#12141a] hover:text-[#ffffff]'
                            : 'bg-[#12141a] text-[#ffffff] hover:bg-[#bfa37c] hover:text-[#12141a]'
                        }`}
                      >
                        {prompt.type === 'FREE' ? (
                          isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Prompt</span>
                            </>
                          )
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>View Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= CATEGORY 2: READY VILLA PLANS ================= */}
        {(activeCategory === 'all' || activeCategory === 'plans') && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-[#12141a]/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#12141a] tracking-[0.15em] uppercase">
                <Home className="w-4 h-4 text-[#9e825d]" />
                <span>READY VILLA PLANS & ARCHITECTURAL DRAWINGS</span>
              </div>
              <span className="text-[11px] font-sans text-[#747783] font-medium">AutoCAD DWG + Dimensioned PDF Sets</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {villaPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handleOpenPlan(plan)}
                  onMouseEnter={() => onSetCursorText?.('VIEW PLAN')}
                  onMouseLeave={() => onSetCursorText?.(undefined)}
                  className="group rounded-2xl bg-[#ffffff] border border-[#12141a]/10 hover:border-[#bfa37c] p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Render Image Exhibition Board Frame */}
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#ebe7df] border border-[#12141a]/10">
                      <img
                        src={plan.previewImage}
                        alt={plan.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141a]/85 via-transparent to-transparent opacity-85" />
                      
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#ffffff]/95 border border-[#12141a]/10 text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-wider shadow-sm">
                        {plan.planCode}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-sans font-semibold text-white">
                        <span>{plan.areaSqFt}</span>
                        <span>{plan.levels} · {plan.bedrooms} BEDS</span>
                      </div>
                    </div>

                    {/* Title & Plot Sizes Available */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-sans font-bold text-[#12141a] group-hover:text-[#9e825d] transition-colors leading-snug">
                        {plan.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-sans text-[#747783] uppercase tracking-wider font-bold mr-1">Plots:</span>
                        {plan.plotSizes.map((size) => (
                          <span
                            key={size}
                            className="px-2 py-0.5 rounded bg-[#f2eee6] border border-[#12141a]/10 text-[10px] font-sans text-[#12141a] font-medium"
                          >
                            {size}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs font-sans text-[#4a4d57] leading-relaxed line-clamp-2">
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & View Plan Button */}
                  <div className="pt-4 mt-4 border-t border-[#12141a]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-sans text-[#747783] block">Full Drawing Set</span>
                      <span className="text-lg font-sans font-extrabold text-[#12141a]">
                        {plan.price}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPlan(plan);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#f2eee6] group-hover:bg-[#12141a] text-[#12141a] group-hover:text-[#ffffff] text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>VIEW PLAN</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: EBOOK PRODUCT DETAILS ================= */}
      <AnimatePresence>
        {selectedEbook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedEbook(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-[#ffffff] text-[#12141a] border border-[#12141a]/15 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#12141a]/10">
                <div className="text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em]">
                  DIGITAL PUBLICATION · {selectedEbook.format}
                </div>
                <button
                  onClick={() => setSelectedEbook(null)}
                  className="p-2 rounded-full bg-[#f2eee6] hover:bg-[#ebe7df] text-[#12141a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden bg-[#ebe7df] border border-[#12141a]/10 shadow-md">
                  <img
                    src={selectedEbook.coverImage}
                    alt={selectedEbook.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-2xl font-sans font-bold text-[#12141a]">
                      {selectedEbook.title}
                    </h3>
                    <p className="text-xs font-sans text-[#9e825d] font-semibold mt-1">
                      {selectedEbook.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-[#4a4d57] leading-relaxed">
                    {selectedEbook.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] font-sans font-bold text-[#12141a] uppercase tracking-wider">
                      What is Included:
                    </div>
                    {selectedEbook.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-sans text-[#12141a]">
                        <Check className="w-3.5 h-3.5 text-[#9e825d] shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {selectedEbook.sampleChapters && (
                    <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#12141a]/10 space-y-1.5 text-xs font-sans">
                      <div className="text-[10px] font-bold text-[#747783] uppercase tracking-wider">
                        Curriculum Outline:
                      </div>
                      {selectedEbook.sampleChapters.map((ch, i) => (
                        <div key={i} className="text-[#4a4d57] text-[11px] truncate">
                          {ch}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Footer */}
              <div className="pt-4 border-t border-[#12141a]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans text-[#747783] uppercase tracking-wider block">One-time Investment</span>
                  <span className="text-2xl font-sans font-extrabold text-[#12141a]">{selectedEbook.price}</span>
                </div>

                <button
                  onClick={() => handleSimulatePurchase(selectedEbook.title)}
                  className="px-6 py-3 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#bfa37c] hover:text-[#12141a] active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                >
                  {purchaseSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Instant Access Unlocked!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>BUY NOW · INSTANT DOWNLOAD</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: PROMPT MATRIX DETAILS ================= */}
      <AnimatePresence>
        {selectedPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedPrompt(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl bg-[#ffffff] text-[#12141a] border border-[#12141a]/15 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#12141a]/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e825d]">{selectedPrompt.code}</span>
                  <span className="text-[#12141a]/20">|</span>
                  <span className="text-xs font-sans text-[#4a4d57] uppercase font-bold">{selectedPrompt.category}</span>
                </div>
                <button
                  onClick={() => setSelectedPrompt(null)}
                  className="p-2 rounded-full bg-[#f2eee6] hover:bg-[#ebe7df] text-[#12141a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-5 aspect-[16/12] rounded-xl overflow-hidden bg-[#ebe7df] border border-[#12141a]/10 shadow-md">
                  <img
                    src={selectedPrompt.resultImage}
                    alt={selectedPrompt.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-2xl font-sans font-bold text-[#12141a]">
                      {selectedPrompt.title}
                    </h3>
                    <p className="text-xs font-sans text-[#747783] font-medium mt-1">
                      {selectedPrompt.workflowStep}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#12141a]/10">
                      <span className="block text-[#747783] uppercase tracking-wider font-bold">Engine</span>
                      <span className="block text-[#12141a] mt-1">{selectedPrompt.parameters?.engine || 'Midjourney / SDXL'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#faf8f5] border border-[#12141a]/10">
                      <span className="block text-[#747783] uppercase tracking-wider font-bold">Aspect</span>
                      <span className="block text-[#12141a] mt-1">{selectedPrompt.parameters?.aspectRatio || '16:9'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#12141a]/10 space-y-2">
                    <div className="text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-wider">
                      Prompt Matrix Syntax
                    </div>
                    <p className="text-[#4a4d57] font-mono text-xs select-all bg-[#ffffff] p-3 rounded border border-[#12141a]/10 leading-relaxed max-h-36 overflow-y-auto no-scrollbar">
                      {selectedPrompt.type === 'FREE'
                        ? selectedPrompt.fullPrompt
                        : `${selectedPrompt.previewText} ... [premium parameters locked]`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#12141a]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-sans text-[#747783] uppercase tracking-wider block">
                    {selectedPrompt.type === 'FREE' ? 'Free Prompt' : 'Premium Prompt Matrix'}
                  </span>
                  <span className="text-2xl font-sans font-extrabold text-[#12141a]">
                    {selectedPrompt.type === 'FREE' ? '$0' : selectedPrompt.price || '$29'}
                  </span>
                </div>

                {selectedPrompt.type === 'FREE' ? (
                  <button
                    onClick={(e) => handleCopyPrompt(selectedPrompt, e)}
                    className="px-6 py-3 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#bfa37c] hover:text-[#12141a] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    {copiedPromptId === selectedPrompt.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Prompt Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                ) : (
                  <a
                    href={selectedPrompt.purchaseUrl || 'https://ahmedusmani.gumroad.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#bfa37c] hover:text-[#12141a] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Buy Prompt</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: VILLA PLAN DETAILS & LOCKED DRAWINGS ================= */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedPlan(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl bg-[#ffffff] text-[#12141a] border border-[#12141a]/15 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#12141a]/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#f2eee6] border border-[#bfa37c]/40 text-[#9e825d] text-[10px] font-sans font-bold uppercase tracking-wider">
                    {selectedPlan.planCode}
                  </span>
                  <span className="text-xs font-sans text-[#747783] font-medium">ARCHITECTURAL WORKING DRAWING SET</span>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 rounded-full bg-[#f2eee6] hover:bg-[#ebe7df] text-[#12141a]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Details & Plot Size Selector */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-sans font-bold text-[#12141a]">
                      {selectedPlan.title}
                    </h3>
                    <p className="text-xs font-sans text-[#747783] mt-0.5 font-medium">
                      {selectedPlan.style} · {selectedPlan.areaSqFt} · {selectedPlan.levels} ({selectedPlan.bedrooms} Bedrooms, {selectedPlan.bathrooms} Bathrooms)
                    </p>
                  </div>

                  {/* Plot Size Selection */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans text-[#747783] uppercase tracking-wider block font-bold">
                      Select Your Plot Dimension:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {selectedPlan.plotSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            soundManager.playTick(900);
                            setSelectedPlotSize(size);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all ${
                            selectedPlotSize === size
                              ? 'bg-[#12141a] text-[#ffffff]'
                              : 'bg-[#f2eee6] text-[#12141a] hover:bg-[#ebe7df]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-sans text-[#4a4d57] leading-relaxed">
                  {selectedPlan.description}
                </p>
              </div>

              {/* Locked Architectural Drawing Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#0e1015] border border-[#12141a]/15">
                <img
                  src={selectedPlan.floorPlanPreview}
                  alt={selectedPlan.title}
                  className="w-full h-full object-cover filter blur-[2px] opacity-40 scale-105"
                />
                
                {/* Blueprint grid overlay & Locked Badge */}
                <div className="absolute inset-0 bg-[#0e1015]/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#181a24] border border-[#bfa37c]/50 flex items-center justify-center text-[#bfa37c] shadow-xl">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                      HIGH-RESOLUTION CAD & PDF DRAWINGS LOCKED
                    </div>
                    <p className="text-xs font-sans text-[#c4c6cf] max-w-md mt-1">
                      Purchase the drawing package to unlock original editable AutoCAD .DWG files, scaled printable PDF sheets, and full municipal submission drawings for plot size: <span className="text-[#bfa37c] font-bold">{selectedPlotSize}</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* What is Included Checklist */}
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#12141a]/10 space-y-2">
                <div className="text-[11px] font-sans font-bold text-[#12141a] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#9e825d]" />
                  <span>PACKAGE INCLUSIONS (INSTANT ZIP DOWNLOAD)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-[#4a4d57]">
                  {selectedPlan.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#9e825d] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Footer */}
              <div className="pt-4 border-t border-[#12141a]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-sans text-[#747783] uppercase tracking-wider block">Full Architecture Package</span>
                  <span className="text-2xl font-sans font-extrabold text-[#12141a]">{selectedPlan.price}</span>
                </div>

                <button
                  onClick={() => handleSimulatePurchase(selectedPlan.title)}
                  className="px-6 py-3 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#bfa37c] hover:text-[#12141a] active:scale-95 transition-all flex items-center gap-2 shadow-xl"
                >
                  {purchaseSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>CAD Package Download Ready!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>UNLOCK FULL DRAWING SET</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
