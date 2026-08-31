import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Mail, 
  Building2, 
  Compass, 
  Cpu,
  Calendar,
  MessageSquare,
  MapPin,
  ArrowRight,
  Globe
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export const ConsultationForm: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<string>('Architecture & Villa Design');
  const [showCalendlyModal, setShowCalendlyModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Architecture & Villa Design',
    message: ''
  });

  const services = [
    {
      id: 'Architecture & Villa Design',
      num: '01',
      title: 'Architecture & Villa Design',
      desc: 'Complete architectural concept, spatial planning, luxury villas, dimensioned CAD working drawings, and municipal submission sets.',
      icon: Building2
    },
    {
      id: 'Luxury Interior Design',
      num: '02',
      title: 'Luxury Interior Design',
      desc: 'Bespoke residential & penthouse interiors, custom joinery details, material schedules, lighting design, and photorealistic 3D staging.',
      icon: Compass
    },
    {
      id: 'AI / Digital Design Consultation',
      num: '03',
      title: 'AI / Digital Design Consultation',
      desc: '1-on-1 strategy sessions, custom AI prompt matrices, ControlNet pipelines, and design practice acceleration for studios and architects.',
      icon: Cpu
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playGenerativeShimmer();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c5a880', '#ffffff', '#8e929b']
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <section id="consult" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#fbf9f5] text-[#12141a] border-t border-[#12141a]/10 overflow-hidden bg-light-grid">
      {/* Warm Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#bfa37c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#eee9df] border border-[#bfa37c]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMISSIONS & ADVISORY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extrabold text-[#12141a] tracking-tight leading-[1.0]">
              WORK WITH{' '}
              <span className="font-serif italic font-normal text-[#9e825d] tracking-normal">
                AHMED.
              </span>
            </h2>
          </div>

          {/* Location & Remote Availability */}
          <div className="flex items-center gap-3 text-xs font-sans text-[#4a4d57] bg-[#ffffff] px-4 py-2.5 rounded-xl border border-[#12141a]/10 shadow-sm">
            <span className="flex items-center gap-1.5 text-[#12141a] font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#9e825d]" />
              <span>Dubai, UAE</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 text-[#4a4d57]">
              <Globe className="w-3.5 h-3.5" />
              <span>Remote Worldwide</span>
            </span>
          </div>
        </div>

        {/* 3 Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv) => {
            const Icon = srv.icon;
            const isSelected = selectedService === srv.id;
            return (
              <div
                key={srv.id}
                onClick={() => {
                  soundManager.playTick(900);
                  setSelectedService(srv.id);
                  setFormData(prev => ({ ...prev, service: srv.id }));
                }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#ffffff] border-[#9e825d] shadow-xl shadow-[#bfa37c]/15 ring-2 ring-[#9e825d]/20'
                    : 'bg-[#ffffff] border-[#12141a]/10 hover:border-[#9e825d]/50 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-sans font-bold text-[#9e825d] uppercase tracking-[0.2em]">
                      {srv.num}
                    </span>
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-[#9e825d] text-white' : 'bg-[#f4efe6] text-[#4a4d57]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-sans font-bold text-[#12141a] mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#4a4d57] leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#12141a]/10 flex items-center justify-between text-xs font-sans">
                  <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-[#9e825d]' : 'text-[#717582]'}`}>
                    {isSelected ? 'Selected Service' : 'Select Service'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#9e825d]' : 'text-[#717582]'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Booking & Action Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Calendly Direct Call Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowCalendlyModal(true);
            }}
            className="p-4 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#232733] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Calendar className="w-4 h-4 text-[#bfa37c]" />
            <span>BOOK 1-ON-1 CALL</span>
          </button>

          {/* Email Direct */}
          <a
            href="mailto:ar.ahmedusmani@gmail.com?subject=Architectural%20Inquiry%20-%20Ar.%20Ahmed%20Usmani"
            onClick={() => soundManager.playClick()}
            className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/15 text-[#12141a] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:border-[#9e825d] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Mail className="w-4 h-4 text-[#9e825d]" />
            <span>EMAIL DIRECTLY</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/971500000000?text=Hi%20Ar.%20Ahmed,%20I%20would%20like%20to%20inquire%20about%20your%20architectural%20and%20design%20services."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="p-4 rounded-xl bg-[#ffffff] border border-[#12141a]/15 text-[#12141a] font-sans font-bold text-xs uppercase tracking-[0.14em] hover:border-emerald-600 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WHATSAPP INQUIRY</span>
          </a>
        </div>

        {/* Clean Direct Brief Submission */}
        <div className="rounded-2xl bg-[#ffffff] border border-[#12141a]/10 p-6 sm:p-10 shadow-xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 pb-2 border-b border-[#12141a]/10">
                <h3 className="text-xl font-sans font-bold text-[#12141a]">
                  Send Project Brief
                </h3>
                <p className="text-xs text-[#4a4d57] font-sans">
                  Selected Service: <strong className="text-[#9e825d]">{selectedService}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-sans font-bold text-[#12141a] uppercase tracking-wider mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#f7f6f2] border border-[#12141a]/15 text-sm font-sans text-[#12141a] placeholder-[#717582] focus:outline-none focus:border-[#9e825d] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-[#12141a] uppercase tracking-wider mb-2">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-[#f7f6f2] border border-[#12141a]/15 text-sm font-sans text-[#12141a] placeholder-[#717582] focus:outline-none focus:border-[#9e825d] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold text-[#12141a] uppercase tracking-wider mb-2">
                  MESSAGE / PROJECT SCOPE *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share plot size, location, aesthetic preferences, timeline, or consultation objectives..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-[#f7f6f2] border border-[#12141a]/15 text-sm font-sans text-[#12141a] placeholder-[#717582] focus:outline-none focus:border-[#9e825d] resize-none leading-relaxed transition-colors"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#4a4d57] font-sans">
                  Direct review by Ar. Ahmed Usmani within 24 hours.
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#232733] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>SEND BRIEF</span>
                  <ArrowRight className="w-4 h-4 text-[#bfa37c]" />
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#eee9df] border border-[#9e825d] flex items-center justify-center text-[#9e825d] mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-sans font-extrabold text-[#12141a]">
                  Brief Transmitted Successfully
                </h3>
                <p className="text-sm text-[#4a4d57] max-w-md mx-auto">
                  Thank you, <strong className="text-[#12141a]">{formData.name}</strong>. Ahmed will review your {selectedService.toLowerCase()} inquiry and respond with scheduling details.
                </p>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSubmitted(false);
                    setFormData({ name: '', email: '', service: 'Architecture & Villa Design', message: '' });
                  }}
                  className="px-6 py-3 rounded-xl bg-[#ffffff] border border-[#12141a]/15 text-xs font-sans font-bold text-[#12141a] hover:border-[#9e825d]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Calendly Simulation Modal */}
      {showCalendlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setShowCalendlyModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-[#ffffff] border border-[#12141a]/15 rounded-2xl p-6 sm:p-8 z-10 space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#12141a]/10">
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#9e825d] uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>1-ON-1 ARCHITECTURAL DISCOVERY CALL</span>
              </div>
              <button
                onClick={() => setShowCalendlyModal(false)}
                className="text-[#717582] hover:text-[#12141a]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-sans text-[#4a4d57] leading-relaxed">
                Schedule a private 30-minute video session with <strong className="text-[#12141a]">Ar. Ahmed Usmani</strong> to discuss your plot feasibility, interior renovation, or studio AI integration.
              </p>

              <div className="p-4 rounded-xl bg-[#f7f6f2] border border-[#12141a]/10 space-y-2 text-xs font-sans text-[#4a4d57]">
                <div className="flex items-center justify-between">
                  <span>Duration:</span>
                  <span className="text-[#12141a] font-bold">30 Minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform:</span>
                  <span className="text-[#12141a] font-bold">Google Meet / Zoom</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Timezone:</span>
                  <span className="text-[#12141a] font-bold">Gulf Standard Time (GST / Dubai)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCalendlyModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f7f6f2] hover:bg-[#eee9df] text-xs font-sans text-[#4a4d57] uppercase tracking-wider"
              >
                Close
              </button>
              <a
                href="mailto:ar.ahmedusmani@gmail.com?subject=Book%201-on-1%20Discovery%20Call"
                onClick={() => setShowCalendlyModal(false)}
                className="px-5 py-2.5 rounded-lg bg-[#12141a] text-[#ffffff] font-sans font-bold text-xs uppercase tracking-wider hover:bg-[#232733] transition-all"
              >
                Confirm Call Request
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};
