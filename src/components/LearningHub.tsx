import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Clock, ArrowUpRight, ChevronRight, Compass } from 'lucide-react';
import { learningHubArticles } from '../data/learningHubData';
import { Article } from '../types';
import { ArticleModal } from './ArticleModal';
import { soundManager } from '../utils/sound';

interface LearningHubProps {
  onSetCursorText: (text?: string) => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({ onSetCursorText }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleOpenArticle = (art: Article) => {
    soundManager.playClick();
    setSelectedArticle(art);
  };

  return (
    <section id="learning" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0c0d12] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
              09 / KNOWLEDGE & INSIGHTS
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              FOR ARCHITECTS <br />
              WHO WANT TO <br />
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                Keep Evolving.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#b5b5b5] max-w-md font-normal leading-[1.65]">
            Editorial breakdowns, technical field guides, and strategic perspectives on the intersection of architecture, BIM standards, and artificial intelligence.
          </p>
        </div>

        {/* Magazine-Style Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {learningHubArticles.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => handleOpenArticle(art)}
              onMouseEnter={() => onSetCursorText('READ')}
              onMouseLeave={() => onSetCursorText(undefined)}
              className="group p-6 rounded-2xl bg-[#13151c] border border-white/15 hover:border-[#c5a880]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#090a0f] border border-white/10">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-sans font-semibold text-[#c5a880] uppercase tracking-wider">
                    {art.category}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-sans font-medium text-[#8e929b] tracking-wider uppercase">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {art.readTime}
                  </span>
                  <span>·</span>
                  <span>{art.date}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-sans font-bold text-white group-hover:text-[#c5a880] transition-colors leading-snug tracking-tight">
                  {art.title}
                </h3>

                <p className="text-xs text-[#8e929b] leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#c5a880] font-semibold">
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-[#8e929b]">BY AR. AHMED USMANI</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </section>
  );
};
