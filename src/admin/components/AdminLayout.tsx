import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  FolderKanban, 
  Sofa, 
  BookOpen, 
  Home, 
  Wand2, 
  Video, 
  GraduationCap, 
  LogOut,
  Menu,
  X,
  LayoutPanelTop,
  Package,
  Star,
  Layers,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Profile', path: '/admin/profile', icon: UserCircle },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Interiors', path: '/admin/interiors', icon: Sofa },
    { label: 'Ebooks', path: '/admin/ebooks', icon: BookOpen },
    { label: 'Villa Plans', path: '/admin/villa-plans', icon: Home },
    { label: 'AI Prompts', path: '/admin/ai-prompts', icon: Wand2 },
    { label: 'Latest Content', path: '/admin/content', icon: Video },
    { label: 'Learning', path: '/admin/learning', icon: GraduationCap },
    { label: 'Digital Products', path: '/admin/digital-products', icon: Package },
    { label: 'Featured Prompts', path: '/admin/featured-prompts', icon: Star },
    { label: 'BIM Layers', path: '/admin/bim-layers', icon: Layers },
    { label: 'Sections', path: '/admin/sections', icon: LayoutPanelTop },
    { label: 'Masterclass', path: '/admin/masterclass', icon: GraduationCap },
    { label: 'Security', path: '/admin/security', icon: ShieldCheck },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-all ${
              isActive 
                ? 'bg-[#bfa37c] text-[#0e1015] font-bold shadow-md shadow-[#bfa37c]/20' 
                : 'text-[#9a9da8] hover:bg-[#181a24] hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[#0e1015] flex selection:bg-[#bfa37c] selection:text-[#0e1015]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#14161f] border-r border-white/10 h-screen sticky top-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-[#bfa37c]/30 bg-[#181a24] flex items-center justify-center text-[#bfa37c] font-sans font-bold text-sm">
              AU
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wider">AR. AHMED USMANI</div>
              <div className="text-[10px] text-[#bfa37c] tracking-widest uppercase">Admin Portal</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Secure Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#14161f] border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[#bfa37c]/30 bg-[#181a24] flex items-center justify-center text-[#bfa37c] font-sans font-bold text-xs">
            AU
          </div>
          <div className="text-xs font-bold text-white tracking-wider">CMS</div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm pt-20">
          <div className="bg-[#14161f] w-full max-w-xs h-full border-r border-white/10 flex flex-col absolute top-0 left-0 pt-20 pb-4">
            <div className="flex-1 overflow-y-auto px-4 space-y-1">
              <NavLinks />
            </div>
            <div className="p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 lg:pt-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
