import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, Download, Check, Video, ArrowUpRight } from 'lucide-react';
import { digitalProducts } from '../data/productsData';
import { ProductModal } from './ProductModal';
import { DigitalProduct } from '../types';
import { soundManager } from '../utils/sound';

interface LearnSectionProps {
  onNavigateLearningHub?: () => void;
  onNavigateConsultation?: () => void;
}

export const LearnSection: React.FC<LearnSectionProps> = ({ 
  onNavigateLearningHub,
  onNavigateConsultation 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  // 1 Featured Masterclass + 2 Digital Products
  const masterclass = digitalProducts.find(p => p.id === 'ai-architecture-masterclass') || digitalProducts[0];
  const promptPack = digitalProducts.find(p => p.id === '500-arch-prompt-vault') || digitalProducts[1];
  const parametricSystem = digitalProducts.find(p => p.id === 'revit-adaptive-facade-kit') || digitalProducts[2];

  const handleOpen = (prod: DigitalProduct) => {
    soundManager.playClick();
    setSelectedProduct(prod);
  };

  return (
    <section id="learn" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#c5a880] uppercase tracking-[0.2em] px-3 py-1 rounded bg-[#13151c] border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EDUCATION & DIGITAL TOOLS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              LEARN WITH <br />
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                Ahmed.
              </span>
            </h2>
          </div>

          <p className="text-sm text-[#b5b5b5] max-w-md leading-relaxed">
            Practical AI workflows, curated prompt systems, and computational architectural tools designed for real studio production.
          </p>
        </div>

        {/* 1 Featured Masterclass (Large) + 2 Digital Products (Side-by-Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 1 Featured Masterclass: AI WORKFLOWS FOR ARCHITECTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => handleOpen(masterclass)}
            className="lg:col-span-7 group cursor-pointer rounded-2xl bg-[#13151c] border border-white/15 overflow-hidden hover:border-[#c5a880]/50 transition-all flex flex-col justify-between shadow-2xl"
          >
            <div>
              {/* Visual Preview */}
              <div className="relative aspect-[16/9] overflow-hidden bg-[#0c0d12]">
                <img
                  src={masterclass.thumbnail}
                  alt={masterclass.title}
                  className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-transparent to-black/30" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded bg-[#0c0d12]/85 backdrop-blur-md border border-[#c5a880]/40 text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-wider">
                    FEATURED MASTERCLASS
                  </span>
                  <span className="px-3 py-1 rounded bg-[#c5a880] text-[#0c0d12] text-xs font-sans font-bold uppercase tracking-wider shadow-lg">
                    {masterclass.badge || 'ENROLLMENT OPEN'}
                  </span>
                </div>
              </div>

              {/* Masterclass Details */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-white group-hover:text-[#c5a880] transition-colors leading-snug">
                    AI Workflows for Architects
                  </h3>
                  <p className="text-xs sm:text-sm text-[#b5b5b5] font-normal leading-relaxed">
                    Master image synthesis, ControlNet massing translation, and architectural prompt matrices to accelerate your design ideation 10x.
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {masterclass.contentHighlights.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-sans text-[#d4d4ce]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Card Action */}
            <div className="p-6 sm:p-8 pt-0">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button className="px-6 py-3 rounded-xl bg-[#c5a880] text-[#0c0d12] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#d8be96] transition-all flex items-center gap-2">
                  <span>ENROLL IN MASTERCLASS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-sans text-[#8e929b]">{masterclass.specs.duration || '6 Modules'}</span>
              </div>
            </div>
          </motion.div>

          {/* 2 Digital Products Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Product 1: ARCHITECTURAL AI PROMPT PACK */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => handleOpen(promptPack)}
              className="group cursor-pointer rounded-2xl bg-[#13151c] border border-white/15 overflow-hidden hover:border-[#c5a880]/50 transition-all flex-1 p-6 flex flex-col justify-between shadow-xl"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={promptPack.thumbnail}
                  alt={promptPack.title}
                  className="w-24 h-24 rounded-xl object-cover filter contrast-105 shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-wider">
                      PROMPT VAULT
                    </span>
                    <span className="text-xs font-sans font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                      {promptPack.badge || 'FREE ACCESS'}
                    </span>
                  </div>
                  <h4 className="text-base font-sans font-bold text-white group-hover:text-[#c5a880] transition-colors leading-snug truncate">
                    Architectural AI Prompt Pack
                  </h4>
                  <p className="text-xs text-[#a8a8a8] leading-relaxed line-clamp-2">
                    500+ structured prompts with negative keywords, light styles, and camera lenses.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-sans font-bold text-[#c5a880]">
                <span className="uppercase tracking-[0.14em]">GET PROMPT PACK</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            {/* Product 2: PARAMETRIC PROMPT SYSTEM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => handleOpen(parametricSystem)}
              className="group cursor-pointer rounded-2xl bg-[#13151c] border border-white/15 overflow-hidden hover:border-[#c5a880]/50 transition-all flex-1 p-6 flex flex-col justify-between shadow-xl"
            >
              <div className="flex gap-4 items-start">
                <img
                  src={parametricSystem.thumbnail}
                  alt={parametricSystem.title}
                  className="w-24 h-24 rounded-xl object-cover filter contrast-105 shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-bold text-[#c5a880] uppercase tracking-wider">
                      DESIGN SYSTEM
                    </span>
                    <span className="text-xs font-sans font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                      {parametricSystem.badge || 'PRO SYSTEM'}
                    </span>
                  </div>
                  <h4 className="text-base font-sans font-bold text-white group-hover:text-[#c5a880] transition-colors leading-snug truncate">
                    Parametric Prompt System
                  </h4>
                  <p className="text-xs text-[#a8a8a8] leading-relaxed line-clamp-2">
                    Algorithmic facade generation logic and modular Grasshopper-to-AI translation rules.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-sans font-bold text-[#c5a880]">
                <span className="uppercase tracking-[0.14em]">GET SYSTEM</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA: VISIT LEARNING HUB → */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              soundManager.playClick();
              if (onNavigateLearningHub) onNavigateLearningHub();
              else if (onNavigateConsultation) onNavigateConsultation();
            }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#13151c] border border-white/15 text-white font-sans font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#191b24] hover:border-[#c5a880]/60 transition-all shadow-xl"
          >
            <span>VISIT LEARNING HUB</span>
            <ArrowRight className="w-4 h-4 text-[#c5a880]" />
          </button>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateConsultation={onNavigateConsultation || (() => {})}
      />
    </section>
  );
};
