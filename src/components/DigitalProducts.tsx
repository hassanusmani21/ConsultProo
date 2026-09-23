import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BookOpen, Layers, Cpu, Sparkles, Download, CheckCircle2, ChevronRight } from 'lucide-react';
import { useData } from '../data/DataContext';
import { DigitalProduct } from '../types';
import { ProductModal } from './ProductModal';
import { soundManager } from '../utils/sound';
import { PriceDisplay } from './PriceDisplay';

interface DigitalProductsProps {
  onSetCursorText: (text?: string) => void;
  onNavigateConsultation: () => void;
}

export const DigitalProducts: React.FC<DigitalProductsProps> = ({ onSetCursorText, onNavigateConsultation }) => {
  const { data } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const products = data.digitalProducts.filter((item: DigitalProduct & { published?: boolean }) => item.published !== false);

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'courses', label: 'AI Courses' },
    { id: 'prompts', label: 'Prompt Vaults' },
    { id: 'models', label: 'Revit Families' },
    { id: 'ebooks', label: 'Field Guides & Ebooks' },
    { id: 'masterclasses', label: 'Live Masterclasses' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p: DigitalProduct) => p.category === activeCategory);

  const handleOpenProduct = (prod: DigitalProduct) => {
    soundManager.playClick();
    setSelectedProduct(prod);
  };

  return (
    <section id="products" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0c0d12] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
              07 / ARCHITECTURAL TOOLKIT & EDUCATION
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              TOOLS FOR <br />
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                Better Design.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#b5b5b5] font-normal leading-[1.65] max-w-xl">
              Scalable resources built from real studio practice: production-ready Revit BIM families, 500+ structured AI prompt matrices, and actionable workflows.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-[#13151c] border border-white/10 p-1.5 rounded-xl">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playTick(850);
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-[0.1em] transition-all ${
                    isActive
                      ? 'bg-[#c5a880] text-[#0c0d12] font-bold shadow-md shadow-[#c5a880]/20'
                      : 'text-[#8e929b] hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editorial Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => handleOpenProduct(prod)}
              onMouseEnter={() => onSetCursorText('EXPLORE')}
              onMouseLeave={() => onSetCursorText(undefined)}
              className="group relative p-6 rounded-2xl bg-[#13151c] border border-white/15 hover:border-[#c5a880]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-black/60"
            >
              <div className="space-y-4">
                {/* Thumbnail image */}
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#090a0f] border border-white/10">
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13151c] via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-sans font-semibold text-[#c5a880] uppercase tracking-wider">
                    {prod.badge || prod.category.toUpperCase()}
                  </div>
                </div>

                {/* Card Title & Tagline */}
                <div className="space-y-1.5">
                  <h3 className="text-xl font-sans font-bold text-white group-hover:text-[#c5a880] transition-colors leading-snug tracking-tight">
                    {prod.title}
                  </h3>
                  <p className="text-xs font-sans text-[#a8a8a8] leading-[1.6] line-clamp-2">
                    {prod.tagline}
                  </p>
                  {prod.price !== undefined && (
                    <PriceDisplay
                      price={prod.price}
                      compareAtPrice={prod.compareAtPrice}
                      currency={prod.currency}
                      currentClassName="text-base font-sans font-bold text-[#c5a880]"
                      compareClassName="text-xs font-sans text-[#8e929b] line-through"
                      badgeClassName="text-[10px] font-bold text-[#c5a880]"
                    />
                  )}
                </div>

                {/* Highlights preview */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  {prod.contentHighlights.slice(0, 2).map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#d4d4ce] truncate font-sans">
                      <ChevronRight className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-sans text-[#c5a880] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform tracking-wider uppercase">
                  <span>{prod.linkText || 'Inspect Resource'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-sans text-[#8e929b] tracking-wider uppercase">
                  {prod.specs.itemsCount || prod.specs.duration || prod.specs.format}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateConsultation={onNavigateConsultation}
      />
    </section>
  );
};
