import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, FileSearch, Search, X } from 'lucide-react';
import { aiVideosList } from '../data/aiPromptsData';
import { useData } from '../data/DataContext';
import { soundManager } from '../utils/sound';
import { ToastType } from './ToastViewport';

interface SiteSearchProps {
  onNavigate: (destination: string) => void;
  onNotify: (toast: { type: ToastType; title: string; message?: string }) => void;
}

interface SearchItem {
  id: string;
  title: string;
  label: string;
  description: string;
  destination: string;
  keywords: string;
}

export const SiteSearch: React.FC<SiteSearchProps> = ({ onNavigate, onNotify }) => {
  const { data } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  const searchItems = useMemo<SearchItem[]>(() => [
    {
      id: 'profile',
      title: data.profile.name,
      label: 'Profile',
      description: `${data.profile.title}. ${data.profile.bio}`,
      destination: 'about',
      keywords: `${data.profile.location} ${data.profile.email} architecture interior ai about`,
    },
    {
      id: 'consult',
      title: data.sections.consult?.title || 'Consultation & Project Inquiry',
      label: 'Contact',
      description: data.sections.consult?.subtitle || 'Book a consultation for architecture, interiors, AI workflows, villa design, or complete execution.',
      destination: 'consult',
      keywords: 'book consultation contact project timeline design architecture interior execution meeting',
    },
    {
      id: 'masterclass',
      title: data.masterclass.title,
      label: 'Learning',
      description: `${data.masterclass.description} Status: ${data.masterclass.status}.`,
      destination: 'shop',
      keywords: 'course masterclass ai architecture learn training workshop',
    },
    ...data.projects.filter((project: any) => project.published !== false).map((project: any) => ({
      id: project.id,
      title: project.title,
      label: `${project.category} project`,
      description: `${project.subtitle ?? ''}. ${project.concept ?? project.description ?? ''}`,
      destination: 'work',
      keywords: `${project.category} ${project.year} ${project.location} ${project.role ?? ''} ${project.description ?? ''}`,
    })),
    ...data.digitalProducts.filter((product: any) => product.published !== false).map((product: any) => ({
      id: product.id,
      title: product.title,
      label: `${product.category} product`,
      description: `${product.tagline}. ${product.description}`,
      destination: 'shop',
      keywords: `${product.category} ${product.badge ?? ''} ${product.specs?.format ?? ''} ${product.specs?.software?.join(' ') ?? ''} ${product.contentHighlights?.join(' ') ?? ''}`,
    })),
    ...data.aiPrompts.filter((prompt: any) => prompt.published !== false).map((prompt: any) => ({
      id: prompt.id,
      title: prompt.title,
      label: `${prompt.category} prompt`,
      description: `${prompt.previewText} ${prompt.workflowStep ?? ''}`,
      destination: 'work',
      keywords: `${prompt.code} ${prompt.category} ${prompt.type} ${prompt.fullPrompt} ${prompt.parameters?.engine ?? ''} ${prompt.parameters?.materials ?? ''}`,
    })),
    ...aiVideosList.map((video) => ({
      id: video.id,
      title: video.title,
      label: `${video.category} video`,
      description: `AI workflow video${video.duration ? `, ${video.duration}` : ''}.`,
      destination: 'work',
      keywords: `${video.category} ${video.promptId} video visualization architecture interior ai`,
    })),
    ...data.latestContent.filter((item: any) => item.published !== false).map((item: any) => ({
      id: item.id,
      title: item.title,
      label: `${item.platform} ${item.type}`,
      description: item.summary,
      destination: item.platform === 'Prompt Vault' ? 'shop' : 'work',
      keywords: `${item.category} ${item.platform} ${item.date} ${item.readOrWatchTime}`,
    })),
  ], [data]);

  const results = useMemo(() => {
    if (!normalizedQuery) return searchItems.slice(0, 5);

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);

    return searchItems
      .map((item) => {
        const title = item.title.toLowerCase();
        const label = item.label.toLowerCase();
        const haystack = `${item.title} ${item.label} ${item.description} ${item.keywords}`.toLowerCase();
        const score = terms.reduce((total, term) => {
          if (title.includes(term)) return total + 5;
          if (label.includes(term)) return total + 3;
          if (haystack.includes(term)) return total + 1;
          return total;
        }, 0);

        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ item }) => item);
  }, [normalizedQuery, searchItems]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleOpen = () => {
    soundManager.playClick();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundManager.playClick();
    setIsOpen(false);
    setQuery('');
  };

  const handleResultClick = (destination: string, title: string) => {
    setIsOpen(false);
    setQuery('');
    onNotify({
      type: 'success',
      title: 'Result opened',
      message: `Showing ${title}.`,
    });
    onNavigate(destination);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!normalizedQuery) {
      onNotify({
        type: 'info',
        title: 'Search is ready',
        message: 'Type a project, prompt, course, Revit, interior, or consultation keyword.',
      });
      return;
    }

    if (results[0]) {
      handleResultClick(results[0].destination, results[0].title);
      return;
    }

    onNotify({
      type: 'error',
      title: 'No result found',
      message: 'Try architecture, interior, AI, Revit, prompts, shop, or consultation.',
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="relative hidden w-44 items-center sm:flex lg:w-56"
      >
        <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#d6be9c]" />
        <input
          value={query}
          onFocus={handleOpen}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="Search"
          aria-label="Search website"
          className="h-9 w-full rounded-lg border border-[#bfa37c]/30 bg-[#181a24] pl-9 pr-3 text-xs font-semibold text-white outline-none transition-all placeholder:text-[#9a9da8] focus:border-[#d6be9c] focus:bg-[#14161f]"
        />
      </form>

      <button
        type="button"
        onClick={handleOpen}
        title="Search website"
        aria-label="Search website"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#bfa37c]/30 bg-[#181a24] text-[#d6be9c] transition-all hover:border-[#d6be9c] sm:hidden"
      >
        <Search className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[85] bg-[#0e1015]/80 px-4 pt-24 backdrop-blur-md sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-[#14161f] p-3 shadow-2xl shadow-black/50">
                <div className="flex items-center gap-3">
                  <FileSearch className="ml-2 h-5 w-5 shrink-0 text-[#d6be9c]" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search projects, AI prompts, Revit, shop, consultation..."
                    aria-label="Search website"
                    className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-[#777b86] sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close search"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#9a9da8] transition-colors hover:border-[#bfa37c]/40 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="mt-3 grid gap-2" aria-live="polite">
                {results.length > 0 ? (
                  results.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleResultClick(result.destination, result.title)}
                      className="group rounded-xl border border-white/10 bg-[#14161f]/95 p-4 text-left shadow-xl shadow-black/20 transition-all hover:border-[#bfa37c]/40 hover:bg-[#181a24]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d6be9c]">
                            {result.label}
                          </div>
                          <div className="mt-1 text-sm font-bold text-white sm:text-base">{result.title}</div>
                          <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#b8bbc5] sm:text-sm">
                            {result.description}
                          </div>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#d6be9c] transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-red-400/20 bg-[#14161f]/95 p-4 text-sm text-[#c4c6cf]">
                    No matching website result found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
