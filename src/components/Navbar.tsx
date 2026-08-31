import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Grid as GridIcon, 
  ArrowRight,
  Menu, 
  X
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  gridActive?: boolean;
  onToggleGrid?: () => void;
  activeDestination?: string;
  onNavigate: (destination: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  gridActive = true, 
  onToggleGrid, 
  activeDestination = 'home',
  onNavigate 
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted) {
      soundManager.playClick();
    }
  };

  const handleNavClick = (dest: string) => {
    soundManager.playClick();
    setMobileMenuOpen(false);
    onNavigate(dest);
  };

  const navItems = [
    { id: 'work', label: 'WORK' },
    { id: 'shop', label: 'SHOP' },
    { id: 'about', label: 'ABOUT' },
    { id: 'consult', label: 'CONSULT' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0e1015]/95 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl shadow-black/60'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          {/* Logo / Brand Name */}
          <button
            onClick={() => handleNavClick('home')}
            className="min-w-0 flex items-center gap-2 sm:gap-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 shrink-0 rounded-md border border-[#bfa37c]/40 bg-[#181a24] flex items-center justify-center text-[#bfa37c] font-sans font-bold text-xs group-hover:border-[#bfa37c] transition-colors">
              AU
            </div>
            <div className="min-w-0">
              <div className="font-sans font-bold text-xs sm:text-sm tracking-[0.06em] text-white flex items-center gap-2">
                <span className="truncate">AR. AHMED USMANI</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#bfa37c]" />
              </div>
              <div className="hidden sm:block text-[10px] font-sans font-semibold text-[#9a9da8] tracking-[0.18em] uppercase">
                ARCHITECT · INTERIOR · AI
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links: WORK, SHOP, ABOUT, CONSULT */}
          <nav className="hidden md:flex items-center gap-1 bg-[#14161f]/90 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeDestination === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => soundManager.playTick(900)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.14em] transition-all relative ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-[#9a9da8] hover:text-white font-medium'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#222530] rounded-full border border-white/15 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls & Primary SHOP CTA */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            {onToggleGrid && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onToggleGrid();
                }}
                title={gridActive ? "Disable Blueprint Grid" : "Enable Blueprint Grid"}
                className={`p-2 rounded-lg border text-xs font-sans transition-all flex items-center gap-1.5 ${
                  gridActive
                    ? 'bg-[#bfa37c]/20 border-[#bfa37c]/40 text-[#d6be9c]'
                    : 'bg-[#181a24] border-white/10 text-[#9a9da8] hover:text-white'
                }`}
              >
                <GridIcon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[10px] font-sans uppercase tracking-wider">
                  Grid
                </span>
              </button>
            )}

            <button
              onClick={toggleAudio}
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
              className={`p-2 rounded-lg border transition-all ${
                isMuted
                  ? 'bg-[#181a24] border-white/10 text-[#9a9da8]'
                  : 'bg-[#181a24] border-[#bfa37c]/40 text-[#bfa37c]'
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Primary SHOP Button */}
            <button
              onClick={() => handleNavClick('shop')}
              onMouseEnter={() => soundManager.playTick(1000)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#bfa37c] text-[#0e1015] text-xs font-sans font-bold uppercase tracking-[0.14em] hover:bg-[#d6be9c] active:scale-95 transition-all shadow-md shadow-[#bfa37c]/20"
            >
              <span>SHOP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-lg bg-[#181a24] border border-white/10 text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Clean Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 bg-[#090a0f]/98 backdrop-blur-xl border-b border-white/10 p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-3">
              <div className="text-[10px] font-sans font-semibold text-[#c5a880] uppercase tracking-[0.2em] pb-2 border-b border-white/10">
                Menu
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="flex items-center justify-between py-2.5 text-left text-sm font-sans font-semibold text-white hover:text-[#c5a880] transition-colors border-b border-white/5 tracking-wider uppercase"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#8e929b]" />
                </button>
              ))}

              <div className="pt-3">
                <button
                  onClick={() => handleNavClick('shop')}
                  className="w-full py-3 rounded-lg bg-[#c5a880] text-[#090a0f] text-xs font-sans font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shadow-lg shadow-[#c5a880]/20"
                >
                  <span>SHOP RESOURCES</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
