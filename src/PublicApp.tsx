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
import { soundManager } from './utils/sound';

export default function App() {
  const [activeDestination, setActiveDestination] = useState<string>('work');
  const [gridActive, setGridActive] = useState<boolean>(true);
  const [cursorText, setCursorText] = useState<string | undefined>(undefined);

  // Smooth navigation handler across the 4 main destinations (Work, Shop, About, Consult)
  const handleNavigate = (destination: string) => {
    setActiveDestination(destination);
    
    let targetId = destination;
    if (destination === 'work') targetId = 'ai-architecture';
    else if (destination === 'shop') targetId = 'shop';
    else if (destination === 'about') targetId = 'about';
    else if (destination === 'consult') targetId = 'consult';
    else if (destination === 'home') targetId = 'hero';

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

      {/* Floating Header & Navigation (Work · Shop · About · Consult) */}
      <Navbar
        activeDestination={activeDestination}
        onNavigate={handleNavigate}
        gridActive={gridActive}
        onToggleGrid={() => setGridActive(!gridActive)}
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

        {/* SECTION 02: ABOUT — LIGHT GALLERY */}
        <AboutSection onNavigateConsult={() => handleNavigate('consult')} />

        {/* SECTION 03: AI × ARCHITECTURE — DIGITAL LAB (DARK) */}
        <AiArchitecture onNavigateConsultation={() => handleNavigate('consult')} />

        {/* SECTION 07: WORK WITH AHMED — WARM CONSULTATION SPACE (LIGHT) */}
        <ConsultationForm />
      </main>

      {/* Timed Masterclass Alert */}
      <MasterclassSection />

      {/* FOOTER (MINIMALIST STUDIO) */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
