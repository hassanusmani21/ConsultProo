import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CredentialStripProps {
  onViewExperience?: () => void;
}

export const CredentialStrip: React.FC<CredentialStripProps> = ({ onViewExperience }) => {
  const items = [
    'ARCHITECTURE',
    'INTERIOR',
    'COMPLETE EXECUTION',
    'VISUALIZATION',
    'AI COMPUTATIONAL DESIGN',
    'DIGITAL MASTERCLASSES',
    'UAE · INDIA · GLOBAL'
  ];

  return (
    <div className="relative py-4 bg-[#14161f] border-y border-white/10 overflow-hidden select-none">
      {/* Subtle fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#14161f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#14161f] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-hidden relative w-full items-center">
          <div className="flex w-max animate-marquee space-x-8 items-center text-[11px] font-sans font-semibold tracking-[0.2em] text-[#9a9da8] uppercase">
            {[...items, ...items, ...items].map((text, idx) => (
              <div key={idx} className="flex items-center space-x-8 whitespace-nowrap">
                <span className="hover:text-white transition-colors">{text}</span>
                <span className="text-[#bfa37c] text-base">·</span>
              </div>
            ))}
          </div>
        </div>

        {onViewExperience && (
          <button
            onClick={() => {
              soundManager.playClick();
              onViewExperience();
            }}
            className="hidden lg:inline-flex items-center gap-1.5 pl-6 whitespace-nowrap text-[11px] font-sans font-bold text-[#bfa37c] hover:text-white uppercase tracking-[0.16em] transition-colors z-20"
          >
            <span>EXPERIENCE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
