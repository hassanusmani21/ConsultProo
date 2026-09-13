import React, { createContext, useContext, useEffect, useState } from 'react';
import * as mockData from './mockData';
import { aiPromptsLibrary } from './aiPromptsData';
import { bimShowcaseLayers } from './bimData';
import { ebooksList } from './ebooksData';
import { featuredPromptsList } from './featuredPromptsData';
import { latestContentList } from './latestContentData';
import { learningHubArticles } from './learningHubData';
import { portfolioProjects } from './portfolioData';
import { digitalProducts } from './productsData';
import { villaPlans } from './villaPlansData';
import { supabase } from '../lib/supabase';

interface DataContextType {
  data: any;
  updateData: (collection: string, newData: any) => Promise<void>;
  addItem: (collection: string, item: any) => Promise<void>;
  updateItem: (collection: string, id: string, item: any) => Promise<void>;
  deleteItem: (collection: string, id: string) => Promise<void>;
  resetData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_KEY = 'ar_ahmed_cms_data';
const SINGLETON_COLLECTIONS = new Set(['profile', 'masterclass']);
const PRODUCT_COLLECTIONS = new Set(['ebooks', 'villaPlans', 'aiPrompts', 'digitalProducts']);

const defaultData = {
  profile: mockData.initialProfile,
  projects: portfolioProjects.map(p => ({ ...p, published: true, featured: p.featured ?? true })),
  interiors: portfolioProjects.filter(p => p.category === 'interior').map(p => ({ ...p, published: true })),
  ebooks: ebooksList.map(item => ({ ...item, published: true })),
  villaPlans: villaPlans.map(item => ({ ...item, published: true })),
  aiPrompts: aiPromptsLibrary.map(item => ({ ...item, published: true })),
  latestContent: latestContentList.map(item => ({ ...item, published: true })),
  learningArticles: learningHubArticles.map(item => ({ ...item, published: true })),
  digitalProducts: digitalProducts.map(item => ({ ...item, published: true })),
  featuredPrompts: featuredPromptsList.map(item => ({ ...item, published: true })),
  bimLayers: bimShowcaseLayers.map(item => ({ ...item, published: true })),
  masterclass: mockData.initialMasterclass,
  sections: {
    hero: { title: 'AR. AHMED USMANI', eyebrow: 'Architect · Interior · AI', subtitle: 'Architecture, interiors, BIM, and AI design workflows.', primaryButton: 'View Work', secondaryButton: 'Shop Resources', published: true },
    shop: { title: 'STUDIO SHOP.', eyebrow: 'DIGITAL PRODUCTS & READY DRAWINGS', subtitle: 'Practical guides, structured AI frameworks, and ready-to-build architectural villa drawing sets.', defaultCategory: 'ebooks', published: true },
    aiArchitecture: { title: 'AI ARCHITECTURE.', eyebrow: 'GENERATIVE DESIGN SYSTEMS', subtitle: 'Prompt systems, videos, and architectural AI workflows.', published: true },
    consult: { title: 'WORK WITH AHMED.', eyebrow: 'COMMISSIONS & ADVISORY', subtitle: 'Architecture, interiors, and AI consultation services.', published: true },
    about: { title: 'AHMED USMANI.', eyebrow: 'PRACTICE & PHILOSOPHY', subtitle: 'Bridging the precision of building engineering with the generative possibilities of artificial intelligence.', published: true },
    footer: { title: 'AR. AHMED USMANI', subtitle: 'Architect · Interior · AI', copyright: 'Copyright © 2026 Ar. Ahmed Usmani. All rights reserved.', published: true },
  },
};

const mergeSavedData = (savedData: any) => ({
  ...defaultData,
  ...savedData,
  profile: { ...defaultData.profile, ...(savedData?.profile ?? {}) },
  masterclass: { ...defaultData.masterclass, ...(savedData?.masterclass ?? {}) },
  sections: Object.keys(defaultData.sections).reduce((sections: any, key) => ({
    ...sections,
    [key]: { ...defaultData.sections[key as keyof typeof defaultData.sections], ...(savedData?.sections?.[key] ?? {}) },
  }), {}),
});

const getInitialData = () => {
  if (typeof window === 'undefined') return defaultData;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultData;
  try { return mergeSavedData(JSON.parse(saved)); } catch { return defaultData; }
};

const makeRow = (collection: string, itemId: string, data: any) => ({
  collection,
  item_id: itemId,
  data,
  published: data?.published !== false,
});

const rowsFromData = (source: any) => {
  const rows: any[] = [];
  Object.entries(source).forEach(([collection, value]: [string, any]) => {
    if (collection === 'sections') {
      Object.entries(value).forEach(([itemId, item]) => rows.push(makeRow(collection, itemId, item)));
    } else if (SINGLETON_COLLECTIONS.has(collection)) {
      rows.push(makeRow(collection, 'singleton', value));
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        if (item?.id) rows.push(makeRow(collection, item.id, item));
      });
    }
  });
  return rows;
};

const mergeRemoteRows = (current: any, rows: any[]) => {
  const next = { ...current };
  const grouped = new Map<string, any[]>();
  rows.forEach(row => grouped.set(row.collection, [...(grouped.get(row.collection) ?? []), row]));

  grouped.forEach((collectionRows, collection) => {
    if (collection === 'sections') {
      next.sections = { ...current.sections };
      collectionRows.forEach(row => {
        next.sections[row.item_id] = { ...(current.sections?.[row.item_id] ?? {}), ...(row.data ?? {}) };
      });
    } else if (SINGLETON_COLLECTIONS.has(collection)) {
      next[collection] = { ...(current[collection] ?? {}), ...(collectionRows[0].data ?? {}) };
    } else {
      next[collection] = collectionRows.map(row => row.data);
    }
  });
  return next;
};

const isPaidProduct = (collection: string, item: any) => (
  PRODUCT_COLLECTIONS.has(collection)
  && (collection !== 'aiPrompts' || String(item?.type).toUpperCase() === 'PREMIUM')
  && Number(item?.price) > 0
);

const productStoragePath = (collection: string, item: any) => {
  if (item?.storagePath || item?.pdfStoragePath) return item.storagePath || item.pdfStoragePath;
  const folder = collection === 'ebooks'
    ? 'ebooks'
    : collection === 'villaPlans'
      ? 'villa-plans'
      : collection === 'digitalProducts'
        ? 'courses'
        : 'prompts';
  return `${folder}/${item.id}.pdf`;
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(getInitialData);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    const loadRemoteData = async () => {
      const { data: rows, error } = await supabase
        .from('cms_content')
        .select('collection,item_id,data,published')
        .order('collection')
        .order('item_id');

      if (error) {
        console.error('CMS data could not be loaded:', error.message);
        return;
      }

      let remoteRows = rows ?? [];
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && remoteRows.length === 0) {
        const { data: membership } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (membership) {
          const seedRows = rowsFromData(defaultData);
          const { error: seedError } = await supabase.from('cms_content').upsert(seedRows, { onConflict: 'collection,item_id' });
          if (!seedError) remoteRows = seedRows;
          else console.error('Initial CMS seed failed:', seedError.message);
        }
      }

      if (mounted && remoteRows.length > 0) setData(current => mergeRemoteRows(current, remoteRows));
    };

    void loadRemoteData();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') void loadRemoteData();
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try { setData(mergeSavedData(JSON.parse(event.newValue))); } catch { /* keep current data */ }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const requireSession = async () => {
    if (!supabase) throw new Error('Supabase is not configured. Add the VITE_SUPABASE_* variables to this deployment.');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Your admin session has expired. Please sign in again.');
  };

  const syncProduct = async (collection: string, item: any, activeOverride?: boolean) => {
    if (!supabase || !PRODUCT_COLLECTIONS.has(collection) || !item?.id) return;
    const paid = isPaidProduct(collection, item);
    if (paid && String(item.currency || 'INR').toUpperCase() !== 'INR') {
      throw new Error('Paid Razorpay products must use INR.');
    }

    if (!paid) {
      const { error } = await supabase.from('products').update({ active: false }).eq('id', item.id);
      if (error && error.code !== 'PGRST116') throw new Error(`Product catalog update failed: ${error.message}`);
      return;
    }

    const { error } = await supabase.from('products').upsert({
      id: item.id,
      name: String(item.title || item.name || item.id).trim(),
      price: Number(item.price),
      currency: 'INR',
      storage_path: productStoragePath(collection, item),
      delivery_type: ['pdf', 'video', 'course'].includes(item.deliveryType) ? item.deliveryType : 'pdf',
      active: activeOverride ?? item.published !== false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
    if (error) throw new Error(`Product catalog update failed: ${error.message}`);
  };

  const persistItem = async (collection: string, item: any) => {
    await requireSession();
    if (!supabase) return;
    const itemId = item.id || 'singleton';
    const { error } = await supabase.from('cms_content').upsert(
      makeRow(collection, itemId, item),
      { onConflict: 'collection,item_id' },
    );
    if (error) throw new Error(`CMS save failed: ${error.message}`);
    await syncProduct(collection, item);
  };

  const updateData = async (collection: string, newData: any) => {
    if (collection === 'sections') {
      await requireSession();
      if (supabase) {
        const rows = Object.entries(newData).map(([itemId, item]) => makeRow(collection, itemId, item));
        const { error } = await supabase.from('cms_content').upsert(rows, { onConflict: 'collection,item_id' });
        if (error) throw new Error(`CMS save failed: ${error.message}`);
      }
    } else {
      await persistItem(collection, newData);
    }
    setData((previous: any) => ({ ...previous, [collection]: newData }));
  };

  const addItem = async (collection: string, item: any) => {
    const newItem = { ...item, id: item.id || crypto.randomUUID(), createdAt: item.createdAt || new Date().toISOString() };
    await persistItem(collection, newItem);
    setData((previous: any) => ({ ...previous, [collection]: [...(previous[collection] ?? []), newItem] }));
  };

  const updateItem = async (collection: string, id: string, updatedItem: any) => {
    const existing = (data[collection] ?? []).find((item: any) => item.id === id) ?? {};
    const nextItem = { ...existing, ...updatedItem, id };
    await persistItem(collection, nextItem);
    setData((previous: any) => ({
      ...previous,
      [collection]: (previous[collection] ?? []).map((item: any) => item.id === id ? nextItem : item),
    }));
  };

  const deleteItem = async (collection: string, id: string) => {
    await requireSession();
    if (supabase) {
      const { error } = await supabase.from('cms_content').delete().eq('collection', collection).eq('item_id', id);
      if (error) throw new Error(`CMS delete failed: ${error.message}`);
      if (PRODUCT_COLLECTIONS.has(collection)) {
        const { error: productError } = await supabase.from('products').update({ active: false }).eq('id', id);
        if (productError && productError.code !== 'PGRST116') throw new Error(`Product catalog update failed: ${productError.message}`);
      }
    }
    setData((previous: any) => ({ ...previous, [collection]: (previous[collection] ?? []).filter((item: any) => item.id !== id) }));
  };

  const resetData = async () => {
    await requireSession();
    if (supabase) {
      const { error } = await supabase.from('cms_content').upsert(rowsFromData(defaultData), { onConflict: 'collection,item_id' });
      if (error) throw new Error(`CMS reset failed: ${error.message}`);
      await Promise.all(
        Object.entries(defaultData)
          .filter(([collection]) => PRODUCT_COLLECTIONS.has(collection))
          .flatMap(([collection, items]: [string, any]) => (items as any[]).map(item => syncProduct(collection, item))),
      );
    }
    setData(defaultData);
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  };

  return <DataContext.Provider value={{ data, updateData, addItem, updateItem, deleteItem, resetData }}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
}
