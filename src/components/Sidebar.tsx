import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  CheckSquare,
  Leaf,
  Users,
  ClipboardList,
  Beaker,
  Cloud,
  ClipboardCheck,
  Sprout,
  Calendar,
  BarChart3,
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface MenuCategory {
  title: string;
  roles: string[];
  items: {
    path: string;
    label: string;
    icon: React.ElementType;
    roles: string[];
  }[];
}

const menuCategories: MenuCategory[] = [
  // ─── Shared: Overview ───────────────────────────────────────────────────────
  {
    title: 'Overview',
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'] },
    ]
  },

  // ─── Agronomist: Their core science work ─────────────────────────────────── 
  {
    title: 'Agronomy & Environment',
    roles: ['AGRONOMIST', 'MANAGER'],
    items: [
      { path: '/fields',      label: 'Fields',             icon: MapPin,     roles: ['MANAGER'] },
      { path: '/soil',        label: 'Soil Health',         icon: Beaker,     roles: ['MANAGER', 'AGRONOMIST'] },
      { path: '/weather',     label: 'Weather Intelligence',icon: Cloud,      roles: ['MANAGER', 'AGRONOMIST'] },
      { path: '/crop-plans',  label: 'Crop Planning',       icon: Calendar,   roles: ['MANAGER', 'AGRONOMIST'] },
      { path: '/fertilizer',  label: 'Fertilizer',          icon: Sprout,     roles: ['MANAGER', 'AGRONOMIST'] },
    ]
  },

  // ─── Agronomist: Field Intelligence ──────────────────────────────────────── 
  {
    title: 'Field Intelligence',
    roles: ['AGRONOMIST', 'ADMIN'],
    items: [
      { path: '/gallery',    label: 'Image Diagnostics', icon: ImageIcon,    roles: ['ADMIN', 'AGRONOMIST'] },
      { path: '/incidents',  label: 'Incidents',         icon: AlertTriangle, roles: ['ADMIN', 'AGRONOMIST'] },
    ]
  },

  // ─── Agronomist: Analytics & Action ──────────────────────────────────────── 
  {
    title: 'Analytics & Action',
    roles: ['AGRONOMIST', 'ADMIN', 'MANAGER'],
    items: [
      { path: '/approvals', label: 'AI Approvals',      icon: CheckCircle, roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'] },
      { path: '/reports',   label: 'Agronomic Reports', icon: BarChart3,   roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'] },
    ]
  },

  // ─── Worker: Their simplified tools ──────────────────────────────────────── 
  {
    title: 'My Work',
    roles: ['WORKER'],
    items: [
      { path: '/my-tasks',     label: 'My Tasks',    icon: ClipboardList,  roles: ['WORKER'] },
      { path: '/daily-logs',   label: 'Daily Logs',  icon: ClipboardCheck, roles: ['WORKER'] },
      { path: '/report-issue', label: 'Report Issue',icon: AlertTriangle,  roles: ['WORKER'] },
      { path: '/weather',      label: 'Weather',     icon: Cloud,          roles: ['WORKER'] },
      { path: '/gallery',      label: 'Field Photos', icon: ImageIcon,     roles: ['WORKER'] },
    ]
  },

  // ─── Admin/Manager: Operations control room ──────────────────────────────── 
  {
    title: 'Operations',
    roles: ['ADMIN', 'MANAGER'],
    items: [
      { path: '/tasks',      label: 'Tasks',       icon: CheckSquare,    roles: ['ADMIN', 'MANAGER'] },
      { path: '/daily-logs', label: 'Daily Logs',  icon: ClipboardCheck, roles: ['ADMIN', 'MANAGER'] },
      { path: '/fields',     label: 'Fields',      icon: MapPin,         roles: ['ADMIN', 'MANAGER'] },
      { path: '/gallery',    label: 'Image Gallery',icon: ImageIcon,     roles: ['ADMIN', 'MANAGER'] },
      { path: '/weather',    label: 'Weather',     icon: Cloud,          roles: ['ADMIN', 'MANAGER'] },
    ]
  },

  // ─── Manager: Agronomy ──────────────────────────────────────────────────────── 
  {
    title: 'Agronomy',
    roles: ['MANAGER'],
    items: [
      { path: '/incidents',  label: 'Incidents',   icon: AlertTriangle,  roles: ['MANAGER'] },
      { path: '/soil',        label: 'Soil Health',         icon: Beaker,     roles: ['MANAGER'] },
      { path: '/weather',     label: 'Weather Intelligence', icon: Cloud,      roles: ['MANAGER'] },
      { path: '/crop-plans',  label: 'Crop Planning',        icon: Calendar,   roles: ['MANAGER'] },
      { path: '/fertilizer',  label: 'Fertilizer',           icon: Sprout,     roles: ['MANAGER'] },
    ]
  },

  // ─── Admin: Agronomy (full access) ──────────────────────────────────────────── 
  {
    title: 'Agronomy',
    roles: ['ADMIN'],
    items: [
      { path: '/soil',        label: 'Soil Health',         icon: Beaker,     roles: ['ADMIN'] },
      { path: '/crop-plans',  label: 'Crop Planning',        icon: Calendar,   roles: ['ADMIN'] },
      { path: '/fertilizer',  label: 'Fertilizer',           icon: Sprout,     roles: ['ADMIN'] },
    ]
  },

  // ─── Admin only ──────────────────────────────────────────────────────────── 
  {
    title: 'Administration',
    roles: ['ADMIN'],
    items: [
      { path: '/users',           label: 'Users',      icon: Users,       roles: ['ADMIN'] },
      { path: '/admin/audit-logs',label: 'Audit Logs', icon: ShieldCheck, roles: ['ADMIN'] },
    ]
  },
];

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  MANAGER: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
  WORKER: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  AGRONOMIST: 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col min-h-screen sidebar-scroll overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #0f1f0f 0%, #1a3320 55%, #123810 100%)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-glow-green flex-shrink-0">
            <Leaf className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">EthioSugar</h1>
            <p className="text-white/70 text-xs font-medium">Farm Automation</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4" role="navigation" aria-label="Primary navigation">
        {menuCategories
          .filter(cat => user?.role && cat.roles.includes(user.role))
          .map((category, idx) => {
            const visibleItems = category.items.filter(item => user?.role && item.roles.includes(user.role));
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={idx} className="mb-6">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">
                  {category.title}
                </p>
                <ul className="space-y-1" role="menubar">
                  {visibleItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <li key={item.path} role="none">
                        <Link
                          to={item.path}
                          role="menuitem"
                          aria-current={isActive ? 'page' : undefined}
                          className={`
                            group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                            transition-all duration-150 relative min-h-[40px]
                            ${isActive
                              ? 'bg-forest-500/25 text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                            }
                          `}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-forest-400 rounded-r-full" />
                          )}
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-forest-400' : 'text-white/50 group-hover:text-white'
                              }`}
                            aria-hidden="true"
                          />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </nav>

      {/* User role badge */}
      {user && (
        <div className="px-5 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="text-white/80 text-xs font-bold">
                {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-xs truncate font-medium">
                {user.fullName || user.email}
              </p>
              <span
                className={`mt-0.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadgeColor[user.role] ?? 'bg-white/10 text-white/70'
                  }`}
                aria-label={`Role: ${user.role}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
