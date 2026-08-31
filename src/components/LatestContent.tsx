import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, Video, Copy, Check, X, Sparkles } from 'lucide-react';
import { latestContentList, LatestContentItem } from '../data/latestContentData';
import { soundManager } from '../utils/sound';

interface LatestContentProps {
  onSetCursorText?: (text?: string) => void;
}

export const LatestContent: React.FC<LatestContentProps> = ({ onSetCursorText }) => {
  const [selectedItem, setSelectedItem] = useState<LatestContentItem | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText('/imagine prompt: architectural photography of a raw brutalist concrete and warm cedar villa nestled in dunes, expansive glazing, minimalist reflecting pool, overcast soft northern light, architectural digest --ar 16:9 --v 6.1 --style raw');
    setCopiedPrompt(true);
    soundManager.playClick();
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <section id="latest-content" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0e1015] border-t border-white/10 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] bg-[#bfa37c]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#bfa37c] uppercase tracking-[0.2em] px-3.5 py-1 rounded-full bg-[#181a24] border border-white/10">
              <Video className="w-3.5 h-3.5 text-[#bfa37c]" />
              <span>MEDIA & WORKFLOW BREAKDOWNS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.0]">
              LATEST{' '}
              <span className="font-serif italic font-normal text-[#d6be9c] tracking-normal">
                CONTENT.
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#c4c6cf] max-w-md font-normal leading-relaxed">
            Actionable breakdowns on AI tools, prompt matrices, interior visualization, and Revit workflow efficiencies.
          </p>
        </div>

        {/* Graphical 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestContentList.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => {
                soundManager.playClick();
                setSelectedItem(item);
              }}
              onMouseEnter={() => onSetCursorText?.(item.type === 'video' ? 'WATCH' : 'VIEW')}
              onMouseLeave={() => onSetCursorText?.(undefined)}
              className="group cursor-pointer rounded-2xl bg-[#14161f] border border-white/10 overflow-hidden hover:border-[#bfa37c] transition-all flex flex-col justify-between shadow-xl hover:shadow-2xl"
            >
              <div>
                {/* Thumbnail with Overlay & Play / Tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0e1015]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14161f] via-transparent to-black/40" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#0e1015]/90 border border-white/15 text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">
                    {item.category}
                  </div>

                  {/* Platform Indicator */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-sans text-white/80">
                    {item.platform}
                  </div>

                  {/* Play Indicator if video */}
                  {item.type === 'video' && (
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#bfa37c] text-[#0e1015] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-2">
                  <div className="text-[10px] font-sans text-[#9a9da8] uppercase tracking-wider flex items-center justify-between">
                    <span>{item.date}</span>
                    <span>{item.readOrWatchTime}</span>
                  </div>

                  <h3 className="text-sm font-sans font-bold text-white group-hover:text-[#d6be9c] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#9a9da8] font-normal leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Bottom Card CTA */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-sans font-semibold text-[#bfa37c] group-hover:text-white transition-colors">
                  <span className="uppercase tracking-[0.14em]">
                    {item.type === 'video' ? 'WATCH BREAKDOWN' : item.type === 'prompt' ? 'VIEW PROMPT' : 'READ TUTORIAL'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
            <div className="fixed inset-0" onClick={() => setSelectedItem(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-2xl bg-[#14161f] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#bfa37c]/15 text-[#bfa37c] text-[10px] font-sans font-bold uppercase tracking-wider">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs font-sans text-[#9a9da8]">· {selectedItem.platform}</span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#0e1015] border border-white/10">
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#bfa37c] text-[#0e1015] flex items-center justify-center shadow-2xl">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-sans font-bold text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#c4c6cf] leading-relaxed">
                  {selectedItem.summary}
                </p>
              </div>

              {selectedItem.type === 'prompt' && (
                <div className="p-4 rounded-xl bg-[#0e1015] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-sans font-bold text-[#bfa37c] uppercase tracking-wider">
                    <span>PROMPT MATRIX SYNTAX</span>
                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-1 text-white hover:text-[#bfa37c]"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPrompt ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                  <p className="text-[#c4c6cf] font-mono text-xs select-all bg-[#181a24] p-3 rounded border border-white/5 leading-relaxed">
                    architectural photography of a raw brutalist concrete and warm cedar villa nestled in dunes, expansive glazing, minimalist reflecting pool, overcast soft northern light, architectural digest --ar 16:9 --v 6.1 --style raw
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-lg bg-white/10 text-white hover:bg-[#bfa37c] hover:text-[#0e1015] text-xs font-sans font-bold uppercase tracking-wider transition-all"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
