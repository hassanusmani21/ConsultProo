import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useData } from '../../data/DataContext';

export default function MasterclassPage() {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState(data.masterclass);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setFormData(data.masterclass);
  }, [data.masterclass]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateData('masterclass', formData);
    setNotice('Masterclass updated.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Masterclass</h1>
          <p className="mt-1 text-sm text-[#9a9da8]">Manage the AI architecture masterclass content block.</p>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#bfa37c] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#0e1015] hover:bg-[#d6be9c]"
        >
          <Check className="h-4 w-4" />
          <span>Save</span>
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#14161f] p-6">
        <div className="grid gap-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none focus:border-[#bfa37c]"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Description</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none focus:border-[#bfa37c]"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9a9da8]">Status</label>
            <input
              type="text"
              value={formData.status}
              onChange={(event) => setFormData({ ...formData, status: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none focus:border-[#bfa37c]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
