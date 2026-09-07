import React, { useEffect, useState } from 'react';
import { useData } from '../../data/DataContext';
import { Save, UploadCloud } from 'lucide-react';

export default function ProfilePage() {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState(data.profile);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setFormData(data.profile);
  }, [data.profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateData('profile', formData);
    setIsSaving(false);
    setNotice('Profile updated.');
  };

  const handlePhotoUpload = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setNotice('The profile image must be smaller than 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setFormData((current: any) => ({ ...current, photoUrl: String(reader.result) }));
    reader.onerror = () => setNotice('The profile image could not be read.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile Management</h1>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[#bfa37c] text-[#0e1015] rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#d6be9c] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {notice && <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">{notice}</div>}

      <div className="bg-[#14161f] border border-white/10 rounded-2xl p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Photo Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#0e1015] border border-white/10 overflow-hidden flex items-center justify-center">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#9a9da8] text-xs">No Image</span>
                )}
              </div>
              <div className="flex-1">
                <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#181a24] px-4 py-2 text-sm text-white transition-colors hover:border-[#bfa37c]">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload New Photo</span>
                  <input type="file" accept="image/*" onChange={(event) => handlePhotoUpload(event.target.files?.[0])} className="sr-only" />
                </label>
                <p className="text-xs text-[#9a9da8] mt-2">Recommended: 400x400px JPG or PNG</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Professional Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Bio</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Instagram URL</label>
              <input 
                type="url" 
                value={formData.instagram}
                onChange={e => setFormData({...formData, instagram: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">LinkedIn URL</label>
              <input 
                type="url" 
                value={formData.linkedin}
                onChange={e => setFormData({...formData, linkedin: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
