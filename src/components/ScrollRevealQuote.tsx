import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass } from 'lucide-react';

export const ScrollRevealQuote: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-y border-white/10 overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-arch-grid opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151c] border border-[#c5a880]/30 text-[11px] font-sans font-semibold text-[#c5a880] uppercase tracking-[0.2em]">
            <Compass className="w-3 h-3 text-[#c5a880]" />
            <span>THE PARADIGM SHIFT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
            ARCHITECTURE <br />
            <span className="text-white font-sans">
              IS{' '}
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal">
                Evolving.
              </span>
            </span>
          </h2>

          <p className="text-base sm:text-xl text-[#b5b5b5] font-normal leading-[1.7] max-w-2xl mx-auto">
            And so is the way we conceive, coordinate, visualize and construct it.
          </p>

          {/* Construction Dimension Marker Line */}
          <div className="pt-6 flex items-center justify-center gap-4 text-xs font-sans text-[#8e929b] tracking-[0.15em] uppercase">
            <span className="w-12 h-[1px] bg-white/20" />
            <span>METRIC: BIM · AI · SPATIAL</span>
            <span className="w-12 h-[1px] bg-white/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
