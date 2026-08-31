import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';

export const PersonalPhilosophy: React.FC = () => {
  return (
    <section className="relative py-32 sm:py-44 px-4 sm:px-6 lg:px-8 bg-[#06070a] border-t border-white/10 overflow-hidden text-center">
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-arch-grid opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151c] border border-white/10 text-[11px] font-sans font-semibold text-[#c5a880] uppercase tracking-[0.2em]">
            <Compass className="w-3 h-3 text-[#c5a880]" />
            <span>PERSONAL PHILOSOPHY</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-extrabold text-white tracking-tight leading-[0.95] select-none">
            KEEP LEARNING. <br />
            KEEP BUILDING. <br />
            <span className="inline-block text-white">
              KEEP{' '}
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal">
                Evolving.
              </span>
            </span>
          </h2>

          <div className="pt-6 flex flex-col items-center justify-center space-y-1.5 font-sans">
            <span className="text-sm font-bold text-white tracking-[0.18em] uppercase">
              AR. AHMED USMANI
            </span>
            <span className="text-xs text-[#a8a8a8] tracking-[0.12em] uppercase">
              Architect · BIM Specialist · AI Computational Designer
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
