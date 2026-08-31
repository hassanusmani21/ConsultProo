import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { useData } from '../data/DataContext';
import { ProjectModal } from './ProjectModal';
import { soundManager } from '../utils/sound';

interface SelectedWorkProps {
  onSetCursorText?: (text?: string) => void;
  onNavigateConsultation?: () => void;
}

export const SelectedWork: React.FC<SelectedWorkProps> = ({ 
  onSetCursorText, 
  onNavigateConsultation
}) => {
  const { data } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter only published and featured projects
  const displayProjects = data.projects.filter((p: any) => p.published && p.featured);

  const handleOpenProject = (proj: Project) => {
    soundManager.playClick();
    setSelectedProject(proj);
  };

  return (
    <section 
      id="work" 
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f7f6f2] text-[#12141a] border-t border-[#12141a]/10 overflow-hidden bg-light-grid"
    >
      {/* Ambient Warm Stone Highlight */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#eee9df] border border-[#bfa37c]/30">
              <span>SELECTED PROJECTS · ARCHITECTURE & INTERIOR</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-[#12141a] tracking-tight leading-[1.0]">
              FEATURED{' '}
              <span className="font-serif italic font-normal text-[#9e825d] tracking-normal">
                WORK.
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#4a4d57] font-normal max-w-md leading-relaxed">
            A curated selection of built residences, luxury interiors, and generative AI concept studies.
          </p>
        </div>

        {/* 2x2 High-Impact Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project: any, idx: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => handleOpenProject(project)}
              onMouseEnter={() => onSetCursorText?.('VIEW')}
              onMouseLeave={() => onSetCursorText?.(undefined)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-[#ffffff] border border-[#12141a]/10 hover:border-[#bfa37c] transition-all flex flex-col justify-between shadow-sm hover:shadow-2xl hover:-translate-y-1 duration-300"
            >
              <div>
                {/* Large Architectural Visual */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe7df]">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover filter contrast-105 group-hover:scale-103 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141a]/85 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded bg-[#ffffff]/95 border border-[#12141a]/10 text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-wider backdrop-blur-md shadow-sm">
                      {project.location} · {project.year}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#ffffff]/95 border border-[#12141a]/15 flex items-center justify-center text-[#12141a] group-hover:bg-[#12141a] group-hover:text-[#ffffff] transition-all backdrop-blur-md shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Project Metadata */}
                <div className="p-6 space-y-2">
                  <div className="text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.16em]">
                    {project.category}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-extrabold text-[#12141a] group-hover:text-[#9e825d] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4a4d57] font-normal leading-relaxed line-clamp-2">
                    {project.concept}
                  </p>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-6 pt-0">
                <div className="pt-3.5 border-t border-[#12141a]/10 flex items-center justify-between text-xs font-sans font-bold text-[#12141a] group-hover:text-[#9e825d] transition-colors">
                  <span className="uppercase tracking-[0.14em]">VIEW PROJECT</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Consult Inquiry */}
        <div className="pt-6 border-t border-[#12141a]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-[#4a4d57]">
            Have a residential or interior project in planning?
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateConsultation?.();
            }}
            className="px-5 py-2.5 rounded-lg bg-[#ffffff] border border-[#12141a]/15 text-[#12141a] hover:bg-[#12141a] hover:text-[#ffffff] text-xs font-sans font-bold uppercase tracking-[0.14em] flex items-center gap-2 transition-all shadow-sm"
          >
            <span>START ARCHITECTURAL CONSULTATION</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9e825d]" />
          </button>
        </div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigateConsultation={onNavigateConsultation || (() => {})}
      />
    </section>
  );
};

