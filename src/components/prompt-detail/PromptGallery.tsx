import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

interface PromptGalleryProps {
  images: string[];
  title: string;
  compactViewport?: boolean;
}

export function PromptGallery({ images, title, compactViewport = false }: PromptGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hasMultipleImages = images.length > 1;

  useEffect(() => setActiveIndex(0), [images]);
  if (!images.length) return null;

  const selectImage = (index: number) => setActiveIndex((index + images.length) % images.length);

  return (
    <section aria-label={`${title} gallery`} className={compactViewport ? "flex min-h-0 min-w-0 flex-1 flex-col" : "min-w-0"}>
      <div className={compactViewport ? "relative min-h-0 w-full flex-1 overflow-hidden rounded-2xl bg-[#e7e2d7]" : "relative aspect-[16/9] w-full max-w-none overflow-hidden rounded-2xl bg-[#e7e2d7]"}>
        <img src={images[activeIndex]} alt={`${title} preview ${activeIndex + 1}`} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 flex gap-2">
          <button type="button" aria-label="View image fullscreen" onClick={() => setIsFullscreen(true)} className="rounded-full bg-[#12141a]/85 p-2.5 text-white backdrop-blur transition-colors hover:bg-[#12141a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfa37c]"><Expand className="h-4 w-4" /></button>
        </div>
        {hasMultipleImages && <>
          <button type="button" aria-label="Previous image" onClick={() => selectImage(activeIndex - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-[#12141a]/80 p-2 text-white transition-colors hover:bg-[#12141a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfa37c]"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Next image" onClick={() => selectImage(activeIndex + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#12141a]/80 p-2 text-white transition-colors hover:bg-[#12141a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfa37c]"><ChevronRight className="h-5 w-5" /></button>
          <span className="absolute bottom-3 right-3 rounded-full bg-[#12141a]/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur">{activeIndex + 1} / {images.length}</span>
        </>}
      </div>
      {hasMultipleImages && <div className={compactViewport ? "mt-2 flex w-full shrink-0 gap-2 overflow-x-auto pb-1" : "mt-3 flex w-full gap-2 overflow-x-auto pb-1"} aria-label="Gallery thumbnails">
        {images.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => selectImage(index)} aria-label={`Show image ${index + 1}`} aria-current={activeIndex === index} className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bfa37c] ${activeIndex === index ? 'border-[#bfa37c]' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={image} alt="" className="h-full w-full object-cover" loading="lazy" /></button>)}
      </div>}
      {isFullscreen && <div role="dialog" aria-modal="true" aria-label={`${title} fullscreen image`} className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4" onClick={() => setIsFullscreen(false)}><button type="button" aria-label="Close fullscreen image" onClick={() => setIsFullscreen(false)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X className="h-5 w-5" /></button><img src={images[activeIndex]} alt={`${title} fullscreen preview`} className="max-h-full max-w-full rounded-lg object-contain" onClick={event => event.stopPropagation()} /></div>}
    </section>
  );
}
