import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CustomCursorProps {
  cursorText?: string;
  cursorVariant?: 'default' | 'project' | 'product' | 'drag' | 'arrow';
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ cursorText, cursorVariant = 'default' }) => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch desktop devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = 
          target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') || 
          target.getAttribute('role') === 'button' ||
          target.classList.contains('cursor-pointer');
        setIsPointer(Boolean(isClickable));
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const hasCustomText = Boolean(cursorText);
  const cursorSize = hasCustomText ? 88 : isPointer ? 48 : 32;
  const cursorOffset = cursorSize / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden md:block overflow-hidden">
      {/* Outer follow circle */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none border border-[#bfa37c]/40 backdrop-blur-[1px]"
        style={{
          x: mousePosition.x - cursorOffset,
          y: mousePosition.y - cursorOffset,
          width: cursorSize,
          height: cursorSize,
        }}
        animate={{
          backgroundColor: hasCustomText ? 'rgba(191, 163, 124, 0.92)' : isPointer ? 'rgba(191, 163, 124, 0.15)' : 'rgba(255, 255, 255, 0.03)',
          borderColor: hasCustomText ? 'rgba(191, 163, 124, 1)' : isPointer ? 'rgba(191, 163, 124, 0.8)' : 'rgba(255, 255, 255, 0.2)'
        }}
        transition={{
          duration: 0.12,
          ease: 'easeOut'
        }}
      >
        {hasCustomText && (
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#0e1015] uppercase px-1 text-center select-none">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center dot / crosshair */}
      {!hasCustomText && (
        <motion.div
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#bfa37c] pointer-events-none"
          style={{
            x: mousePosition.x - 3,
            y: mousePosition.y - 3,
          }}
          animate={{
            scale: isPointer ? 0 : 1
          }}
          transition={{ duration: 0.1 }}
        />
      )}
    </div>
  );
};
