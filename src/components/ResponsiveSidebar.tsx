import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  CheckSquare,
  Leaf,
  X,
  Users,
  ClipboardList,
  Beaker,
  Cloud,
  ClipboardCheck,
  Sprout,
  Calendar,
  BarChart3,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';

interface ResponsiveSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  // ADMIN menu items
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/users',
    label: 'Users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: CheckSquare,
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    path: '/incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/fields',
    label: 'Fields',
    icon: MapPin,
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
  },
  // New menu items for Phase 1 Critical Gaps
  {
    path: '/soil',
    label: 'Soil Management',
    icon: Beaker,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/weather',
    label: 'Weather',
    icon: Cloud,
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/daily-logs',
    label: 'Daily Logs',
    icon: ClipboardCheck,
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/fertilizer',
    label: 'Fertilizer',
    icon: Sprout,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/crop-plans',
    label: 'Crop Planning',
    icon: Calendar,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: BarChart3,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/approvals',
    label: 'Approvals',
    icon: CheckCircle,
    roles: ['ADMIN', 'MANAGER', 'AGRONOMIST'],
  },
  {
    path: '/gallery',
    label: 'Image Gallery',
    icon: ImageIcon,
    roles: ['ADMIN', 'MANAGER', 'WORKER', 'AGRONOMIST'],
  },
  {
    path: '/admin/audit-logs',
    label: 'Audit Logs',
    icon: Leaf,
    roles: ['ADMIN'],
  },
  // WORKER menu items (simplified)
  {
    path: '/my-tasks',
    label: 'My Tasks',
    icon: ClipboardList,
    roles: ['WORKER'],
  },
  {
    path: '/report-issue',
    label: 'Report Issue',
    icon: AlertTriangle,
    roles: ['WORKER'],
  },
];

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  MANAGER: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
  WORKER: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
  AGRONOMIST: 'bg-purple-400/20 text-purple-300 border border-purple-400/30',
};

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const visibleItems = menuItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - no standalone hamburger button, it's in Topbar */}
      <aside
        id="mobile-sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64
          transform ${sidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
          lg:transform-none
          transition-transform duration-300 ease-in-out
          flex flex-col min-h-screen
        `}
        style={{ background: 'linear-gradient(180deg, #0f1f0f 0%, #1a3320 55%, #123810 100%)' }}
        role="navigation"
        aria-label="Main navigation"
        aria-hidden={isMobile && !sidebarOpen}
      >
        {/* Close button (mobile only) - high z-index to be visible */}
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors z-[70] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group"
            onClick={isMobile ? closeSidebar : undefined}
          >
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
          <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
            Navigation
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
                    onClick={isMobile ? closeSidebar : undefined}
                    className={`
                      group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                      transition-all duration-150 relative min-h-[44px]
                      ${isActive
                        ? 'bg-forest-500/25 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-forest-400 rounded-r-full" />
                    )}
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-forest-400' : 'text-white/50 group-hover:text-white'
                        }`}
                      aria-hidden="true"
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
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
    </>
  );
};
