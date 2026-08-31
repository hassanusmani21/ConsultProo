import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Cpu, ArrowUpRight, CheckCircle2, Video, Users, Clock, Compass } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface CourseShowcaseProps {
  onNavigateConsultation: () => void;
}

export const CourseShowcase: React.FC<CourseShowcaseProps> = ({ onNavigateConsultation }) => {
  const modules = [
    { num: '01', title: 'Spatial Prompt Grammar & Typologies', desc: 'Structuring architectural constraints, camera lenses, lighting temperatures, and materials.' },
    { num: '02', title: 'ControlNet Spatial Guidance & Depth Maps', desc: 'Translating 3D Revit/Rhino massing wireframes directly into photorealistic iterations.' },
    { num: '03', title: 'Rhino Grasshopper to Generative Loops', desc: 'Algorithmic paneling, sun vector calculations, and automated image batch generation.' },
    { num: '04', title: 'Revit BIM LOD 350 Model Integration', desc: 'Bringing AI concepts into constructible Revit families and parameter schedules.' }
  ];

  return (
    <section id="courses" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Course Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
            08 / ACCELERATED EDUCATION
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
            LEARN THE <br />
            <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
              Workflow.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#b5b5b5] font-normal leading-[1.65]">
            Stop treating AI and BIM as disconnected tools. Master the complete hybrid pipeline designed specifically for professional architectural practice.
          </p>
        </div>

        {/* Featured Flagship Course Container */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-[#13151c] border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Subtle architectural background texture */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-arch-grid opacity-20 pointer-events-none hidden lg:block" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/40 text-xs font-sans font-bold uppercase tracking-[0.12em] text-[#c5a880]">
                  FLAGSHIP STUDIO COURSE
                </span>
                <span className="text-xs font-sans font-medium text-[#8e929b] tracking-wider uppercase">INSTRUCTOR: AR. AHMED USMANI</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-sans font-extrabold text-white tracking-tight">
                AI Architecture & BIM Synthesis Masterclass
              </h3>

              <p className="text-sm text-[#b5b5b5] font-normal leading-[1.65]">
                A hands-on, 6-module curriculum teaching you how to generate breathtaking concepts, extract geometric depth, and coordinate technical LOD 350 Revit packages with zero workflow friction.
              </p>

              {/* Modules breakdown list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {modules.map((m) => (
                  <div key={m.num} className="p-3.5 rounded-xl bg-[#0c0d12] border border-white/5 space-y-1">
                    <div className="text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-[0.15em]">MODULE {m.num}</div>
                    <div className="text-xs font-sans font-bold text-white">{m.title}</div>
                    <div className="text-[11px] text-[#8e929b] font-sans leading-normal">{m.desc}</div>
                  </div>
                ))}
              </div>

              {/* Tools Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[10px] font-sans font-semibold text-[#8e929b] tracking-wider uppercase">TOOLS COVERED:</span>
                {['Midjourney v6.1', 'ControlNet Depth', 'Autodesk Revit 2025', 'Rhino Grasshopper', 'SDXL', 'Enscape'].map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-[#181b24] border border-white/10 text-[10px] font-mono text-white">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onNavigateConsultation();
                  }}
                  className="px-6 py-3.5 rounded-xl bg-[#c5a880] text-[#0c0d12] text-xs font-sans font-bold uppercase tracking-[0.15em] hover:bg-[#d8be96] active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[#c5a880]/20"
                >
                  <span>Explore Course & Syllabus</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden bg-[#0c0d12] border border-white/15 aspect-[4/3] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop"
                  alt="Architecture Masterclass Preview"
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#0c0d12]/90 border border-white/15 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">LIVE COHORT + ON-DEMAND</span>
                    <span className="text-[#c5a880]">ENROLLMENT OPEN</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#8e929b] mt-0.5">
                    Includes 1-on-1 portfolio feedback & 500+ prompt database
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
