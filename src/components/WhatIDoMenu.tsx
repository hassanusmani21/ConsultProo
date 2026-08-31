import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, CheckCircle, Sparkles, Layers, Cpu, Eye, BookOpen, MessageSquare } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface WhatIDoProps {
  onNavigate: (sectionId: string) => void;
  onSetCursorText: (text?: string) => void;
}

interface DisciplineItem {
  id: string;
  number: string;
  title: string;
  targetSection: string;
  tagline: string;
  description: string;
  image: string;
  deliverables: string[];
  tools: string[];
}

export const WhatIDoMenu: React.FC<WhatIDoProps> = ({ onNavigate, onSetCursorText }) => {
  const disciplines: DisciplineItem[] = [
    {
      id: 'arch',
      number: '01',
      title: 'ARCHITECTURE',
      targetSection: 'work',
      tagline: 'Concept Ideation, Spatial Morphology & Sustainable Envelopes',
      description: 'Comprehensive architectural concept design, schematic drawings, zoning analysis, passive thermal massing, and client presentation packages.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['Schematic Architectural Design', 'Site & Passive Solar Analysis', 'Tender Drawing Packages', 'Client Spatial Presentations'],
      tools: ['AutoCAD', 'Revit', 'Sketchup', 'Rhino']
    },
    {
      id: 'bim',
      number: '02',
      title: 'BIM / REVIT',
      targetSection: 'bim',
      tagline: 'Information Modeling, Clash Auditing & LOD 300–400 Coordination',
      description: 'Parametric Autodesk Revit modeling, workshared central files, Navisworks clash resolution audits, automated parameter schedules, and fabrication-ready sheets.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['LOD 300–400 Revit Models', 'Navisworks Clash Matrix Audits', 'Parametric Family Development', 'BIM Execution Standards (BEP)'],
      tools: ['Autodesk Revit 2025', 'Navisworks Manage', 'BIM 360', 'Dynamo']
    },
    {
      id: 'ai',
      number: '03',
      title: 'AI × ARCHITECTURE',
      targetSection: 'ai-architecture',
      tagline: 'Generative Diffusion, ControlNet Geometry & Latent Ideation',
      description: 'Custom AI workflows for architecture studios. Translating spatial text prompts and 3D massing wireframes into photorealistic atmospheric concepts with granular material control.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['Image-to-Geometry Pipelines', 'Custom Architecture LoRA Weights', 'Prompt Engineering Matrices', 'Studio AI Adoption Audits'],
      tools: ['Midjourney v6.1', 'ControlNet Depth', 'SDXL', 'Python AI Scripts']
    },
    {
      id: 'vis',
      number: '04',
      title: 'VISUALIZATION',
      targetSection: 'work',
      tagline: 'Cinematic Spatial Atmospheres & Physically Based Rendering',
      description: 'High-impact 4K exterior and interior visualizations, lighting studies (day, golden hour, blue hour, twilight), and architectural animation storyboards.',
      image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['4K Still Visualizations', 'Material & Tactile Texture Studies', 'Atmospheric Lighting Simulation', 'Post-Production Polishing'],
      tools: ['Enscape', 'Twinmotion', 'D5 Render', 'Photoshop']
    },
    {
      id: 'prod',
      number: '05',
      title: 'DIGITAL PRODUCTS',
      targetSection: 'products',
      tagline: 'Production Revit Families, 500+ Prompt Vaults & Ebooks',
      description: 'Battle-tested digital resources engineered to streamline architectural workflows for independent practitioners, students, and global design teams.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['500+ Architecture Prompt Matrix', 'Parametric Revit Families (.rfa)', 'Field Guide Ebooks & Checklists', 'Custom Dynamo Script Presets'],
      tools: ['Revit RFA', 'Notion Database', 'PDF Presets', 'Grasshopper']
    },
    {
      id: 'cons',
      number: '06',
      title: 'CONSULTATION',
      targetSection: 'consultation',
      tagline: '1-on-1 Studio Mentorship, BIM Audits & Project Advisory',
      description: 'Strategic advisory for design studios adopting AI pipelines, architecture students elevating their portfolios, or contractors seeking BIM clash resolution.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=1600&auto=format&fit=crop',
      deliverables: ['1-on-1 Strategy Sessions', 'BIM Model Health Checks', 'AI Implementation Roadmaps', 'Portfolio & Career Guidance'],
      tools: ['Live Video Studio', 'Screen Share Audits', 'Actionable Summaries']
    }
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeItem = disciplines[activeIdx];

  return (
    <section id="expertise" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-16">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
              02 / EXPERTISE & CAPABILITIES
            </span>
            <span className="text-xs font-sans text-[#8e929b] tracking-wider uppercase hidden sm:inline">
              INTERACTIVE DISCIPLINE SELECTOR
            </span>
          </div>
          <div className="text-xs font-sans font-medium text-[#8e929b]">
            [0{activeIdx + 1} / 0{disciplines.length}]
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Interactive Vertical Menu */}
          <div className="lg:col-span-6 space-y-2">
            {disciplines.map((item, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    if (activeIdx !== idx) {
                      soundManager.playTick(750 + idx * 50);
                      setActiveIdx(idx);
                    }
                  }}
                  onClick={() => {
                    soundManager.playClick();
                    onNavigate(item.targetSection);
                  }}
                  className={`group relative p-4 sm:p-6 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#13151c] border-[#c5a880]/50 shadow-xl shadow-black/40'
                      : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-[#13151c]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span
                        className={`font-sans text-sm sm:text-base font-bold transition-colors ${
                          isSelected ? 'text-[#c5a880]' : 'text-[#8e929b] group-hover:text-white'
                        }`}
                      >
                        {item.number}
                      </span>
                      <h3
                        className={`text-xl sm:text-2xl md:text-3xl font-sans font-extrabold tracking-tight transition-all ${
                          isSelected ? 'text-white translate-x-1' : 'text-[#8e929b] group-hover:text-[#d4d4ce]'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#c5a880] text-[#0c0d12]'
                          : 'bg-white/5 text-[#8e929b] group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Subtitle preview visible on mobile */}
                  <p className="mt-2 text-xs text-[#8e929b] font-sans sm:hidden">
                    {item.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Architectural Preview Canvas */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="p-5 sm:p-7 rounded-2xl bg-[#13151c] border border-white/15 shadow-2xl space-y-6"
              >
                {/* Visual Backdrop Frame */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0c0d12] border border-white/10">
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover filter contrast-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-[#13151c]/30 to-transparent" />

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-sans font-semibold text-[#c5a880] tracking-[0.15em] uppercase">
                    DISCIPLINE: {activeItem.number}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-xs font-sans text-white/90 truncate">
                    {activeItem.tagline}
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-sans font-bold text-white tracking-tight">
                    {activeItem.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#b5b5b5] font-normal leading-[1.65]">
                    {activeItem.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-[10px] font-sans font-semibold text-[#8e929b] uppercase tracking-[0.18em]">
                      Core Deliverables & Scope
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeItem.deliverables.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white font-sans">
                          <CheckCircle className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                          <span className="truncate">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Software & Tools Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-[10px] font-sans font-semibold text-[#8e929b] tracking-wider uppercase">INSTRUMENTS:</span>
                    {activeItem.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-[#181b24] border border-white/10 text-[10px] font-mono text-[#d4d4ce]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Direct Jump CTA */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onNavigate(activeItem.targetSection);
                      }}
                      className="w-full py-3 rounded-lg bg-[#c5a880] text-[#0c0d12] font-sans font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#d8be96] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#c5a880]/15"
                    >
                      <span>Explore {activeItem.title} In Depth</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
