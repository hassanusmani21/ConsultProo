import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface PageLoaderProps {
  isVisible: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0e1015]/72 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-[#14161f]/95 px-6 py-5 shadow-2xl shadow-black/50">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full border border-[#bfa37c]/20" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#d6be9c]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="text-center font-sans">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d6be9c]">
                Loading
              </div>
              <div className="mt-1 text-xs text-[#c4c6cf]">
                Preparing the next section
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
