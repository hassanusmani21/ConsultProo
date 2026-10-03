import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Copy, Lightbulb, SlidersHorizontal } from 'lucide-react';
import { AiPromptStep } from '../../types';

interface PromptSequenceProps {
  steps: AiPromptStep[];
  promptTitle: string;
  canCopy: boolean;
}

const stepTitle = (step: AiPromptStep, index: number) => step.title || `Prompt step ${index + 1}`;

export function PromptSequenceHeading({ steps }: { steps: AiPromptStep[] }) {
  if (!steps.length) return null;
  return <header className="flex min-w-0 items-baseline justify-between gap-4">
    <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9e825d]">Prompt Sequence</p><h2 id="prompt-sequence-heading" className="mt-1 text-xl font-bold tracking-tight text-[#12141a]">Build the result step by step</h2></div><span className="shrink-0 text-xs font-bold uppercase tracking-[0.13em] text-[#747783]">{steps.length} {steps.length === 1 ? 'step' : 'steps'}</span>
  </header>;
}

export function PromptSequence({ steps, promptTitle, canCopy }: PromptSequenceProps) {
  const [openSteps, setOpenSteps] = useState<Set<string>>(() => new Set(steps[0] ? [steps[0].id] : []));
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  useEffect(() => setOpenSteps(new Set(steps[0] ? [steps[0].id] : [])), [steps]);
  if (!steps.length) return null;

  const copyStep = async (step: AiPromptStep) => {
    await navigator.clipboard.writeText(step.promptText);
    setCopiedStep(step.id);
    window.setTimeout(() => setCopiedStep(current => current === step.id ? null : current), 2000);
  };

  return <section aria-label="Prompt workflow steps" className="mt-4 min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain xl:pr-2">
    <div className="space-y-2">{steps.map((step, index) => <PromptStep key={step.id} step={step} index={index} promptTitle={promptTitle} canCopy={canCopy} isOpen={openSteps.has(step.id)} copied={copiedStep === step.id} onToggle={() => setOpenSteps(current => { const next = new Set(current); next.has(step.id) ? next.delete(step.id) : next.add(step.id); return next; })} onCopy={copyStep} />)}</div>
  </section>;
}

interface PromptStepProps { key?: React.Key; step: AiPromptStep; index: number; promptTitle: string; canCopy: boolean; isOpen: boolean; copied: boolean; onToggle: () => void; onCopy: (step: AiPromptStep) => Promise<void>; }

function PromptStep({ step, index, promptTitle, canCopy, isOpen, copied, onToggle, onCopy }: PromptStepProps) {
  const parameters = Object.entries(step.parameters ?? {}).filter(([, value]) => value !== '');
  const hasPromptPair = Boolean(step.thumbnail && step.promptText);
  const hasDetails = Boolean(step.description || step.negativePrompt || parameters.length || step.notes || step.tips?.length);

  return <article className="overflow-hidden rounded-2xl border border-[#12141a]/10 bg-white">
    <h3><button type="button" onClick={onToggle} aria-expanded={isOpen} aria-controls={`step-panel-${step.id}`} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-[#faf8f5] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#bfa37c]"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-bold ${isOpen ? 'border-[#bfa37c] bg-[#bfa37c] text-white' : 'border-[#bfa37c]/70 text-[#12141a]'}`}>{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-base font-bold text-[#12141a]">{stepTitle(step, index)}</span>{step.subtitle && <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#747783]">{step.subtitle}</span>}</span><ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button></h3>
    {isOpen && <div id={`step-panel-${step.id}`} className="border-t border-[#12141a]/10 p-4 sm:p-5">
      <div className={`grid min-w-0 items-stretch gap-4 ${hasPromptPair ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]' : ''}`}>
        {step.thumbnail && <div className="min-w-0 w-full max-w-full aspect-[16/10] overflow-hidden rounded-xl lg:aspect-auto lg:h-full"><img src={step.thumbnail} alt={`${promptTitle} — ${stepTitle(step, index)}`} loading="lazy" className="block h-full w-full min-w-0 object-cover" /></div>}
        {step.promptText && <PromptBlock text={step.promptText} copied={copied} canCopy={canCopy} onCopy={() => void onCopy(step)} />}
        {hasDetails && <div className={`min-w-0 space-y-3 ${hasPromptPair ? 'lg:col-span-2' : ''}`}>
          {step.description && <p className="rounded-xl bg-[#f2eee6] p-3 text-sm leading-relaxed text-[#4a4d57]">{step.description}</p>}
          {step.negativePrompt && <DetailBlock label="Negative prompt" text={step.negativePrompt} />}
          {parameters.length > 0 && <div className="rounded-xl border border-[#12141a]/10 bg-[#faf8f5] p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9e825d]"><SlidersHorizontal className="h-3.5 w-3.5" />Parameters</div><dl className="mt-2 grid gap-1 text-xs text-[#4a4d57] sm:grid-cols-2">{parameters.map(([name, value]) => <div key={name} className="flex justify-between gap-2 border-b border-[#12141a]/5 py-1"><dt>{name}</dt><dd className="font-medium text-[#12141a]">{String(value)}</dd></div>)}</dl></div>}
          {step.notes && <DetailBlock label="Notes" text={step.notes} />}
          {step.tips && step.tips.length > 0 && <div className="rounded-xl bg-[#f2eee6] p-3"><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9e825d]"><Lightbulb className="h-3.5 w-3.5" />Tips</div><ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#4a4d57]">{step.tips.map(tip => <li key={tip}>{tip}</li>)}</ul></div>}
        </div>}
      </div>
    </div>}
  </article>;
}

function PromptBlock({ text, copied, canCopy, onCopy }: { text: string; copied: boolean; canCopy: boolean; onCopy: () => void }) {
  return <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-[#12141a] p-4 text-white">
    <div className="flex shrink-0 items-center justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d8be96]">Prompt</span>{canCopy && <button type="button" onClick={onCopy} className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors hover:border-[#d8be96] hover:text-[#d8be96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfa37c]">{copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button>}</div>
    <div className="relative mt-3 min-h-0 flex-1 overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-5 after:bg-gradient-to-t after:from-[#12141a] after:to-transparent"><pre className="line-clamp-6 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-white/85">{text}</pre></div>
  </div>;
}

function DetailBlock({ label, text }: { label: string; text: string }) { return <div className="rounded-xl border border-[#12141a]/10 p-3"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9e825d]">{label}</p><p className="mt-1.5 text-xs leading-relaxed text-[#4a4d57]">{text}</p></div>; }
