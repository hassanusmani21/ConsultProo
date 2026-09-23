import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CredentialStrip } from './components/CredentialStrip';
import { AiArchitecture } from './components/AiArchitecture';
import { ShopSection } from './components/ShopSection';
import { MasterclassSection } from './components/MasterclassSection';
import { AboutSection } from './components/AboutSection';
import { ConsultationForm } from './components/ConsultationForm';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { GridOverlay } from './components/GridOverlay';
import { PageLoader } from './components/PageLoader';
import { ToastMessage, ToastType, ToastViewport } from './components/ToastViewport';
import { soundManager } from './utils/sound';
import { sectionTargets } from './utils/sectionLinks';

const scrollToSection = (targetId: string, behavior: ScrollBehavior = 'smooth') => {
  const element = document.getElementById(targetId);
  if (!element) return false;

  const headerOffset = 96;
  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
};

export default function App() {
  const [activeDestination, setActiveDestination] = useState<string>('work');
  const [gridActive, setGridActive] = useState<boolean>(true);
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = (toast: { type: ToastType; title: string; message?: string }) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, ...toast }].slice(-4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  };

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  // Smooth navigation handler across the 4 main destinations (Work, Shop, About, Consult)
  const handleNavigate = (destination: string) => {
    setActiveDestination(destination);
    setIsLoading(true);
    
    const targetId = sectionTargets[destination as keyof typeof sectionTargets] || destination;
    window.history.replaceState(null, '', `/#${targetId}`);

    if (scrollToSection(targetId)) {
      window.setTimeout(() => {
        scrollToSection(targetId);
        window.setTimeout(() => setIsLoading(false), 350);
      }, 120);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      notify({
        type: 'success',
        title: 'Website ready',
        message: 'You can search the site from the top toolbar.',
      });
    }, 650);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashNavigation = () => {
      const targetId = window.location.hash.slice(1);
      if (!targetId) return;

      window.setTimeout(() => {
        scrollToSection(targetId, 'auto');
      }, 120);
    };

    handleHashNavigation();
    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, []);

  // Scroll spy to highlight active section in Navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      
      const sections = [
        { id: 'hero', dest: 'work' },
        { id: 'about', dest: 'about' },
        { id: 'ai-architecture', dest: 'work' },
        { id: 'shop', dest: 'shop' },
        { id: 'consult', dest: 'consult' }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveDestination(item.dest);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1015] text-[#f5f4ef] selection:bg-[#bfa37c] selection:text-[#0e1015] font-sans relative antialiased">
      {/* Custom Architectural Cursor */}
      <CustomCursor cursorText={cursorText} />

      {/* Blueprint Grid Background Overlay */}
      <GridOverlay isVisible={gridActive} />

      <PageLoader isVisible={isLoading} />
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      {/* Floating Header & Navigation (Work · Shop · About · Consult) */}
      <Navbar
        activeDestination={activeDestination}
        onNavigate={handleNavigate}
        onNotify={notify}
      />

      {/* Main Experience Stream */}
      <main className="relative z-10">
        {/* SECTION 01: HERO — DARK ENTRANCE */}
        <Hero
          onNavigateWork={() => handleNavigate('work')}
          onNavigateShop={() => handleNavigate('shop')}
          onNavigateExplore={() => handleNavigate('work')}
          onSetCursorText={setCursorText}
        />

        {/* CREDENTIAL STRIP */}
        <CredentialStrip />

        {/* SECTION 05: SHOP — PRODUCT LIBRARY (LIGHT / PRESENTATION BOARDS) */}
        <ShopSection
          onSetCursorText={setCursorText}
          onNavigateConsult={() => handleNavigate('consult')}
        />

        {/* SECTION 03: AI × ARCHITECTURE — DIGITAL LAB (DARK) */}
        <AiArchitecture onNavigateConsultation={() => handleNavigate('consult')} />

        {/* SECTION 07: WORK WITH AHMED — WARM CONSULTATION SPACE (LIGHT) */}
        <ConsultationForm onNotify={notify} />
      </main>

      {/* Timed Masterclass Alert */}
      <MasterclassSection />

      {/* SECTION 02: ABOUT — LIGHT GALLERY */}
      <AboutSection onNavigateConsult={() => handleNavigate('consult')} />

      {/* FOOTER (MINIMALIST STUDIO) */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
