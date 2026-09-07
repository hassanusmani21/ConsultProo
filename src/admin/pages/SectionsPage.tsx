import React, { useEffect, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { useData } from '../../data/DataContext';

const sectionLabels: Record<string, string> = {
  hero: 'Hero',
  shop: 'Shop',
  aiArchitecture: 'AI Architecture',
  consult: 'Consultation',
  about: 'About',
  footer: 'Footer',
};

export default function SectionsPage() {
  const { data, updateData, resetData } = useData();
  const [sections, setSections] = useState(data.sections);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setSections(data.sections);
  }, [data.sections]);

  const updateSection = (key: string, field: string, value: string | boolean) => {
    setSections((current: any) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateData('sections', sections);
    setNotice('Sections updated.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Sections</h1>
          <p className="mt-1 text-sm text-[#9a9da8]">Manage reusable homepage copy and section visibility.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              if (!window.confirm('Reset all CMS data to defaults?')) return;
              resetData();
              setNotice('CMS data reset.');
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#181a24]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset CMS</span>
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#bfa37c] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0e1015] hover:bg-[#d6be9c]"
          >
            <Check className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </div>
      )}

      <div className="grid gap-5">
        {Object.entries(sections).map(([key, section]: [string, any]) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-[#14161f] p-5">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">{sectionLabels[key] || key}</h2>
                <p className="text-xs uppercase tracking-[0.18em] text-[#bfa37c]">{key}</p>
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-white">
                <input
                  type="checkbox"
                  checked={Boolean(section.published)}
                  onChange={(event) => updateSection(key, 'published', event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-[#0e1015] text-[#bfa37c] focus:ring-[#bfa37c]"
                />
                Published
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {['eyebrow', 'title', 'subtitle', 'primaryButton', 'secondaryButton', 'copyright'].map((field) => (
                section[field] !== undefined && (
                  <div key={field} className={field === 'subtitle' || field === 'copyright' ? 'md:col-span-2' : ''}>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#9a9da8]">
                      {field.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {field === 'subtitle' || field === 'copyright' ? (
                      <textarea
                        rows={3}
                        value={section[field]}
                        onChange={(event) => updateSection(key, field, event.target.value)}
                        className="w-full resize-none rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none focus:border-[#bfa37c]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={section[field]}
                        onChange={(event) => updateSection(key, field, event.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none focus:border-[#bfa37c]"
                      />
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
