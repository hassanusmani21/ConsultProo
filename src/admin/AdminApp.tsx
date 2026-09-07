import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { useAuth } from './auth/AuthContext';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import CrudPage from './pages/CrudPage';
import SectionsPage from './pages/SectionsPage';
import MasterclassPage from './pages/MasterclassPage';
import LoginPage from './pages/LoginPage';

function ProtectedAdmin() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e1015] text-sm font-bold uppercase tracking-[0.18em] text-[#bfa37c]">
        Loading admin...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <AdminLayout />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedAdmin />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="projects" element={<CrudPage collection="projects" />} />
        <Route path="interiors" element={<CrudPage collection="interiors" />} />
        <Route path="ebooks" element={<CrudPage collection="ebooks" />} />
        <Route path="villa-plans" element={<CrudPage collection="villaPlans" />} />
        <Route path="ai-prompts" element={<CrudPage collection="aiPrompts" />} />
        <Route path="content" element={<CrudPage collection="latestContent" />} />
        <Route path="learning" element={<CrudPage collection="learningArticles" />} />
        <Route path="digital-products" element={<CrudPage collection="digitalProducts" />} />
        <Route path="featured-prompts" element={<CrudPage collection="featuredPrompts" />} />
        <Route path="bim-layers" element={<CrudPage collection="bimLayers" />} />
        <Route path="masterclass" element={<MasterclassPage />} />
      </Route>
    </Routes>
  );
}
