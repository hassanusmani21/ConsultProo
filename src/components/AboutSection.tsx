import React from 'react';
import { motion } from 'motion/react';
import { Award, Layers, Cpu, Compass, CheckCircle2, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';
import portraitImg from '../assets/images/regenerated_image_1787571034459.jpg';

interface AboutSectionProps {
  onNavigateConsult?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigateConsult }) => {
  const { data } = useData();
  const section = data.sections.about;
  const profile = data.profile;

  if (section?.published === false) return null;

  return (
    <section 
      id="about" 
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] text-[#12141a] border-t border-[#12141a]/10 overflow-hidden bg-light-grid"
    >
      {/* Ambient Warm Stone Highlight */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e7e2d7]/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-10 sm:space-y-14">
        {/* Section Header with Editorial Emphasis */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#f2eee6] border border-[#bfa37c]/30">
            <Compass className="w-3.5 h-3.5 text-[#9e825d]" />
            <span>{section.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-[#12141a] tracking-tight leading-[1.0]">
            {/* ABOUT{' '} */}
            <span className="font-serif italic font-normal text-[#9e825d] tracking-normal">
              {section.title}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#4a4d57] font-serif italic max-w-xl">
            "{section.subtitle}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Portrait with Architectural Board Framing */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-[#ffffff] border border-[#12141a]/10 p-2.5 shadow-xl">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#f2eee6]">
                <img
                  src={profile.photoUrl || portraitImg}
                  alt={profile.name}
                  className="w-full h-full object-cover filter contrast-105 hover:scale-102 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141a]/80 via-transparent to-transparent opacity-90" />
                
                {/* Floating Architectural Badge on Portrait */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#ffffff]/95 border border-[#12141a]/10 backdrop-blur-md shadow-lg text-[#12141a]">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs font-sans">
                    <span className="text-[#12141a] font-bold tracking-wide">{profile.name}</span>
                    <span className="text-[#9e825d] font-bold text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      COA LICENSED
                    </span>
                  </div>
                  <div className="text-[10px] font-sans text-[#747783] mt-0.5 font-medium">
                    B.Arch · Autodesk Certified Professional · UAE / India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sharp Bio & Highlights */}
          <div className="lg:col-span-7 space-y-7">
            <p className="text-base sm:text-lg text-[#12141a] font-normal leading-relaxed">
              {profile.bio}
            </p>

            {/* Key Highlights Grid */}
            <div className="space-y-3.5 pt-1">
              <div className="text-[10px] font-sans font-bold text-[#747783] uppercase tracking-[0.16em]">
                CORE EXPERTISE & TRACK RECORD
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans text-[#12141a]">
                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/10 shadow-sm flex items-start gap-3 hover:border-[#bfa37c]/50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-[#f2eee6] text-[#9e825d] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="block text-[#12141a] font-bold text-[13px]">06+ Years Professional Experience</strong>
                    <span className="text-[#747783] text-[11px]">Realized Architecture & Interior Design projects across UAE & India</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/10 shadow-sm flex items-start gap-3 hover:border-[#bfa37c]/50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-[#f2eee6] text-[#9e825d] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="block text-[#12141a] font-bold text-[13px]">100+ Villa & Interior Commissions</strong>
                    <span className="text-[#747783] text-[11px]">Private residences, penthouses & boutique spaces</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/10 shadow-sm flex items-start gap-3 hover:border-[#bfa37c]/50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-[#f2eee6] text-[#9e825d] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="block text-[#12141a] font-bold text-[13px]">AI Workflow Specialist</strong>
                    <span className="text-[#747783] text-[11px]">AI-Driven Design & Digital Workflows</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/10 shadow-sm flex items-start gap-3 hover:border-[#bfa37c]/50 transition-colors">
                  <div className="p-1.5 rounded-lg bg-[#f2eee6] text-[#9e825d] shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <strong className="block text-[#12141a] font-bold text-[13px]">Global Educator & Creator</strong>
                    <span className="text-[#747783] text-[11px]">20,000+ architects and designers trained</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Credibility Strip in Light Tone */}
            <div className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/10 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-[#4a4d57] font-medium">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#9e825d]" />
                  <span className="text-[#12141a] font-semibold">Licensed Architect (COA)</span>
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#4a4d57]" />
                  <span>Revit & BIM Certified</span>
                </span>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateConsult?.();
                }}
                className="text-[#9e825d] hover:text-[#12141a] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 transition-colors"
              >
                <span>BOOK CONSULTATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
