import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lock, Copy, Check, Terminal } from 'lucide-react';
import { FeaturedPromptCard } from '../data/featuredPromptsData';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';

interface FeaturedPromptsProps {
  onExploreAllPrompts: () => void;
  onSelectPrompt?: (prompt: FeaturedPromptCard) => void;
}

export const FeaturedPrompts: React.FC<FeaturedPromptsProps> = ({ 
  onExploreAllPrompts,
  onSelectPrompt
}) => {
  const { data } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const featuredPromptsList = data.featuredPrompts.filter((item: FeaturedPromptCard & { published?: boolean }) => item.published !== false);

  const handleCopy = (e: React.MouseEvent, prompt: FeaturedPromptCard) => {
    e.stopPropagation();
    if (prompt.badge === 'PREMIUM') {
      soundManager.playTick(600);
      onExploreAllPrompts();
      return;
    }
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopiedId(prompt.id);
    soundManager.playClick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="featured-prompts" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#c5a880] uppercase tracking-[0.2em] px-3 py-1 rounded bg-[#13151c] border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TESTED & PRODUCTION-READY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              PROMPTS <br />
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                I Actually Use.
              </span>
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onExploreAllPrompts();
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13151c] border border-white/15 text-white font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#191b24] hover:border-[#c5a880]/50 transition-all shadow-lg"
          >
            <span>EXPLORE ALL PROMPTS</span>
            <ArrowRight className="w-4 h-4 text-[#c5a880]" />
          </button>
        </div>

        {/* 3 Premium Graphical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPromptsList.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              onClick={() => {
                soundManager.playClick();
                if (onSelectPrompt) onSelectPrompt(card);
                else onExploreAllPrompts();
              }}
              className="group cursor-pointer rounded-2xl bg-[#13151c] border border-white/15 overflow-hidden hover:border-[#c5a880]/50 transition-all flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Architectural Imagery */}
                <div className="relative aspect-[16/11] overflow-hidden bg-[#0c0d12]">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded bg-[#0c0d12]/85 backdrop-blur-md border border-white/10 text-[10px] font-sans font-bold text-white uppercase tracking-wider">
                      {card.category}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider backdrop-blur-md ${
                        card.badge === 'FREE'
                          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                          : 'bg-[#c5a880]/25 border border-[#c5a880] text-[#c5a880]'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-sans font-bold text-white group-hover:text-[#c5a880] transition-colors leading-snug">
                    {card.title}
                  </h3>

                  {/* Prompt Syntax Preview Box */}
                  <div className="p-3.5 rounded-xl bg-[#090a0f] border border-white/10 space-y-1.5">
                    <div className="text-[10px] font-mono text-[#8e929b] uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[#c5a880]">
                        <Terminal className="w-3 h-3" />
                        PROMPT PREVIEW
                      </span>
                      <span>{card.engine.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs font-mono text-[#b5b5b5] italic leading-relaxed">
                      &ldquo;{card.previewPrompt}&rdquo;
                    </p>
                  </div>

                  {/* Material Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {card.materials.map((mat) => (
                      <span
                        key={mat}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] font-sans text-[#a8a8a8]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={(e) => handleCopy(e, card)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-all flex items-center gap-1.5 ${
                      card.badge === 'FREE'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-[#c5a880]/15 text-[#c5a880] hover:bg-[#c5a880]/25'
                    }`}
                  >
                    {card.badge === 'FREE' ? (
                      copiedId === card.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY PROMPT</span>
                        </>
                      )
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>UNLOCK MATRIX</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs font-sans font-bold text-[#8e929b] group-hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider">
                    <span>VIEW</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
