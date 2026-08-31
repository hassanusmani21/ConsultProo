import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Briefcase, CheckCircle2, ShieldCheck, ExternalLink, Calendar, MapPin, Layers } from 'lucide-react';
import { experienceTimeline, certificationsArchive } from '../data/experienceData';
import { CertificationItem } from '../types';
import { soundManager } from '../utils/sound';

export const TimelineAndCerts: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<string | null>(certificationsArchive[0].id);

  const handleSelectCert = (id: string) => {
    soundManager.playClick();
    setSelectedCert(selectedCert === id ? null : id);
  };

  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0c0d12] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Experience Timeline */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-2">
              <span className="text-[11px] font-sans font-semibold text-[#a8a8a8] uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-white/10">
                11 / VERIFIED PROFESSIONAL TIMELINE
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-white tracking-tight">
                CAREER EVOLUTION &{' '}
                <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                  Roles.
                </span>
              </h2>
            </div>
            <p className="text-xs font-sans text-[#a8a8a8] leading-[1.6] max-w-sm">
              Authentic trajectory across international architectural studios, BIM coordination practices, and computational research.
            </p>
          </div>

          {/* Architectural Construction Line Timeline */}
          <div className="relative pl-6 sm:pl-8 border-l border-white/15 space-y-12">
            {experienceTimeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative group"
              >
                {/* Construction Marker Knot on the axis */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#13151c] border-2 border-[#c5a880] group-hover:scale-125 group-hover:bg-[#c5a880] transition-all" />

                <div className="p-6 rounded-2xl bg-[#13151c] border border-white/10 hover:border-[#c5a880]/50 transition-all space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-sans font-bold text-[#c5a880] uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#0c0d12] border border-[#c5a880]/30">
                        {item.period}
                      </span>
                      <span className="text-sm font-sans font-bold text-white">{item.role}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-sans text-[#8e929b] tracking-wider uppercase">
                      <span>{item.company}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#d4d4ce]">
                        <MapPin className="w-3 h-3 text-[#c5a880]" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#b5b5b5] font-normal leading-[1.65]">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#d4d4ce] font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tools Strip */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {item.tools.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#0c0d12] border border-white/10 text-[10px] font-mono text-[#8e929b]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Verified Certifications Archive */}
        <div className="space-y-10 pt-10 border-t border-white/10">
          <div className="space-y-2">
            <span className="text-[11px] font-sans font-semibold text-sky-400 uppercase tracking-[0.2em] px-2.5 py-1 rounded bg-[#13151c] border border-sky-500/30">
              12 / VERIFIED LICENSES & CERTIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-extrabold text-white tracking-tight">
              STATUTORY REGISTRATIONS &{' '}
              <span className="font-serif italic font-normal text-[#c5a880] tracking-normal inline-block">
                Credentials.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificationsArchive.map((cert) => {
              const isOpen = selectedCert === cert.id;
              return (
                <div
                  key={cert.id}
                  onClick={() => handleSelectCert(cert.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isOpen
                      ? 'bg-[#181b24] border-[#c5a880] shadow-2xl'
                      : 'bg-[#13151c] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#0c0d12] border border-white/15 text-[10px] font-sans font-semibold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {cert.badge}
                      </span>
                      <span className="text-xs font-sans text-[#8e929b] tracking-wider uppercase">{cert.year}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-sans font-bold text-white leading-snug tracking-tight">
                      {cert.title}
                    </h3>

                    <div className="text-xs font-sans text-[#8e929b] uppercase tracking-wider">
                      ISSUED BY: <span className="text-[#d4d4ce] font-medium">{cert.issuer}</span>
                    </div>

                    <p className="text-xs text-[#b5b5b5] font-normal leading-[1.6]">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                    <div className="text-[10px] font-mono text-[#8e929b]">
                      CREDENTIAL ID: <span className="text-white">{cert.credentialId}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-[#0c0d12] text-[9px] font-mono text-[#8e929b]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
