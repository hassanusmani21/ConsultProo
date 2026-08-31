import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Check, Copy, CheckCircle2, Download, BookOpen, Layers, Sparkles } from 'lucide-react';
import { DigitalProduct } from '../types';
import { soundManager } from '../utils/sound';

interface ProductModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onNavigateConsultation: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onNavigateConsultation }) => {
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!product) return null;

  const handleCopyPrompt = () => {
    if (product.promptSnippet) {
      navigator.clipboard.writeText(product.promptSnippet);
      setCopiedPrompt(true);
      soundManager.playClick();
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleRequestAccess = () => {
    soundManager.playClick();
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
      onNavigateConsultation();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/85 backdrop-blur-md">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border border-white/20 rounded-2xl shadow-2xl z-10 text-[#e8e9ed] no-scrollbar"
        >
          {/* Close button */}
          <div className="sticky top-4 right-4 z-20 flex justify-end pr-4 pointer-events-none">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2.5 rounded-full bg-[#13151c]/90 border border-white/20 text-white hover:text-[#c5a880] transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Header */}
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#13151c] -mt-12">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-2.5 py-1 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-mono text-[#c5a880] uppercase tracking-wider">
                {product.category} · {product.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white mt-2">
                {product.title}
              </h2>
            </div>
          </div>

          {/* Product Body */}
          <div className="p-6 sm:p-10 space-y-8">
            <p className="text-sm sm:text-base text-[#d4d4ce] leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#13151c] border border-white/10 text-xs font-mono">
              <div>
                <div className="text-[#8e929b] text-[10px]">FORMAT & DELIVERY</div>
                <div className="text-white font-semibold mt-0.5">{product.specs.format}</div>
              </div>
              <div>
                <div className="text-[#8e929b] text-[10px]">TARGET AUDIENCE</div>
                <div className="text-white font-semibold mt-0.5">{product.specs.skillLevel || 'Architects & Students'}</div>
              </div>
              <div>
                <div className="text-[#8e929b] text-[10px]">SCOPE / VOLUME</div>
                <div className="text-[#c5a880] font-semibold mt-0.5">{product.specs.itemsCount || product.specs.duration || 'Comprehensive'}</div>
              </div>
            </div>

            {/* Content Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Curriculum & Asset Highlights
              </h3>
              <div className="space-y-2">
                {product.contentHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#13151c] border border-white/5 text-xs text-[#d4d4ce]">
                    <CheckCircle2 className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Prompt Snippet */}
            {product.promptSnippet && (
              <div className="p-4 rounded-xl bg-[#13151c] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>SAMPLE VAULT PROMPT SNIPPET</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1 text-white hover:text-emerald-300"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-white/90 bg-[#0c0d12] p-3 rounded-lg border border-white/10">
                  {product.promptSnippet}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-[#13151c] border border-white/15 text-xs font-mono text-[#8e929b] hover:text-white"
              >
                ← Back to Library
              </button>

              <button
                onClick={handleRequestAccess}
                className="px-6 py-3 rounded-lg bg-[#c5a880] text-[#0c0d12] text-xs font-bold uppercase tracking-wider hover:bg-[#d8be96] active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[#c5a880]/20"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Access Granted · Opening Brief...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{product.linkText || 'Access This Resource'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
