import React, { createContext, useContext, useState, useEffect } from 'react';
import * as mockData from './mockData';
import { portfolioProjects } from './portfolioData';

// This abstracts the data layer.
// Right now it uses in-memory state based on mockData.
// In the future, this can be swapped with real API calls (e.g. Supabase, Firebase, Node.js API).

interface DataContextType {
  data: any;
  updateData: (collection: string, newData: any) => void;
  addItem: (collection: string, item: any) => void;
  updateItem: (collection: string, id: string, item: any) => void;
  deleteItem: (collection: string, id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState({
    profile: mockData.initialProfile,
    projects: portfolioProjects.map(p => ({ ...p, published: true, featured: true })),
    interiors: mockData.initialInteriors,
    ebooks: mockData.initialEbooks,
    villaPlans: mockData.initialVillaPlans,
    aiPrompts: mockData.initialAiPrompts,
    latestContent: mockData.initialLatestContent,
    masterclass: mockData.initialMasterclass,
  });

  // Load from local storage if exists to persist during UI session
  useEffect(() => {
    const saved = localStorage.getItem('ar_ahmed_cms_data');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ar_ahmed_cms_data', JSON.stringify(data));
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

  return (
    <DataContext.Provider value={{ data, updateData, addItem, updateItem, deleteItem }}>
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
