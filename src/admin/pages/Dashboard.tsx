import React, { useEffect, useState } from 'react';
import { useData } from '../../data/DataContext';
import { Link } from 'react-router-dom';
import { FolderKanban, Sofa, BookOpen, Home, Wand2, Video, ReceiptText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const { data } = useData();
  const [purchaseCount, setPurchaseCount] = useState<number | null>(null);

  useEffect(() => {
    const loadPurchaseCount = async () => {
      if (!supabase) return;
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      setPurchaseCount(count ?? 0);
    };

    void loadPurchaseCount();
  }, []);

  const stats = [
    { label: 'Purchases', count: purchaseCount ?? 0, icon: ReceiptText, link: '/admin/purchases' },
    { label: 'Architecture Projects', count: data.projects.length, icon: FolderKanban, link: '/admin/projects' },
    { label: 'Interior Projects', count: data.interiors.length, icon: Sofa, link: '/admin/interiors' },
    { label: 'Ebooks', count: data.ebooks.length, icon: BookOpen, link: '/admin/ebooks' },
    { label: 'Villa Plans', count: data.villaPlans.length, icon: Home, link: '/admin/villa-plans' },
    { label: 'AI Prompts', count: data.aiPrompts.length, icon: Wand2, link: '/admin/ai-prompts' },
    { label: 'Latest Content', count: data.latestContent.length, icon: Video, link: '/admin/content' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-[#9a9da8] text-sm mt-1">Overview of your content management system.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              to={stat.link}
              className="bg-[#14161f] border border-white/10 p-6 rounded-2xl hover:border-[#bfa37c] transition-colors group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#181a24] border border-white/5 flex items-center justify-center text-[#bfa37c] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.count}</div>
              </div>
              <div className="text-sm font-bold text-[#9a9da8] uppercase tracking-wider group-hover:text-white transition-colors">
                {stat.label}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-[#14161f] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Quick Start Guide</h2>
        <div className="text-sm text-[#9a9da8] space-y-3">
          <p>Welcome to the secure CMS for your website. This architecture separates your content management from the public-facing UI.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Data Layer:</strong> Content and catalog records are stored in Supabase and shared across visitors and admin sessions.</li>
            <li><strong>Images:</strong> Uploaded images use the public CMS asset bucket; paid PDFs use private product storage and secure access links.</li>
            <li><strong>Authentication:</strong> Currently in UI-preview mode. Requires backend JWT/Session validation for production.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
