import React, { useMemo, useState } from 'react';
import { Check, Edit2, FileUp, Plus, RotateCcw, Trash2, UploadCloud, X } from 'lucide-react';
import { useData } from '../../data/DataContext';
import { supabase } from '../../lib/supabase';

type FieldType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'list' | 'image' | 'images' | 'file';

interface FieldConfig {
  path: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  accept?: string;
}

interface CollectionConfig {
  title: string;
  description: string;
  collection: string;
  fields: FieldConfig[];
}

const baseProjectFields: FieldConfig[] = [
  { path: 'title', label: 'Title' },
  { path: 'subtitle', label: 'Subtitle' },
  { path: 'category', label: 'Category', type: 'select', options: ['architecture', 'interior', 'ai'] },
  { path: 'year', label: 'Year' },
  { path: 'location', label: 'Location' },
  { path: 'role', label: 'Role' },
  { path: 'thumbnail', label: 'Thumbnail Image', type: 'image' },
  { path: 'heroImage', label: 'Hero Image', type: 'image' },
  { path: 'gallery', label: 'Gallery Images', type: 'images' },
  { path: 'concept', label: 'Concept', type: 'textarea' },
  { path: 'description', label: 'Description', type: 'textarea' },
  { path: 'featured', label: 'Featured', type: 'checkbox' },
  { path: 'published', label: 'Published', type: 'checkbox' },
];

const configs: Record<string, CollectionConfig> = {
  projects: {
    title: 'Projects',
    description: 'Manage portfolio projects shown across architecture, interiors, and AI work.',
    collection: 'projects',
    fields: baseProjectFields,
  },
  interiors: {
    title: 'Interiors',
    description: 'Manage interior-specific portfolio entries and presentation content.',
    collection: 'interiors',
    fields: baseProjectFields,
  },
  ebooks: {
    title: 'Ebooks',
    description: 'Create, update, and delete digital guides in the shop.',
    collection: 'ebooks',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'subtitle', label: 'Subtitle' },
      { path: 'coverImage', label: 'Cover Image', type: 'image' },
      { path: 'description', label: 'Description', type: 'textarea' },
      { path: 'highlights', label: 'Highlights', type: 'list' },
      { path: 'sampleChapters', label: 'Sample Chapters', type: 'list' },
      { path: 'price', label: 'Sale Price' },
      { path: 'compareAtPrice', label: 'Original Price (optional)' },
      { path: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'AED', 'EUR'] },
      { path: 'storagePath', label: 'Secure Product File', type: 'file' },
      { path: 'purchaseUrl', label: 'Purchase URL' },
      { path: 'pagesCount', label: 'Pages Count' },
      { path: 'format', label: 'Format' },
      { path: 'badge', label: 'Badge' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  villaPlans: {
    title: 'Villa Plans',
    description: 'Manage ready-to-buy villa plans, drawing packages, and plan metadata.',
    collection: 'villaPlans',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'planCode', label: 'Plan Code' },
      { path: 'areaSqFt', label: 'Area' },
      { path: 'bedrooms', label: 'Bedrooms', type: 'number' },
      { path: 'bathrooms', label: 'Bathrooms', type: 'number' },
      { path: 'levels', label: 'Levels' },
      { path: 'plotSizes', label: 'Plot Sizes', type: 'list' },
      { path: 'style', label: 'Style' },
      { path: 'previewImage', label: 'Preview Image', type: 'image' },
      { path: 'elevationImage', label: 'Elevation Image', type: 'image' },
      { path: 'floorPlanPreview', label: 'Floor Plan Preview', type: 'image' },
      { path: 'description', label: 'Description', type: 'textarea' },
      { path: 'price', label: 'Sale Price' },
      { path: 'compareAtPrice', label: 'Original Price (optional)' },
      { path: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'AED', 'EUR'] },
      { path: 'purchaseUrl', label: 'Purchase URL' },
      { path: 'status', label: 'Status', type: 'select', options: ['available', 'coming_soon'] },
      { path: 'includes', label: 'Included Files', type: 'list' },
      { path: 'lockedDrawingUrl', label: 'Locked Drawing URL' },
      { path: 'storagePath', label: 'Secure Product File', type: 'file' },
      { path: 'featured', label: 'Featured', type: 'checkbox' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  aiPrompts: {
    title: 'AI Prompts',
    description: 'Manage prompt cards, pricing, preview text, and generation parameters.',
    collection: 'aiPrompts',
    fields: [
      { path: 'code', label: 'Prompt Code' },
      { path: 'title', label: 'Title' },
      { path: 'category', label: 'Category', type: 'select', options: ['ARCHITECTURE', 'INTERIOR DESIGN', 'RENOVATION', 'EXTERIOR', 'MATERIALS', 'LIGHTING', 'VISUALIZATION'] },
      { path: 'type', label: 'Type', type: 'select', options: ['FREE', 'PREMIUM'] },
      { path: 'previewText', label: 'Preview Text', type: 'textarea' },
      { path: 'fullPrompt', label: 'Full Prompt', type: 'textarea' },
      { path: 'thumbnail', label: 'Thumbnail Image', type: 'image' },
      { path: 'resultImage', label: 'Result Image', type: 'image' },
      { path: 'beforeImage', label: 'Before Image', type: 'image' },
      { path: 'videoUrl', label: 'Video URL' },
      { path: 'price', label: 'Sale Price' },
      { path: 'compareAtPrice', label: 'Original Price (optional)' },
      { path: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'AED', 'EUR'] },
      { path: 'purchaseUrl', label: 'Purchase URL' },
      { path: 'storagePath', label: 'Secure Product File', type: 'file' },
      { path: 'workflowStep', label: 'Workflow Step' },
      { path: 'parameters.engine', label: 'Engine' },
      { path: 'parameters.aspectRatio', label: 'Aspect Ratio' },
      { path: 'parameters.lighting', label: 'Lighting' },
      { path: 'parameters.materials', label: 'Materials' },
      { path: 'featured', label: 'Featured', type: 'checkbox' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  latestContent: {
    title: 'Latest Content',
    description: 'Manage videos, tutorials, reels, and content cards.',
    collection: 'latestContent',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'category', label: 'Category', type: 'select', options: ['AI VIDEO', 'PROMPT OF THE WEEK', 'WORKFLOW', 'REVIT TIP'] },
      { path: 'platform', label: 'Platform', type: 'select', options: ['YouTube', 'Instagram', 'Prompt Vault', 'Tutorial'] },
      { path: 'thumbnail', label: 'Thumbnail Image', type: 'image' },
      { path: 'date', label: 'Date Label' },
      { path: 'readOrWatchTime', label: 'Read / Watch Time' },
      { path: 'type', label: 'Type', type: 'select', options: ['video', 'prompt', 'tutorial'] },
      { path: 'url', label: 'External URL' },
      { path: 'summary', label: 'Summary', type: 'textarea' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  learningArticles: {
    title: 'Learning Articles',
    description: 'Manage long-form learning hub articles, takeaways, and article content.',
    collection: 'learningArticles',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'category', label: 'Category', type: 'select', options: ['Architecture', 'BIM & Revit', 'AI Workflows', 'Career'] },
      { path: 'readTime', label: 'Read Time' },
      { path: 'date', label: 'Date' },
      { path: 'summary', label: 'Summary', type: 'textarea' },
      { path: 'coverImage', label: 'Cover Image', type: 'image' },
      { path: 'keyTakeaways', label: 'Key Takeaways', type: 'list' },
      { path: 'content', label: 'Article Paragraphs', type: 'list' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  digitalProducts: {
    title: 'Digital Products',
    description: 'Manage product-library resources, courses, models, and masterclasses.',
    collection: 'digitalProducts',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'category', label: 'Category', type: 'select', options: ['courses', 'prompts', 'models', 'ebooks', 'masterclasses', 'plans'] },
      { path: 'tagline', label: 'Tagline' },
      { path: 'description', label: 'Description', type: 'textarea' },
      { path: 'thumbnail', label: 'Thumbnail Image', type: 'image' },
      { path: 'previewImages', label: 'Preview Images', type: 'images' },
      { path: 'price', label: 'Sale Price' },
      { path: 'compareAtPrice', label: 'Original Price (optional)' },
      { path: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'AED', 'EUR'] },
      { path: 'badge', label: 'Badge' },
      { path: 'specs.format', label: 'Format' },
      { path: 'specs.itemsCount', label: 'Items Count' },
      { path: 'specs.skillLevel', label: 'Skill Level' },
      { path: 'specs.duration', label: 'Duration' },
      { path: 'specs.software', label: 'Software', type: 'list' },
      { path: 'contentHighlights', label: 'Content Highlights', type: 'list' },
      { path: 'promptSnippet', label: 'Prompt Snippet', type: 'textarea' },
      { path: 'linkText', label: 'Link Text' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  featuredPrompts: {
    title: 'Featured Prompts',
    description: 'Manage homepage prompt cards and featured prompt previews.',
    collection: 'featuredPrompts',
    fields: [
      { path: 'title', label: 'Title' },
      { path: 'category', label: 'Category', type: 'select', options: ['ARCHITECTURAL VISUALIZATION', 'INTERIOR DESIGN', 'RENOVATION', 'PARAMETRIC FACADES'] },
      { path: 'image', label: 'Image', type: 'image' },
      { path: 'previewPrompt', label: 'Preview Prompt', type: 'textarea' },
      { path: 'fullPrompt', label: 'Full Prompt', type: 'textarea' },
      { path: 'badge', label: 'Badge', type: 'select', options: ['FREE', 'PREMIUM'] },
      { path: 'engine', label: 'Engine' },
      { path: 'materials', label: 'Materials', type: 'list' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  bimLayers: {
    title: 'BIM Layers',
    description: 'Manage BIM showcase layers, metadata, and coordination statistics.',
    collection: 'bimLayers',
    fields: [
      { path: 'name', label: 'Name' },
      { path: 'lod', label: 'LOD', type: 'select', options: ['LOD 200', 'LOD 300', 'LOD 400'] },
      { path: 'discipline', label: 'Discipline', type: 'select', options: ['Architectural', 'Structural', 'MEP Coordination', 'Documentation'] },
      { path: 'description', label: 'Description', type: 'textarea' },
      { path: 'image', label: 'Image URL' },
      { path: 'tags', label: 'Tags', type: 'list' },
      { path: 'parameters.category', label: 'Parameter Category' },
      { path: 'parameters.family', label: 'Family' },
      { path: 'parameters.fireRating', label: 'Fire Rating' },
      { path: 'parameters.uValue', label: 'U Value' },
      { path: 'parameters.omniClass', label: 'OmniClass' },
      { path: 'parameters.assemblyCode', label: 'Assembly Code' },
      { path: 'clashesDetected', label: 'Clashes Detected', type: 'number' },
      { path: 'clashesResolved', label: 'Clashes Resolved', type: 'number' },
      { path: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
};

const getValue = (item: any, path: string) => {
  return path.split('.').reduce((value, key) => value?.[key], item);
};

const setValue = (item: any, path: string, value: any) => {
  const keys = path.split('.');
  const next = { ...item };
  let cursor = next;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }

    cursor[key] = { ...(cursor[key] ?? {}) };
    cursor = cursor[key];
  });

  return next;
};

const emptyItemFor = (config: CollectionConfig) => {
  return config.fields.reduce((item: any, field) => {
    let value: any = '';
    if (field.type === 'checkbox') value = field.path === 'published';
    if (field.type === 'number') value = 0;
    if (field.type === 'list' || field.type === 'images') value = [];
    if (field.type === 'select') value = field.path === 'currency' ? 'INR' : (field.options?.[0] ?? '');
    return setValue(item, field.path, value);
  }, {});
};

const formatFieldValue = (value: any, field: FieldConfig) => {
  if (field.type === 'list' || field.type === 'images') return Array.isArray(value) ? value.join('\n') : '';
  return value ?? '';
};

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('The file could not be read.'));
  reader.readAsDataURL(file);
});

const getSafeFileExtension = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin';
  return extension.slice(0, 12) || 'bin';
};

interface CrudPageProps {
  collection: keyof typeof configs;
}

export default function CrudPage({ collection }: CrudPageProps) {
  const { data, addItem, updateItem, deleteItem } = useData();
  const config = configs[collection];
  const items = useMemo(() => data[config.collection] ?? [], [data, config.collection]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(() => ({ ...emptyItemFor(config), id: crypto.randomUUID() }));
  const [notice, setNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setFormData({ ...emptyItemFor(config), id: crypto.randomUUID() });
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const updateField = (field: FieldConfig, rawValue: any) => {
    let value = rawValue;
    if (field.type === 'number') value = Number(rawValue);
    if (field.type === 'list' || field.type === 'images') {
      value = Array.isArray(rawValue)
        ? rawValue
        : rawValue.split('\n').map((line: string) => line.trim()).filter(Boolean);
    }
    if (field.type === 'checkbox') value = Boolean(rawValue);
    setFormData((current: any) => setValue(current, field.path, value));
  };

  const handleAssetUpload = async (field: FieldConfig, files: FileList | File[] | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;

    if (selectedFiles.some((file) => file.size > MAX_UPLOAD_BYTES)) {
      setNotice('Each file must be smaller than 3 MB. Use compressed files or paste a hosted URL instead.');
      return;
    }

    try {
      const itemId = formData.id || editingId || crypto.randomUUID();
      let uploadedValues: string[];

      if (!supabase) {
        uploadedValues = await Promise.all(selectedFiles.map(readFileAsDataUrl));
      } else {
        const isPrivateProductFile = field.type === 'file';
        const bucket = isPrivateProductFile ? 'product-files' : 'cms-assets';
        const folder = isPrivateProductFile
          ? (collection === 'ebooks' ? 'ebooks' : collection === 'villaPlans' ? 'villa-plans' : 'prompts')
          : `cms/${collection}`;

        uploadedValues = [];
        for (const file of selectedFiles) {
          const suffix = isPrivateProductFile
            ? getSafeFileExtension(file.name)
            : `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
          const path = isPrivateProductFile ? `${folder}/${itemId}.${suffix}` : `${folder}/${suffix}`;
          const { error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert: true,
            contentType: file.type,
            cacheControl: '3600',
          });
          if (error) throw new Error(`Upload failed: ${error.message}`);
          uploadedValues.push(isPrivateProductFile
            ? path
            : supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl);
        }
      }

      setFormData((current: any) => {
        const nextValue = field.type === 'images'
          ? [...(Array.isArray(getValue(current, field.path)) ? getValue(current, field.path) : []), ...uploadedValues]
          : uploadedValues[0];
        const next = setValue(current, field.path, nextValue);
        return { ...next, id: current.id || itemId };
      });
      setNotice(`${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} uploaded. Save the record to publish the change.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The file could not be uploaded.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateItem(config.collection, editingId, formData);
        setNotice(`${config.title} item updated in Supabase.`);
      } else {
        await addItem(config.collection, formData);
        setNotice(`${config.title} item created in Supabase.`);
        setFormData({ ...emptyItemFor(config), id: crypto.randomUUID() });
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The record could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!window.confirm(`Delete "${item.title || item.name || item.id}"?`)) return;
    try {
      await deleteItem(config.collection, item.id);
      if (editingId === item.id) openCreate();
      setNotice(`${config.title} item deleted from Supabase.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'The record could not be deleted.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{config.title}</h1>
          <p className="mt-1 text-sm text-[#9a9da8]">{config.description}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#bfa37c] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0e1015] transition-colors hover:bg-[#d6be9c]"
        >
          <Plus className="h-4 w-4" />
          <span>New Item</span>
        </button>
      </div>

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} className="text-emerald-200 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14161f]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#bfa37c]">
              Existing Records ({items.length})
            </div>
          </div>
          <div className="max-h-[680px] divide-y divide-white/5 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="p-6 text-sm text-[#9a9da8]">No records yet. Create the first one from the editor.</div>
            ) : (
              items.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4 transition-colors hover:bg-white/[0.03]">
                  {(item.thumbnail || item.coverImage || item.previewImage || item.image) && (
                    <img
                      src={item.thumbnail || item.coverImage || item.previewImage || item.image}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-lg border border-white/10 object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-white">{item.title || item.name || 'Untitled item'}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#9a9da8]">
                      {item.subtitle || item.description || item.summary || item.category || item.id}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.category && (
                        <span className="rounded bg-[#181a24] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#bfa37c]">
                          {item.category}
                        </span>
                      )}
                      {item.published === false ? (
                        <span className="rounded bg-yellow-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-yellow-300">Draft</span>
                      ) : (
                        <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">Published</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg border border-white/10 bg-[#181a24] p-2 text-[#9a9da8] transition-colors hover:text-white"
                      aria-label="Edit item"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg border border-white/10 bg-[#181a24] p-2 text-red-400 transition-colors hover:bg-red-400/10"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#14161f] p-5">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-lg font-bold text-white">{editingId ? 'Edit Record' : 'Create Record'}</div>
              <div className="text-xs text-[#9a9da8]">{editingId ? editingId : 'Saved to the shared Supabase CMS'}</div>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={openCreate}
                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#9a9da8] hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {config.fields.map((field) => {
              const value = getValue(formData, field.path);
              const commonClass = 'w-full rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#bfa37c]';
              const wide = field.type === 'textarea' || field.type === 'list' || field.type === 'images' || field.type === 'image' || field.type === 'file' || field.path.toLowerCase().includes('description') || field.path.toLowerCase().includes('prompt');

              return (
                <div key={field.path} className={`space-y-2 ${wide ? 'md:col-span-2' : ''}`}>
                  {field.type === 'checkbox' ? (
                    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#0e1015] px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => updateField(field, event.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-[#0e1015] text-[#bfa37c] focus:ring-[#bfa37c]"
                      />
                      <span className="text-sm font-bold text-white">{field.label}</span>
                    </label>
                  ) : (
                    <>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#9a9da8]">{field.label}</label>
                      {field.type === 'textarea' || field.type === 'list' || field.type === 'images' ? (
                        <div className="space-y-3">
                          <textarea
                            rows={field.type === 'list' || field.type === 'images' ? 5 : 4}
                            value={formatFieldValue(value, field)}
                            onChange={(event) => updateField(field, event.target.value)}
                            placeholder={field.type === 'list' || field.type === 'images' ? 'One item per line' : field.placeholder}
                            className={`${commonClass} resize-none leading-relaxed`}
                          />
                          {field.type === 'images' && (
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#181a24] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#bfa37c]">
                                <UploadCloud className="h-4 w-4" />
                                <span>Add Images</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(event) => handleAssetUpload(field, event.target.files)}
                                  className="sr-only"
                                />
                              </label>
                              {Array.isArray(value) && value.map((image: string, index: number) => (
                                <img key={`${image}-${index}`} src={image} alt="Gallery preview" className="h-14 w-20 rounded border border-white/10 object-cover" />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : field.type === 'image' || field.type === 'file' ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={value ?? ''}
                            onChange={(event) => updateField(field, event.target.value)}
                            placeholder={field.type === 'image' ? 'Paste an image URL or upload below' : 'Paste a file URL or upload below'}
                            className={commonClass}
                          />
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-[#181a24] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-[#bfa37c]">
                              {field.type === 'image' ? <UploadCloud className="h-4 w-4" /> : <FileUp className="h-4 w-4" />}
                              <span>{field.type === 'image' ? 'Choose Image' : 'Choose File'}</span>
                              <input
                                type="file"
                                accept={field.accept || (field.type === 'image' ? 'image/*' : '*/*')}
                                onChange={(event) => handleAssetUpload(field, event.target.files)}
                                className="sr-only"
                              />
                            </label>
                            {field.type === 'image' && typeof value === 'string' && value && (
                              <img src={value} alt="Preview" className="h-16 w-24 rounded border border-white/10 object-cover" />
                            )}
                            {field.type === 'file' && typeof value === 'string' && value && (
                              <a href={value} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#bfa37c] hover:text-white">
                                Open attached file
                              </a>
                            )}
                          </div>
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          value={value ?? ''}
                          onChange={(event) => updateField(field, event.target.value)}
                          className={commonClass}
                        >
                          {field.options?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          value={value ?? ''}
                          onChange={(event) => updateField(field, event.target.value)}
                          placeholder={field.placeholder}
                          className={commonClass}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={openCreate}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#181a24]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#bfa37c] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#0e1015] transition-colors hover:bg-[#d6be9c]"
            >
              <Check className="h-4 w-4" />
              <span>{editingId ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
