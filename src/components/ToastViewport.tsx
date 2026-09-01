import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const tone = {
  success: 'border-emerald-400/30 text-emerald-300',
  error: 'border-red-400/30 text-red-300',
  info: 'border-[#bfa37c]/35 text-[#d6be9c]',
};

export const ToastViewport: React.FC<ToastViewportProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed right-4 top-24 z-[95] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 24, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl border bg-[#14161f]/95 p-4 font-sans shadow-2xl shadow-black/40 backdrop-blur-xl ${tone[toast.type]}`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-white">
                    {toast.title}
                  </div>
                  {toast.message && (
                    <div className="mt-1 text-xs leading-relaxed text-[#c4c6cf]">
                      {toast.message}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onDismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="rounded-md p-1 text-[#9a9da8] transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
