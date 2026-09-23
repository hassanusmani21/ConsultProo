import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { data } = useData();
  const section = data.sections.footer;
  const profile = data.profile;

  const handleNav = (sectionId: string) => {
    soundManager.playClick();
    onNavigate(sectionId);
  };

  const socials = [
    { label: 'YouTube', url: profile.youtube },
    { label: 'Instagram', url: profile.instagram },
    { label: 'LinkedIn', url: profile.linkedin },
    { label: 'X (Twitter)', url: 'https://x.com/ahmedusmani_arch' }
  ].filter((item) => item.url);

  if (section?.published === false) return null;

  return (
    <footer className="bg-[#0e1015] border-t border-white/10 text-[#9a9da8] font-sans text-xs pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand & Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-[#bfa37c]/30 bg-[#181a24] flex items-center justify-center text-[#bfa37c] font-sans font-bold text-xs">
                AU
              </div>
              <div>
                <span className="font-sans font-bold text-lg text-white tracking-tight">
                  {section.title}
                </span>
                <div className="text-[11px] text-[#bfa37c] tracking-wider uppercase font-semibold">
                  {section.subtitle}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links: Work · Shop · About · Consult */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-sans uppercase tracking-[0.14em]">
            <button onClick={() => handleNav('work')} className="text-[#9a9da8] hover:text-white transition-colors">
              Work
            </button>
            <span className="text-white/20">·</span>
            <button onClick={() => handleNav('shop')} className="text-[#9a9da8] hover:text-white transition-colors">
              Shop
            </button>
            <span className="text-white/20">·</span>
            <button onClick={() => handleNav('about')} className="text-[#9a9da8] hover:text-white transition-colors">
              About
            </button>
            <span className="text-white/20">·</span>
            <button onClick={() => handleNav('consult')} className="text-[#bfa37c] hover:text-[#d6be9c] transition-colors font-bold">
              Consult
            </button>
          </div>

          {/* Socials: YouTube · Instagram · LinkedIn · X */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
            {socials.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#181a24] border border-white/10 hover:border-[#bfa37c] hover:text-white transition-all text-[#9a9da8] flex items-center gap-1"
              >
                <span>{s.label}</span>
                <ArrowUpRight className="w-3 h-3 text-[#bfa37c]" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Metadata Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#9a9da8]">
          <div>
            {section.copyright}
          </div>
          <div className="flex items-center gap-3 text-[#9a9da8] text-[10px] uppercase tracking-wider">
            <span>COA INDIA LICENSED</span>
            <span>·</span>
            <span>AUTODESK CERTIFIED</span>
            <span>·</span>
            <span>DUBAI · INDIA · GLOBAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
