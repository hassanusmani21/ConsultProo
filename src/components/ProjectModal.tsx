import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Compass, Layers, Cpu, CheckCircle2, FileText, Sparkles, MapPin, Calendar, User } from 'lucide-react';
import { Project } from '../types';
import { soundManager } from '../utils/sound';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateConsultation: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onNavigateConsultation }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto bg-black/85 backdrop-blur-md">
        {/* Backdrop Click Close */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0c0d12] border border-white/20 rounded-2xl shadow-2xl z-10 text-[#e8e9ed] no-scrollbar"
        >
          {/* Sticky Close Button */}
          <div className="sticky top-4 right-4 z-20 flex justify-end pr-4 pointer-events-none">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2.5 rounded-full bg-[#13151c]/90 border border-white/20 text-white hover:text-[#c5a880] hover:border-[#c5a880] transition-colors pointer-events-auto shadow-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Image & Headline */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-[#13151c] -mt-12 sm:-mt-14">
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-cover filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0c0d12]/80 border border-white/20 text-[10px] font-mono text-[#c5a880] uppercase tracking-wider mb-2 w-max">
                {project.category} · {project.year}
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base text-[#d4d4ce] font-mono mt-1">
                {project.subtitle}
              </p>
            </div>
          </div>

          {/* Case Study Body */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#13151c] border border-white/10 text-xs font-mono">
              <div className="space-y-1">
                <div className="text-[#8e929b] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>LOCATION</span>
                </div>
                <div className="text-white font-semibold">{project.location}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[#8e929b] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>YEAR</span>
                </div>
                <div className="text-white font-semibold">{project.year}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[#8e929b] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>ROLE</span>
                </div>
                <div className="text-white font-semibold">{project.role}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[#8e929b] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>BIM LOD</span>
                </div>
                <div className="text-white font-semibold">{project.bimSpecs?.lod || 'LOD 300'}</div>
              </div>
            </div>

            {/* Key Metrics if available */}
            {project.metrics && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.metrics.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#13151c] border border-white/10 text-center">
                    <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#c5a880]">
                      {m.value}
                    </div>
                    <div className="text-[11px] font-mono text-[#8e929b] mt-1 uppercase">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Conceptual Narrative */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-display font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                <Compass className="w-5 h-5 text-[#c5a880]" />
                <span>Spatial Concept & Architectural Intent</span>
              </h3>
              <p className="text-sm sm:text-base text-[#d4d4ce] leading-relaxed">
                {project.concept}
              </p>
            </div>

            {/* Contributions Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#13151c] border border-white/10 space-y-3">
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a880]" />
                  Architectural Contribution
                </h4>
                <p className="text-xs sm:text-sm text-[#8e929b] leading-relaxed">
                  {project.architecturalContribution}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#13151c] border border-white/10 space-y-3">
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  Technical & BIM Integration
                </h4>
                <p className="text-xs sm:text-sm text-[#8e929b] leading-relaxed">
                  {project.technicalContribution}
                </p>
              </div>
            </div>

            {/* BIM & AI Specifications */}
            {project.bimSpecs && (
              <div className="p-5 rounded-xl bg-[#181b24] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    BIM & Coordination Specifications
                  </span>
                  <span className="text-[10px] font-mono text-[#8e929b] px-2 py-0.5 rounded bg-[#0c0d12]">
                    {project.bimSpecs.lod}
                  </span>
                </div>

                <p className="text-xs text-[#d4d4ce]">
                  <strong className="text-white">Coordination Notes:</strong> {project.bimSpecs.coordinationNotes}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-mono text-[#8e929b] self-center">MODELED ELEMENTS:</span>
                  {project.bimSpecs.elementsModeled.map((el, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#0c0d12] border border-white/10 text-[10px] font-mono text-white">
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                Visual Documentation & Drawings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#13151c] border border-white/10 group">
                    <img
                      src={imgUrl}
                      alt={`${project.title} documentation ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-lg bg-[#13151c] border border-white/15 text-xs font-mono text-[#8e929b] hover:text-white transition-colors"
              >
                ← Back to All Projects
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  onNavigateConsultation();
                }}
                className="px-6 py-3 rounded-lg bg-[#c5a880] text-[#0c0d12] text-xs font-bold uppercase tracking-wider hover:bg-[#d8be96] active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-[#c5a880]/20"
              >
                <span>Discuss Similar Project With Ahmed</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
