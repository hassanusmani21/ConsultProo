import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../data/DataContext';
import { uploadAdminFile } from '../../lib/adminUpload';
import { AiPromptData, AiPromptStep } from '../../types';

const emptyCollection = (): AiPromptData => ({
  id: crypto.randomUUID(), code: '', title: '', category: 'ARCHITECTURE', type: 'FREE',
  previewText: '', fullPrompt: '', thumbnail: '', resultImage: '', steps: [], published: true,
});

export default function AiPromptsPage() {
  const { data, addItem, updateItem, deleteItem } = useData();
  const items: AiPromptData[] = data.aiPrompts ?? [];
  const [draft, setDraft] = useState<AiPromptData>(() => emptyCollection());
  const [editing, setEditing] = useState(false);
  const [commonOpen, setCommonOpen] = useState(true);
  const [openStep, setOpenStep] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const edit = (item: AiPromptData) => {
    setDraft({ ...item, steps: item.steps?.length ? [...item.steps].sort((a, b) => a.stepOrder - b.stepOrder) : [{ id: crypto.randomUUID(), stepOrder: 1, promptText: item.fullPrompt || '', thumbnail: item.resultImage || item.thumbnail || '' }] });
    setEditing(true); setCommonOpen(true); setOpenStep(null);
  };
  const addStep = () => {
    const steps = [...(draft.steps ?? [])];
    const step: AiPromptStep = { id: crypto.randomUUID(), stepOrder: steps.length + 1, promptText: '', thumbnail: '' };
    setDraft({ ...draft, steps: [...steps, step] }); setOpenStep(step.id);
  };
  const updateStep = (id: string, values: Partial<AiPromptStep>) => setDraft(current => ({ ...current, steps: (current.steps ?? []).map((step, index) => step.id === id ? { ...step, ...values, stepOrder: index + 1 } : { ...step, stepOrder: index + 1 }) }));
  const removeStep = (id: string) => {
    if (!window.confirm('Remove this prompt step?')) return;
    setDraft(current => ({ ...current, steps: (current.steps ?? []).filter(step => step.id !== id).map((step, index) => ({ ...step, stepOrder: index + 1 })) }));
    setOpenStep(null);
  };
  const moveStep = (index: number, delta: number) => {
    const steps = [...(draft.steps ?? [])];
    const target = index + delta;
    if (target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    setDraft(current => ({ ...current, steps: steps.map((step, order) => ({ ...step, stepOrder: order + 1 })) }));
  };
  const upload = async (file: File | undefined, stepId?: string, kind: 'asset' | 'product' = 'asset') => {
    if (!file) return;
    try {
      const url = import.meta.env.DEV && kind === 'asset'
        ? await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Image could not be read.'));
          reader.onerror = () => reject(new Error('Image could not be read.'));
          reader.readAsDataURL(file);
        })
        : await uploadAdminFile({ kind, collection: 'aiPrompts', itemId: draft.id, file });
      setDraft(current => stepId
        ? { ...current, steps: (current.steps ?? []).map(step => step.id === stepId ? { ...step, thumbnail: url } : step) }
        : { ...current, thumbnail: url });
      setNotice('Image uploaded. Save the collection to keep the change.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Image upload failed.'); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setNotice('');
    try {
      const steps = (draft.steps ?? []).map((step, index) => ({ ...step, stepOrder: index + 1 }));
      const storagePath = pdfFile ? await uploadAdminFile({ kind: 'product', collection: 'aiPrompts', itemId: draft.id, file: pdfFile }) : draft.storagePath;
      const item = { ...draft, storagePath, steps, fullPrompt: steps[0]?.promptText ?? '', resultImage: steps[0]?.thumbnail || draft.thumbnail, updatedAt: new Date().toISOString() };
      if (editing) await updateItem('aiPrompts', item.id, item);
      else await addItem('aiPrompts', { ...item, createdAt: new Date().toISOString() });
      setDraft(emptyCollection()); setEditing(false); setNotice('Prompt collection saved.');
      setPdfFile(null);
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save collection.'); }
    finally { setSaving(false); }
  };
  const startNew = () => { setDraft(emptyCollection()); setEditing(false); setCommonOpen(true); setOpenStep(null); };
  const fieldClass = 'mt-1 w-full rounded-lg border border-white/10 bg-[#0e1015] px-3 py-2 text-sm text-white outline-none focus:border-[#bfa37c]';

  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold text-white">AI Prompts</h1><p className="mt-1 text-sm text-[#9a9da8]">Manage prompt collections and ordered workflow steps.</p></div><button onClick={startNew} className="rounded-lg bg-[#bfa37c] px-4 py-2 text-sm font-bold uppercase text-[#0e1015]">New Collection</button></div>
    {notice && <div role="status" className="rounded-lg border border-white/10 bg-[#14161f] p-3 text-sm text-[#d8be96]">{notice}</div>}
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
      <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#14161f]"><div className="border-b border-white/10 px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#bfa37c]">Prompt Collections ({items.length})</div><div className="divide-y divide-white/10">{items.map(item => <div key={item.id} className="flex min-w-0 items-center gap-3 p-4"><button onClick={() => edit(item)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold text-white">{item.title || 'Untitled collection'}</span><span className="mt-1 block text-xs text-[#9a9da8]">{item.steps?.length || 1} step{(item.steps?.length || 1) === 1 ? '' : 's'} · {item.category}</span></button><button aria-label="Delete collection" onClick={async () => { if (window.confirm(`Delete “${item.title}”?`)) { await deleteItem('aiPrompts', item.id); if (editing && draft.id === item.id) startNew(); } }} className="rounded-lg p-2 text-[#9a9da8] hover:text-red-300"><Trash2 className="h-4 w-4" /></button></div>)}</div></section>
      <form onSubmit={save} className="w-full min-w-0 space-y-3 rounded-2xl border border-white/10 bg-[#14161f] p-4 sm:p-5">
        <section className="overflow-hidden rounded-xl border border-white/10"><button type="button" onClick={() => setCommonOpen(!commonOpen)} className="flex w-full items-center gap-2 bg-[#181a24] px-4 py-3 text-left text-sm font-bold text-white">{commonOpen ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>} Common Information</button>{commonOpen && <div className="grid gap-4 p-4 sm:grid-cols-2">
          <label className="text-xs text-[#9a9da8]">Common Title<input required value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} className={fieldClass}/></label>
          <label className="text-xs text-[#9a9da8]">Category<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as AiPromptData['category'] })} className={fieldClass}>{['ARCHITECTURE','INTERIOR DESIGN','RENOVATION','EXTERIOR','MATERIALS','LIGHTING','VISUALIZATION'].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-xs text-[#9a9da8] sm:col-span-2">Common Description<textarea value={draft.previewText} onChange={e => setDraft({ ...draft, previewText: e.target.value, description: e.target.value })} className={fieldClass} rows={3}/></label>
          <label className="text-xs text-[#9a9da8] sm:col-span-2">Common Thumbnail<input type="url" placeholder="Image URL (or upload below)" value={draft.thumbnail} onChange={e => setDraft({ ...draft, thumbnail: e.target.value })} className={fieldClass}/><input type="file" accept="image/*" onChange={e => void upload(e.target.files?.[0])} className="mt-2 block w-full text-xs text-[#9a9da8]"/></label>
          <label className="text-xs text-[#9a9da8]">Access Type<select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value as AiPromptData['type'] })} className={fieldClass}><option>FREE</option><option>PREMIUM</option></select></label>
          <label className="text-xs text-[#9a9da8]">Prompt Code<input value={draft.code} onChange={e => setDraft({ ...draft, code: e.target.value })} className={fieldClass}/></label>
          <label className="text-xs text-[#9a9da8]">Price<input type="number" min="0" value={draft.price ?? ''} onChange={e => setDraft({ ...draft, price: e.target.value })} className={fieldClass}/></label>
          <label className="text-xs text-[#9a9da8]">Currency<select value={draft.currency || 'INR'} onChange={e => setDraft({ ...draft, currency: e.target.value })} className={fieldClass}>{['INR','USD','AED','EUR','GBP','SGD'].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-xs text-[#9a9da8] sm:col-span-2">Prompt PDF<input type="file" accept="application/pdf,.pdf" onChange={e => setPdfFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs text-[#9a9da8]"/><span className="mt-1 block">{draft.storagePath ? `Current file: ${draft.storagePath}` : 'No PDF attached'}</span></label>
          <label className="flex items-center gap-2 text-xs text-[#9a9da8]"><input type="checkbox" checked={draft.published !== false} onChange={e => setDraft({ ...draft, published: e.target.checked })}/>Published</label>
        </div>}</section>
        <div className="space-y-2">{(draft.steps ?? []).map((step, index) => <section key={step.id} className="overflow-hidden rounded-xl border border-white/10"><div className="flex items-center bg-[#181a24]"><button type="button" onClick={() => setOpenStep(openStep === step.id ? null : step.id)} className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-left text-sm font-bold text-white">{openStep === step.id ? <ChevronDown className="h-4 w-4 shrink-0"/> : <ChevronRight className="h-4 w-4 shrink-0"/>}<span className="shrink-0 whitespace-nowrap">Step {index + 1}</span><span className="min-w-0 flex-1 truncate font-normal text-[#9a9da8]">{step.promptText || 'New prompt step'}</span></button><button type="button" disabled={index === 0} onClick={() => moveStep(index, -1)} aria-label={`Move step ${index + 1} up`} className="p-2 text-[#9a9da8] hover:text-white disabled:opacity-30"><ChevronUp className="h-4 w-4"/></button><button type="button" disabled={index === (draft.steps?.length ?? 0) - 1} onClick={() => moveStep(index, 1)} aria-label={`Move step ${index + 1} down`} className="p-2 text-[#9a9da8] hover:text-white disabled:opacity-30"><ChevronDown className="h-4 w-4"/></button><button type="button" onClick={() => removeStep(step.id)} aria-label={`Remove step ${index + 1}`} className="p-3 text-[#9a9da8] hover:text-red-300"><Trash2 className="h-4 w-4"/></button></div>{openStep === step.id && <div className="grid gap-4 p-4"><label className="text-xs text-[#9a9da8]">Prompt Text<textarea required value={step.promptText} onChange={e => updateStep(step.id, { promptText: e.target.value })} className={fieldClass} rows={7}/></label><label className="text-xs text-[#9a9da8]">Step Thumbnail<input type="url" placeholder="Image URL (or upload below)" value={step.thumbnail} onChange={e => updateStep(step.id, { thumbnail: e.target.value })} className={fieldClass}/><input type="file" accept="image/*" onChange={e => void upload(e.target.files?.[0], step.id)} className="mt-2 block w-full text-xs text-[#9a9da8]"/>{step.thumbnail && <img src={step.thumbnail} alt={`Step ${index + 1}`} loading="lazy" className="mt-3 max-h-44 rounded-lg object-cover"/>}</label></div>}</section>)}</div>
        <button type="button" onClick={addStep} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold uppercase text-[#d8be96] hover:bg-white/5"><Plus className="h-4 w-4"/>Add Step</button>
        <div className="flex justify-end border-t border-white/10 pt-4"><button disabled={saving} className="rounded-lg bg-[#bfa37c] px-5 py-2.5 text-sm font-bold uppercase text-[#0e1015] disabled:opacity-60">{saving ? 'Saving…' : 'Save Collection'}</button></div>
      </form>
    </div>
  </div>;
}
