import React, { useMemo } from 'react';
import { AiPromptData } from '../../types';
import { getPromptSteps } from '../../data/aiPromptLibrary';
import { PromptGallery } from './PromptGallery';
import { PromptSequence, PromptSequenceHeading } from './PromptSequence';

interface PromptDetailProps {
  prompt: AiPromptData;
  onBack?: () => void;
  canCopy?: boolean;
  showHeader?: boolean;
  compactViewport?: boolean;
}

export function PromptDetail({ prompt, onBack, canCopy = prompt.type === 'FREE', showHeader = true, compactViewport = false }: PromptDetailProps) {
  const steps = useMemo(() => getPromptSteps(prompt), [prompt]);
  const images = useMemo(() => Array.from(new Set([...(prompt.images ?? []), prompt.resultImage, prompt.thumbnail, prompt.beforeImage, ...steps.map(step => step.thumbnail)].filter(Boolean))), [prompt, steps]);
  const tags = prompt.tags?.filter(Boolean) ?? [prompt.category, ...(prompt.parameters?.materials?.split(',').slice(0, 3) ?? [])];

  return <article className={compactViewport ? 'flex h-full min-h-0 flex-col overflow-hidden bg-[#faf8f5] text-[#12141a]' : 'min-w-0 rounded-[1.5rem] border border-[#12141a]/10 bg-[#faf8f5] p-4 text-[#12141a] shadow-2xl shadow-black/25 sm:p-6 lg:p-8'}>
    {showHeader && <header className="flex shrink-0 items-start justify-between gap-4 border-b border-[#12141a]/10 pb-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em]"><span className="text-[#9e825d]">Prompts</span><span className="text-[#12141a]/30">/</span><span className="text-[#9e825d]">{prompt.code.replace(/^PROMPT\s*\/\s*/i, '') || '001'}</span><span className="text-[#12141a]/30">/</span><span>{prompt.category}</span></div></div>{onBack && <button type="button" onClick={onBack} className="shrink-0 rounded-full border border-[#12141a]/10 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:border-[#bfa37c] hover:text-[#9e825d]">Back</button>}</header>}
    <div className={compactViewport ? 'grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1.08fr)_minmax(0,0.92fr)] gap-3 pt-3 lg:grid-cols-2 lg:grid-rows-1 lg:gap-5' : 'grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-10'}>
      <section className={compactViewport ? 'flex min-h-0 min-w-0 flex-col' : 'min-w-0'}>
        <div className={compactViewport ? 'shrink-0' : ''}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9e825d] sm:text-xs">{prompt.subtitle || `${steps.length}-step guided workflow`}</p>
          <h1 className={compactViewport ? 'mt-1 line-clamp-2 max-w-[18ch] text-[clamp(1.7rem,3vw,2.8rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#12141a]' : 'mt-3 text-[clamp(2rem,4vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#12141a]'}>{prompt.title}</h1>
          {(prompt.description || prompt.previewText) && <p className={compactViewport ? 'mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-[#4a4d57] sm:text-sm' : 'mt-5 max-w-2xl text-sm leading-relaxed text-[#4a4d57] sm:text-base'}>{prompt.description || prompt.previewText}</p>}
          {tags.length > 0 && <div className={compactViewport ? 'mt-2 flex max-h-10 flex-wrap gap-1.5 overflow-hidden' : 'mt-5 flex flex-wrap gap-2'}>{tags.map(tag => <span key={tag} className={compactViewport ? 'rounded-full bg-[#e7e2d7] px-2.5 py-1 text-[10px] text-[#4a4d57] sm:text-xs' : 'rounded-full bg-[#e7e2d7] px-3 py-1.5 text-xs text-[#4a4d57]'}>{tag}</span>)}</div>}
        </div>
        <div className={compactViewport ? 'mt-2 flex min-h-0 w-full flex-1' : 'mt-7 w-full'}><PromptGallery images={images} title={prompt.title} compactViewport={compactViewport} /></div>
      </section>
      <section className={compactViewport ? 'flex min-h-0 min-w-0 flex-col overflow-hidden' : 'min-w-0 xl:flex xl:h-[calc(100dvh-14rem)] xl:min-h-0 xl:flex-col xl:overflow-hidden'}>
        <PromptSequenceHeading steps={steps} />
        <PromptSequence steps={steps} promptTitle={prompt.title} canCopy={canCopy} compactViewport={compactViewport} />
      </section>
    </div>
  </article>;
}
