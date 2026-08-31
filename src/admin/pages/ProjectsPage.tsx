import React, { useState } from 'react';
import { useData } from '../../data/DataContext';
import { Plus, Edit2, Trash2, X, Check, UploadCloud } from 'lucide-react';

export default function ProjectsPage() {
  const { data, addItem, updateItem, deleteItem } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Architecture',
    location: '',
    year: new Date().getFullYear().toString(),
    type: '',
    description: '',
    coverImage: '',
    galleryImages: [] as string[],
    featured: false,
    published: true,
  });

  const handleOpenForm = (project?: any) => {
    if (project) {
      setFormData(project);
      setEditingId(project.id);
    } else {
      setFormData({
        title: '',
        category: 'Architecture',
        location: '',
        year: new Date().getFullYear().toString(),
        type: '',
        description: '',
        coverImage: '',
        galleryImages: [],
        featured: false,
        published: true,
      });
      setEditingId(null);
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItem('projects', editingId, formData);
    } else {
      addItem('projects', formData);
    }
    handleCloseForm();
  };

  if (isFormOpen) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h1>
          <button 
            onClick={handleCloseForm}
            className="p-2 bg-[#181a24] border border-white/10 rounded-lg text-[#9a9da8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#14161f] border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Project Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Category</label>
                <select 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="Interior">Interior</option>
                  <option value="Villa">Villa</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Year</label>
                <input 
                  type="text" 
                  value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                  className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Description</label>
              <textarea 
                rows={4}
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Cover Image URL</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="e.g. /images/projects/cover.jpg"
                  value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  className="flex-1 bg-[#0e1015] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#bfa37c]"
                />
                <button type="button" className="px-4 py-2 bg-[#181a24] border border-white/10 rounded-lg text-sm text-white flex items-center gap-2 hover:border-[#bfa37c]">
                  <UploadCloud className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})}
                  className="w-4 h-4 rounded border-white/20 bg-[#0e1015] text-[#bfa37c] focus:ring-[#bfa37c]" 
                />
                <span className="text-sm text-white font-medium">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 rounded border-white/20 bg-[#0e1015] text-[#bfa37c] focus:ring-[#bfa37c]" 
                />
                <span className="text-sm text-white font-medium">Featured</span>
              </label>
            </div>

            <div className="pt-6 flex justify-end gap-3 border-t border-white/10">
              <button 
                type="button" onClick={handleCloseForm}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-sm font-bold uppercase tracking-wider hover:bg-[#181a24] transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#bfa37c] text-[#0e1015] text-sm font-bold uppercase tracking-wider hover:bg-[#d6be9c] transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-[#9a9da8] text-sm">Manage architectural and residential projects.</p>
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-[#bfa37c] text-[#0e1015] rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#d6be9c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="bg-[#14161f] border border-white/10 rounded-2xl overflow-hidden">
        {data.projects.length === 0 ? (
          <div className="p-8 text-center text-[#9a9da8] font-sans">
            No projects found. Click "Add Project" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#0e1015]/50">
                  <th className="p-4 text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Project</th>
                  <th className="p-4 text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-[#9a9da8] uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-[#9a9da8] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.projects.map((project: any) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{project.title}</div>
                      <div className="text-xs text-[#9a9da8]">{project.location} · {project.year}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-[#181a24] border border-white/5 text-[10px] uppercase tracking-wider text-[#bfa37c]">
                        {project.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {project.published ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">Published</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase">Draft</span>
                        )}
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#bfa37c]/10 text-[#bfa37c] text-[10px] font-bold uppercase">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenForm(project)}
                          className="p-2 rounded-lg bg-[#181a24] border border-white/5 text-[#9a9da8] hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this project?')) deleteItem('projects', project.id);
                          }}
                          className="p-2 rounded-lg bg-[#181a24] border border-white/5 text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
