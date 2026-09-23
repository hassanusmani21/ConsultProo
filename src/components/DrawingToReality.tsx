import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { MoveHorizontal, Eye, Layers, Compass, CheckCircle, ZoomIn } from 'lucide-react';
import { drawingComparisonData } from '../data/bimData';
import { soundManager } from '../utils/sound';

interface DrawingToRealityProps {
  onSetCursorText: (text?: string) => void;
}

export const DrawingToReality: React.FC<DrawingToRealityProps> = ({ onSetCursorText }) => {
  // Slider position from 0 to 100
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeLayerMode, setActiveLayerMode] = useState<'cad-to-render' | 'cad-to-bim' | 'bim-to-render'>('cad-to-render');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const leftView =
    activeLayerMode === 'cad-to-render'
      ? drawingComparisonData.cadView
      : activeLayerMode === 'cad-to-bim'
      ? drawingComparisonData.cadView
      : drawingComparisonData.bimView;

  const rightView =
    activeLayerMode === 'cad-to-render'
      ? drawingComparisonData.renderView
      : activeLayerMode === 'cad-to-bim'
      ? drawingComparisonData.bimView
      : drawingComparisonData.renderView;

  return (
    <section id="drawing-reality" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#090a0f] border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
              04 / SIGNATURE INTERACTION
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-white tracking-tight leading-[1.05]">
              DRAWING <span className="text-[#c5a880]">→</span> REALITY.
            </h2>
            <p className="text-sm sm:text-base text-[#b5b5b5] font-normal leading-[1.65] max-w-xl">
              Drag the interactive slider to inspect how 2D vector CAD linework translates into parametric BIM intelligence and realized atmospheric architecture.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-[#13151c] border border-white/10 p-1.5 rounded-xl">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveLayerMode('cad-to-render');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-[0.1em] transition-all ${
                activeLayerMode === 'cad-to-render'
                  ? 'bg-[#c5a880] text-[#0c0d12] font-bold shadow-md shadow-[#c5a880]/15'
                  : 'text-[#8e929b] hover:text-white font-medium'
              }`}
            >
              CAD ↔ Realized Render
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveLayerMode('cad-to-bim');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-[0.1em] transition-all ${
                activeLayerMode === 'cad-to-bim'
                  ? 'bg-[#c5a880] text-[#0c0d12] font-bold shadow-md shadow-[#c5a880]/15'
                  : 'text-[#8e929b] hover:text-white font-medium'
              }`}
            >
              CAD ↔ BIM Model
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveLayerMode('bim-to-render');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans uppercase tracking-[0.1em] transition-all ${
                activeLayerMode === 'bim-to-render'
                  ? 'bg-[#c5a880] text-[#0c0d12] font-bold shadow-md shadow-[#c5a880]/15'
                  : 'text-[#8e929b] hover:text-white font-medium'
              }`}
            >
              BIM ↔ Render
            </button>
          </div>
        </div>

        {/* Interactive Comparison Canvas */}
        <div
          ref={containerRef}
          onMouseDown={() => {
            setIsDragging(true);
            soundManager.playSlide();
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseEnter={() => onSetCursorText('DRAG')}
          onMouseLeave={() => {
            setIsDragging(false);
            onSetCursorText(undefined);
          }}
          className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#13151c] border border-white/20 select-none shadow-2xl cursor-ew-resize group"
        >
          {/* Right Image (Full Background) */}
          <div className="absolute inset-0">
            <img
              src={rightView.image}
              alt={rightView.title}
              className="w-full h-full object-cover filter contrast-105"
            />
            {/* Label Right */}
            <div className="absolute bottom-6 right-6 p-3 rounded-xl bg-[#0c0d12]/90 border border-white/20 backdrop-blur-md max-w-xs text-right hidden sm:block">
              <div className="text-[10px] font-mono text-[#c5a880] uppercase tracking-wider">
                {rightView.badge}
              </div>
              <div className="text-xs font-bold text-white mt-0.5">{rightView.title}</div>
              <div className="text-[11px] text-[#8e929b] mt-1">{rightView.description}</div>
            </div>
          </div>

          {/* Left Image (Clipped overlay based on sliderPosition) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 w-[100vw] max-w-7xl h-full">
              <img
                src={leftView.image}
                alt={leftView.title}
                className="w-full h-full object-cover filter contrast-110 grayscale"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
            </div>

            {/* Label Left */}
            <div className="absolute bottom-6 left-6 p-3 rounded-xl bg-[#0c0d12]/90 border border-white/20 backdrop-blur-md max-w-xs text-left hidden sm:block">
              <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">
                {leftView.badge}
              </div>
              <div className="text-xs font-bold text-white mt-0.5">{leftView.title}</div>
              <div className="text-[11px] text-[#8e929b] mt-1">{leftView.description}</div>
            </div>
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="absolute inset-y-0 w-[2px] bg-[#c5a880] pointer-events-none shadow-[0_0_15px_rgba(197,168,128,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Handle Button */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#c5a880] border-2 border-[#0c0d12] flex items-center justify-center text-[#0c0d12] shadow-2xl transition-transform group-hover:scale-110">
              <MoveHorizontal className="w-5 h-5" />
            </div>
          </div>

          {/* Overlay Instruction Hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0c0d12]/80 border border-white/20 text-[10px] font-mono text-white/80 pointer-events-none backdrop-blur-md flex items-center gap-1.5">
            <MoveHorizontal className="w-3 h-3 text-[#c5a880]" />
            <span>DRAG SLIDER HORIZONTALLY TO COMPARE</span>
          </div>
        </div>

        {/* Technical Callout Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#8e929b] p-4 rounded-xl bg-[#13151c] border border-white/10">
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Zero Geometric Drift CAD ↔ Revit</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="w-4 h-4 text-[#c5a880] shrink-0" />
            <span>Parametric Material Shaders Mapped</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct Sunlight Radiation Calibrated</span>
          </div>
        </div>
      </div>
    </section>
  );
};
