import React, { createContext, useContext, useState, useEffect } from 'react';
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

// This abstracts the data layer.
// Right now it uses in-memory state based on mockData.
// In the future, this can be swapped with real API calls (e.g. Supabase, Firebase, Node.js API).

interface DataContextType {
  data: any;
  updateData: (collection: string, newData: any) => void;
  addItem: (collection: string, item: any) => void;
  updateItem: (collection: string, id: string, item: any) => void;
  deleteItem: (collection: string, id: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_KEY = 'ar_ahmed_cms_data';

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
    hero: {
      title: 'AR. AHMED USMANI',
      eyebrow: 'Architect · Interior · AI',
      subtitle: 'Architecture, interiors, BIM, and AI design workflows.',
      primaryButton: 'View Work',
      secondaryButton: 'Shop Resources',
      published: true,
    },
    shop: {
      title: 'STUDIO SHOP.',
      eyebrow: 'DIGITAL PRODUCTS & READY DRAWINGS',
      subtitle: 'Practical guides, structured AI frameworks, and ready-to-build architectural villa drawing sets.',
      published: true,
    },
    aiArchitecture: {
      title: 'AI ARCHITECTURE.',
      eyebrow: 'GENERATIVE DESIGN SYSTEMS',
      subtitle: 'Prompt systems, videos, and architectural AI workflows.',
      published: true,
    },
    consult: {
      title: 'WORK WITH AHMED.',
      eyebrow: 'COMMISSIONS & ADVISORY',
      subtitle: 'Architecture, interiors, and AI consultation services.',
      published: true,
    },
    about: {
      title: 'AHMED USMANI.',
      eyebrow: 'PRACTICE & PHILOSOPHY',
      subtitle: 'Bridging the precision of building engineering with the generative possibilities of artificial intelligence.',
      published: true,
    },
    footer: {
      title: 'AR. AHMED USMANI',
      subtitle: 'Architect · Interior · AI',
      copyright: 'Copyright © 2026 Ar. Ahmed Usmani. All rights reserved.',
      published: true,
    },
  },
};

const mergeSavedData = (savedData: any) => ({
  ...defaultData,
  ...savedData,
  profile: {
    ...defaultData.profile,
    ...(savedData?.profile ?? {}),
  },
  masterclass: {
    ...defaultData.masterclass,
    ...(savedData?.masterclass ?? {}),
  },
  sections: {
    ...defaultData.sections,
    ...(savedData?.sections ?? {}),
    hero: {
      ...defaultData.sections.hero,
      ...(savedData?.sections?.hero ?? {}),
    },
    shop: {
      ...defaultData.sections.shop,
      ...(savedData?.sections?.shop ?? {}),
    },
    aiArchitecture: {
      ...defaultData.sections.aiArchitecture,
      ...(savedData?.sections?.aiArchitecture ?? {}),
    },
    consult: {
      ...defaultData.sections.consult,
      ...(savedData?.sections?.consult ?? {}),
    },
    about: {
      ...defaultData.sections.about,
      ...(savedData?.sections?.about ?? {}),
    },
    footer: {
      ...defaultData.sections.footer,
      ...(savedData?.sections?.footer ?? {}),
    },
  },
});

const getInitialData = () => {
  if (typeof window === 'undefined') return defaultData;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultData;

  try {
    return mergeSavedData(JSON.parse(saved));
  } catch {
    return defaultData;
  }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(getInitialData);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      if (!event.newValue) {
        setData(defaultData);
        return;
      }

      try {
        setData(mergeSavedData(JSON.parse(event.newValue)));
      } catch {
        setData(defaultData);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persistData = (nextData: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  };

  // Save to local storage on change
  useEffect(() => {
    persistData(data);
  }, [data]);

  const updateData = (collection: string, newData: any) => {
    setData((prev: any) => ({ ...prev, [collection]: newData }));
  };

  const addItem = (collection: string, item: any) => {
    const newItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setData((prev: any) => ({
      ...prev,
      [collection]: [...prev[collection], newItem]
    }));
  };

  const updateItem = (collection: string, id: string, updatedItem: any) => {
    setData((prev: any) => ({
      ...prev,
      [collection]: prev[collection].map((item: any) => item.id === id ? { ...item, ...updatedItem } : item)
    }));
  };

  const deleteItem = (collection: string, id: string) => {
    setData((prev: any) => ({
      ...prev,
      [collection]: prev[collection].filter((item: any) => item.id !== id)
    }));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <DataContext.Provider value={{ data, updateData, addItem, updateItem, deleteItem, resetData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
