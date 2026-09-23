import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, Copy, Download, Lock, Share2 } from 'lucide-react';
import { CustomCursor } from '../components/CustomCursor';
import { GridOverlay } from '../components/GridOverlay';
import { Navbar } from '../components/Navbar';
import { PriceDisplay } from '../components/PriceDisplay';
import { useData } from '../data/DataContext';
import { AiPromptData } from '../types';
import { getFreePromptCompareAtPrice, getFreePromptDownloadUrl, hasPromptFile } from '../utils/freePromptAccess';
import { productCheckoutRoute } from '../utils/productLinks';
import { getPromptShareUrl } from '../utils/promptLinks';
import { sectionTargets } from '../utils/sectionLinks';
import { soundManager } from '../utils/sound';
import { downloadFileFromUrl } from '../utils/downloadFile';

export default function DirectPromptPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const navigate = useNavigate();
  const { data } = useData();
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isCheckingPrompt, setIsCheckingPrompt] = useState(true);

  const prompt = (data.aiPrompts ?? []).find((item: AiPromptData & { published?: boolean }) => (
    item.id === promptId && item.published !== false
  ));

  useEffect(() => {
    setIsCheckingPrompt(true);
    const timer = window.setTimeout(() => setIsCheckingPrompt(false), 1200);
    return () => window.clearTimeout(timer);
  }, [promptId]);

  const handleNavigate = (destination: string) => {
    const targetId = sectionTargets[destination as keyof typeof sectionTargets] || destination;
    navigate(`/#${targetId}`);
  };

  const handleCopyLink = async () => {
    if (!promptId) return;
    await navigator.clipboard.writeText(getPromptShareUrl(promptId));
    setCopiedLink(true);
    soundManager.playClick();
    window.setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePromptAction = async () => {
    if (!prompt) return;
    if (prompt.type !== 'FREE') {
      soundManager.playClick();
      navigate(productCheckoutRoute('aiPrompts', prompt.id));
      return;
    }

    if (hasPromptFile(prompt)) {
      soundManager.playClick();
      await downloadFileFromUrl(getFreePromptDownloadUrl(prompt), prompt.title);
      return;
    }

    await navigator.clipboard.writeText(prompt.fullPrompt);
    setCopiedPrompt(true);
    soundManager.playClick();
    window.setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e1015] text-[#f5f4ef] selection:bg-[#bfa37c] selection:text-[#0e1015] font-sans relative antialiased overflow-hidden">
      <CustomCursor />
      <GridOverlay isVisible />
      <Navbar activeDestination="shop" onNavigate={handleNavigate} onNotify={() => undefined} />

      <main className="relative z-10 min-h-screen px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {prompt ? (
            <div className="rounded-2xl border border-white/15 bg-[#ffffff] text-[#12141a] shadow-2xl shadow-black/45">
              <div className="flex flex-col gap-3 border-b border-[#12141a]/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#9e825d]">{prompt.code}</span>
                  <span className="text-[#12141a]/20">|</span>
                  <span className="truncate text-xs font-sans font-bold uppercase text-[#4a4d57]">{prompt.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 rounded-lg bg-[#f2eee6] px-3 py-2 text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-[#12141a] transition-all hover:bg-[#ebe7df]"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <Link
                    to="/#shop"
                    className="rounded-lg bg-[#12141a] px-3 py-2 text-[11px] font-sans font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#bfa37c] hover:text-[#12141a]"
                  >
                    Shop
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 items-start gap-6 p-5 sm:grid-cols-12 sm:p-8">
                <div className="sm:col-span-5 aspect-[16/12] overflow-hidden rounded-xl border border-[#12141a]/10 bg-[#ebe7df] shadow-md">
                  <img
                    src={prompt.resultImage}
                    alt={prompt.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="space-y-4 sm:col-span-7">
                  <div>
                    <h1 className="text-2xl font-sans font-bold text-[#12141a] sm:text-3xl">
                      {prompt.title}
                    </h1>
                  </div>

                  <div className="rounded-xl border border-[#12141a]/10 bg-[#faf8f5] p-4">
                    <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9e825d]">Description</div>
                    <p className="mt-2 text-xs leading-relaxed text-[#4a4d57]">
                      {prompt.previewText || prompt.fullPrompt}
                    </p>
                    {prompt.type === 'FREE' && prompt.fullPrompt !== prompt.previewText && (
                      <div className="mt-4 border-t border-[#12141a]/10 pt-4">
                        <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9e825d]">Prompt</div>
                        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-[#4a4d57]">
                          {prompt.fullPrompt}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#12141a]/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                  <span className="block text-[10px] font-sans uppercase tracking-wider text-[#747783]">
                    {prompt.type === 'FREE' ? 'Free Prompt' : 'Premium Prompt Matrix'}
                  </span>
                  <PriceDisplay
                    price={prompt.type === 'FREE' ? 0 : prompt.price || '29'}
                    compareAtPrice={prompt.type === 'FREE' ? getFreePromptCompareAtPrice(prompt) : prompt.compareAtPrice}
                    currency={prompt.currency}
                    currentClassName="text-2xl font-sans font-extrabold text-[#12141a]"
                  />
                </div>

                <button
                  onClick={handlePromptAction}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#12141a] px-6 py-3 text-xs font-sans font-bold uppercase tracking-[0.14em] text-[#ffffff] shadow-xl transition-all hover:bg-[#bfa37c] hover:text-[#12141a] active:scale-95"
                >
                  {prompt.type === 'FREE' ? (
                    copiedPrompt ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Prompt Copied</span>
                      </>
                    ) : hasPromptFile(prompt) ? (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Prompt</span>
                      </>
                    )
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Buy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : isCheckingPrompt ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#ffffff] p-8 text-center text-[#12141a] shadow-2xl shadow-black/45">
              <div className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#9e825d]">
                Prompt Link
              </div>
              <h1 className="mt-3 text-2xl font-sans font-bold">Opening prompt...</h1>
              <p className="mt-2 text-sm text-[#4a4d57]">
                Loading the latest prompt data from the studio library.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#ffffff] p-8 text-center text-[#12141a] shadow-2xl shadow-black/45">
              <div className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#9e825d]">
                Prompt Link
              </div>
              <h1 className="mt-3 text-2xl font-sans font-bold">This prompt is not available.</h1>
              <p className="mt-2 text-sm text-[#4a4d57]">
                The link may be incomplete, unpublished, or still loading from the CMS.
              </p>
              <Link
                to="/#shop"
                className="mt-6 inline-flex rounded-xl bg-[#12141a] px-5 py-3 text-xs font-sans font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#bfa37c] hover:text-[#12141a]"
              >
                Back to Shop
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
