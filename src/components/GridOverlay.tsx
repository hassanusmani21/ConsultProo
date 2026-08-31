import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Eye, EyeOff } from 'lucide-react';

interface GridOverlayProps {
  enabled?: boolean;
  isVisible?: boolean;
  onToggle?: () => void;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ enabled, isVisible, onToggle }) => {
  const isGridActive = isVisible !== undefined ? isVisible : !!enabled;
  const [coords, setCoords] = useState({ x: 0, y: 0, mmX: 0, mmY: 0 });

  useEffect(() => {
    if (!isGridActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Convert screen px to architectural scale (1px ≈ 2.5mm at 1:100)
      const mmX = Math.round(e.clientX * 2.64);
      const mmY = Math.round(e.clientY * 2.64);
      setCoords({ x: e.clientX, y: e.clientY, mmX, mmY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isGridActive]);

  return (
    <>
      <AnimatePresence>
        {isGridActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
          >
            {/* Architectural Grid Lines */}
            <div className="absolute inset-0 bg-blueprint-grid opacity-30" />
            <div className="absolute inset-0 bg-arch-grid opacity-30" />

            {/* Architectural Border & Title Block */}
            <div className="absolute left-3 right-3 bottom-3 top-20 sm:left-6 sm:right-6 sm:bottom-6 sm:top-24 md:left-8 md:right-8 md:bottom-8 md:top-24 border border-[#bfa37c]/20 pointer-events-none flex flex-col justify-between p-2">
              <div />

              <div className="hidden md:flex justify-between items-end text-[9px] font-mono text-[#bfa37c]/80 uppercase tracking-widest">
                <div className="bg-[#0e1015]/90 px-2.5 py-1 border border-[#bfa37c]/30 rounded backdrop-blur-sm">
                  <span>DISCIPLINE: ARCH · INTERIOR · AI</span>
                </div>
                <div className="bg-[#0e1015]/90 px-2.5 py-1 border border-[#bfa37c]/30 rounded text-[#d6be9c] backdrop-blur-sm">
                  <span>CURSOR: X={coords.x}px ({coords.mmX}mm) | Y={coords.y}px ({coords.mmY}mm)</span>
                </div>
              </div>
            </div>

            {/* Crosshair guide following mouse (desktop) */}
            <div
              className="absolute left-0 right-0 h-[1px] bg-[#bfa37c]/20 pointer-events-none hidden md:block"
              style={{ top: coords.y }}
            />
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-[#bfa37c]/20 pointer-events-none hidden md:block"
              style={{ left: coords.x }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
