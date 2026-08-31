import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeroProps {
  onNavigateWork: () => void;
  onNavigateShop: () => void;
  onNavigateExplore?: () => void;
  onSetCursorText?: (text?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onNavigateWork, 
  onNavigateShop, 
  onNavigateExplore,
  onSetCursorText 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[92svh] sm:min-h-screen flex flex-col justify-between pt-20 sm:pt-28 pb-4 sm:pb-12 px-3 sm:px-6 lg:px-8 overflow-hidden bg-[#0e1015]"
    >
      {/* Cinematic Architectural Visual Canvas */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-8 bg-cover bg-center opacity-35 filter contrast-110 brightness-95"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop')`,
          }}
          animate={{
            x: mousePos.x * -10,
            y: mousePos.y * -10,
            scale: 1.02,
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 220, mass: 0.8 }}
        />

        {/* Ambient Architectural Dark Warm Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/80 to-[#0e1015]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1015] via-[#0e1015]/50 to-[#0e1015]" />
        {/* Warm Sunlight Beam Glow */}
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-[#bfa37c]/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Top Identity Meta Strip */}
      <div className="max-w-7xl mx-auto w-full pt-1 sm:pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 py-2 border-b border-white/10 text-[8px] sm:text-xs font-sans font-medium text-[#9a9da8] tracking-[0.12em] sm:tracking-[0.2em] uppercase">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-3">
            <span className="text-white font-bold tracking-[0.12em] sm:tracking-[0.18em]">AR. AHMED USMANI</span>
            <span className="text-white/20">|</span>
            <span className="text-[#bfa37c] font-semibold">ARCHITECT · INTERIOR · AI</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[#9a9da8] text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bfa37c]" />
            <span>GLOBAL ARCHITECTURAL STUDIO</span>
          </div>
        </div>
      </div>

      {/* Main Hero Visual Composition */}
      <div className="max-w-7xl mx-auto w-full my-auto py-4 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-end">
          {/* Main Cinematic Headline */}
          <div className="lg:col-span-8">
            {/* Monumental Headline: DESIGNING THE FUTURE. */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.25rem] min-[380px]:text-[2.55rem] sm:text-6xl md:text-7xl xl:text-[5.5rem] font-sans font-extrabold tracking-tight text-white leading-[0.96] select-none"
            >
              DESIGNING <br />
              THE <br />
              <span className="font-serif italic font-normal text-[#d6be9c] tracking-normal inline-block text-[1.05em]">
                FUTURE.
              </span>
            </motion.h1>
          </div>

          {/* Right Supporting Text & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-4 flex flex-col justify-end lg:pl-4"
          >
            <div className="relative border-l-0 pl-0 sm:border-l sm:border-white/10 sm:pl-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-6">
              <div className="absolute left-0 top-0 hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#bfa37c] sm:block lg:left-auto lg:right-0 lg:-translate-y-1/2 lg:translate-x-0" />

              <p className="max-w-[27rem] text-[11px] min-[380px]:text-xs sm:text-base text-[#d8dbe3] font-normal leading-[1.65] sm:leading-[1.75]">
                Architecture, bespoke interiors, AI generative workflows, and practical digital design resources for the contemporary practice.
              </p>

              {/* Action Buttons: EXPLORE WORK → and SHOP RESOURCES → */}
              <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigateWork();
                  }}
                  onMouseEnter={() => {
                    soundManager.playTick(950);
                    onSetCursorText?.('WORK');
                  }}
                  onMouseLeave={() => onSetCursorText?.(undefined)}
                  className="min-h-11 sm:min-h-15 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg bg-[#bfa37c] text-[#0e1015] font-sans font-bold text-[9px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] hover:bg-[#d6be9c] active:scale-95 transition-all flex items-center justify-center gap-2.5 sm:gap-3 shadow-xl shadow-[#bfa37c]/20"
                >
                  <span className="leading-tight text-center">EXPLORE WORK</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigateShop();
                  }}
                  onMouseEnter={() => {
                    soundManager.playTick(850);
                    onSetCursorText?.('SHOP');
                  }}
                  onMouseLeave={() => onSetCursorText?.(undefined)}
                  className="min-h-11 sm:min-h-15 w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg bg-[#181a24]/80 border border-white/15 text-white font-sans font-semibold text-[9px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.14em] hover:bg-[#202330] hover:border-[#bfa37c]/50 transition-all flex items-center justify-center gap-2.5 sm:gap-3"
                >
                  <span className="leading-tight text-center">SHOP RESOURCES</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-[#9a9da8]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Subtle Indicator */}
      <div className="max-w-7xl mx-auto w-full pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between gap-4 text-[10px] font-sans font-medium text-[#9a9da8] tracking-[0.18em] uppercase">
        <div className="hidden sm:flex items-center gap-4 text-xs overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="text-white font-semibold">IDEA</span>
          <span>→</span>
          <span className="text-[#bfa37c] font-semibold">PROMPT</span>
          <span>→</span>
          <span className="text-white font-semibold">AI</span>
          <span>→</span>
          <span className="text-[#bfa37c] font-semibold">ARCHITECTURE</span>
          <span>→</span>
          <span className="text-white font-semibold">BUILT REALITY</span>
        </div>

        <div className="flex sm:hidden w-full items-center justify-between text-[8px] tracking-[0.1em]">
          <span className="text-white font-semibold">IDEA</span>
          <span>→</span>
          <span className="text-[#bfa37c] font-semibold">AI</span>
          <span>→</span>
          <span className="text-white font-semibold">REALITY</span>
        </div>

        {onNavigateExplore && (
          <button
            onClick={onNavigateExplore}
            className="hidden sm:flex items-center gap-1.5 text-[#bfa37c] hover:text-white transition-colors"
          >
            <span>SCROLL</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        )}
      </div>
    </section>
  );
};
