import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, CheckCircle2, BookOpen, Share2 } from 'lucide-react';
import { Article } from '../types';
import { soundManager } from '../utils/sound';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/85 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border border-white/20 rounded-2xl shadow-2xl z-10 text-[#e8e9ed] no-scrollbar"
        >
          {/* Close Button */}
          <div className="sticky top-4 right-4 z-20 flex justify-end pr-4 pointer-events-none">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2.5 rounded-full bg-[#13151c]/90 border border-white/20 text-white hover:text-[#c5a880] transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Hero Banner */}
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#13151c] -mt-12">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-2.5 py-1 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-mono text-[#c5a880] uppercase tracking-wider">
                {article.category}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white mt-2">
                {article.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-[#8e929b] mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.date}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
                <span>·</span>
                <span>By Ar. Ahmed Usmani</span>
              </div>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-6 sm:p-10 space-y-8 max-w-3xl mx-auto">
            {/* Key Takeaways Box */}
            <div className="p-5 rounded-xl bg-[#13151c] border border-[#c5a880]/30 space-y-3">
              <h3 className="text-xs font-mono font-bold text-[#c5a880] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Key Strategic Takeaways
              </h3>
              <div className="space-y-2">
                {article.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#d4d4ce]">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative Paragraphs */}
            <div className="space-y-5 text-sm sm:text-base text-[#d4d4ce] leading-relaxed">
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Bottom Footer */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-[#8e929b]">
                Published in Ahmed Usmani Editorial Hub
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#13151c] border border-white/15 text-xs font-mono text-white hover:border-[#c5a880]"
              >
                Close Article
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
