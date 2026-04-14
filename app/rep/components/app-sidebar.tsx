'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Workflow,
  BarChart3,
  Target,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Star,
  Building2,
  Ticket
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import NotificationsDropdown from './NotificationsDropdown';

interface RepresentativeSidebarProps {
  userName?: string;
  companyName?: string;
  children?: React.ReactNode;
}

export default function RepresentativeSidebar({
  userName = 'Alex Morgan',
  companyName = 'ISSATSO',
  children
}: RepresentativeSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => pathname === path;

  const menuItems: { title: string; icon: any; path: string; badge?: string | number }[] = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/rep/' },
    { title: 'My Leads', icon: Users, path: '/rep/leads' },
    { title: 'My Pipeline', icon: Workflow, path: '/rep/pipeline' },
    { title: 'Activities', icon: Calendar, path: '/rep/activities' },
    { title: 'Companies', icon: Building2, path: '/rep/companies' },
    { title: 'Contacts', icon: Settings, path: '/rep/contacts' },
    { title: 'Tickets', icon: Ticket, path: '/rep/tickets' }
  ];


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Bouton menu mobile */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      )}

      {/* Overlay mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full
        bg-gradient-to-b from-white to-blue-50/30
        border-r border-gray-200
        shadow-xl
        transition-all duration-300
        z-50
        ${collapsed ? 'w-20' : 'w-64'}
        ${isMobile
          ? mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          : 'translate-x-0'
        }
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">R</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-gray-800">{companyName}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <NotificationsDropdown />
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                {collapsed ?
                  <ChevronRight size={18} className="text-gray-500" /> :
                  <ChevronLeft size={18} className="text-gray-500" />
                }
              </button>
            )}
            {isMobile && mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <ChevronLeft size={18} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-280px)] overflow-y-auto py-4 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                  transition-all relative
                  ${active
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                  ${collapsed && !isMobile ? 'justify-center' : ''}
                `}
                title={collapsed && !isMobile ? item.title : undefined}
              >
                <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />

                {(!collapsed || isMobile) && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 bg-white/50 backdrop-blur-sm p-4">

          {/* Profil */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">Sales Representative</p>
              </div>
            )}
          </div>

          {/* Déconnexion */}
          <button onClick={() => { logout(); router.push('/auth'); }} className={`
            w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition
            ${collapsed && !isMobile ? 'justify-center' : ''}
          `}>
            <LogOut size={16} className="text-gray-400" />
            {(!collapsed || isMobile) && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Contenu principal avec marge automatique */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${!isMobile ? (collapsed ? 'ml-20' : 'ml-64') : 'ml-0'}
        `}
      >
        {children}
      </main>
    </div>
  );
}