import React, { useState } from 'react';
import { useData } from '../../data/DataContext';
import { Save, UploadCloud } from 'lucide-react';

export default function ProfilePage() {
  const { data, updateData } = useData();
  const [formData, setFormData] = useState(data.profile);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateData('profile', formData);
      setIsSaving(false);
      alert('Profile updated successfully');
    }, 500);
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
                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-[#181a24] border border-white/10 text-white rounded-lg text-sm hover:border-[#bfa37c] transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload New Photo</span>
                </button>
                <p className="text-xs text-[#9a9da8] mt-2">Recommended: 400x400px JPG or PNG</p>
                {/* Note: File upload logic will be connected to real storage later */}
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
