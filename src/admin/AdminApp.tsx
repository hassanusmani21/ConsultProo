import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';

// Pages placeholders
const Interiors = () => <div className="text-white text-2xl font-bold">Interiors Management</div>;
const Ebooks = () => <div className="text-white text-2xl font-bold">Ebooks Management</div>;
const VillaPlans = () => <div className="text-white text-2xl font-bold">Villa Plans Management</div>;
const AiPrompts = () => <div className="text-white text-2xl font-bold">AI Prompts Management</div>;
const Content = () => <div className="text-white text-2xl font-bold">Latest Content Management</div>;
const Masterclass = () => <div className="text-white text-2xl font-bold">Masterclass Management</div>;

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-[#0e1015] flex items-center justify-center text-[#bfa37c]">Loading secure session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="interiors" element={<Interiors />} />
          <Route path="ebooks" element={<Ebooks />} />
          <Route path="villa-plans" element={<VillaPlans />} />
          <Route path="ai-prompts" element={<AiPrompts />} />
          <Route path="content" element={<Content />} />
          <Route path="masterclass" element={<Masterclass />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
