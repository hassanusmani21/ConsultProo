import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, ShieldCheck, Box, Database, Sparkles, CheckCircle2, AlertTriangle, FileCode2, Cpu } from 'lucide-react';
import { BimLayerData } from '../data/bimData';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';

export const BimExperience: React.FC = () => {
  const { data } = useData();
  const bimShowcaseLayers = data.bimLayers.filter((item: BimLayerData & { published?: boolean }) => item.published !== false);
  const [activeLodId, setActiveLodId] = useState<string>('lod-300-coordination');
  const activeLayer = bimShowcaseLayers.find((l: BimLayerData) => l.id === activeLodId) || bimShowcaseLayers[0];

  if (!activeLayer) return null;

  const handleSelectLod = (id: string) => {
    soundManager.playClick();
    setActiveLodId(id);
  };

  return (
    <section id="bim" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0c0d12] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
              05 / BIM & REVIT EXPERTISE
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              FROM DRAWING <br />
              <span className="text-white">
                TO{' '}
                <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                  Information.
                </span>
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#b5b5b5] font-normal leading-[1.65] max-w-xl">
              Architecture today is database engineering. We construct intelligent building models where every wall, duct, and curtain panel carries rich parametric metadata.
            </p>
          </div>

          {/* LOD Tier Switcher */}
          <div className="flex items-center gap-2 bg-[#13151c] border border-white/10 p-1.5 rounded-xl">
            {bimShowcaseLayers.map((layer) => {
              const isSelected = layer.id === activeLodId;
              return (
                <button
                  key={layer.id}
                  onClick={() => handleSelectLod(layer.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-sans uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-sky-500/20 border border-sky-400 text-sky-300 font-bold shadow-lg shadow-sky-500/10'
                      : 'text-[#8e929b] hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{layer.lod}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive BIM Viewport & Parameter HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 3D / Section Viewport */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#13151c] border border-white/15 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLayer.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                >
                  <img
                    src={activeLayer.image}
                    alt={activeLayer.name}
                    className="w-full h-full object-cover filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/30 to-transparent" />

                  {/* Viewport Overlay HUD */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1 rounded bg-[#0c0d12]/80 border border-sky-500/30 text-xs font-mono text-sky-400 backdrop-blur-md flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      <span>REVIT 2025 ACTIVE VIEWPORT: {activeLayer.lod}</span>
                    </div>

                    <div className="px-3 py-1 rounded bg-[#0c0d12]/80 border border-white/20 text-xs font-mono text-[#d4d4ce] backdrop-blur-md">
                      DISCIPLINE: {activeLayer.discipline}
                    </div>
                  </div>

                  {/* Bottom Viewport Info */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0c0d12]/85 border border-white/15 backdrop-blur-md space-y-2">
                    <div className="text-sm sm:text-base font-bold text-white">
                      {activeLayer.name}
                    </div>
                    <p className="text-xs text-[#d4d4ce]">
                      {activeLayer.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Viewport Control Bar */}
            <div className="p-4 rounded-xl bg-[#13151c] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8e929b]">
              <div className="flex items-center gap-2 text-sky-400">
                <ShieldCheck className="w-4 h-4" />
                <span>COORDINATION CLASH STATUS: {activeLayer.clashesResolved} / {activeLayer.clashesDetected} (100% RESOLVED)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>FORMAT: .RVT 2025 · IFC 4.3</span>
              </div>
            </div>
          </div>

          {/* Right Column: Revit Shared Parameters Inspector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-[#13151c] border border-white/15 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>Revit Properties Inspector</span>
                </div>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800">
                  {activeLayer.lod}
                </span>
              </div>

              {/* Parameter Fields */}
              <div className="space-y-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-white/5 space-y-1">
                  <div className="text-[#8e929b] text-[10px]">CATEGORY</div>
                  <div className="text-white font-semibold">{activeLayer.parameters.category}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-white/5 space-y-1">
                  <div className="text-[#8e929b] text-[10px]">FAMILY & TYPE</div>
                  <div className="text-sky-300 font-semibold truncate">{activeLayer.parameters.family}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-white/5 space-y-1">
                  <div className="text-[#8e929b] text-[10px]">FIRE RATING SPECIFICATION</div>
                  <div className="text-amber-300 font-semibold">{activeLayer.parameters.fireRating}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-white/5 space-y-1">
                  <div className="text-[#8e929b] text-[10px]">THERMAL TRANSMITTANCE (U-VALUE)</div>
                  <div className="text-emerald-300 font-semibold">{activeLayer.parameters.uValue}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0c0d12] border border-white/5 space-y-1">
                  <div className="text-[#8e929b] text-[10px]">OMNICLASS & UNIFORMAT CODE</div>
                  <div className="text-[#d4d4ce] font-semibold">{activeLayer.parameters.omniClass}</div>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-[10px] font-mono text-[#8e929b] uppercase">Active Feature Sets</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeLayer.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-[#181b24] border border-white/10 text-[10px] font-mono text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
