import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  MapPin,
  AlertTriangle,
  Droplets,
  CheckSquare,
  Leaf,
} from 'lucide-react';

const menuItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
  {
    path: '/fields',
    label: 'Fields',
    icon: MapPin,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
  {
    path: '/incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
  {
    path: '/irrigation',
    label: 'Irrigation',
    icon: Droplets,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: CheckSquare,
    roles: ['ADMIN', 'SUPERVISOR', 'WORKER'],
  },
];

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-amber-400/20 text-amber-300 border border-amber-400/30',
  SUPERVISOR: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
  WORKER: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30',
};

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const visibleItems = menuItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col min-h-screen sidebar-scroll overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #0f1f0f 0%, #1a3320 55%, #123810 100%)' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-glow-green flex-shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">EthioSugar</h1>
            <p className="text-white/40 text-xs font-medium">Farm Automation</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-150 relative
                    ${isActive
                      ? 'bg-forest-500/25 text-white'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/6'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-forest-400 rounded-r-full" />
                  )}
                  <Icon
                    className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${isActive ? 'text-forest-400' : 'text-white/40 group-hover:text-white/70'
                      }`}
                    size={18}
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
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white/80 text-xs font-bold">
                {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white/70 text-xs truncate font-medium">
                {user.fullName || user.email}
              </p>
              <span
                className={`mt-0.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadgeColor[user.role] ?? 'bg-white/10 text-white/50'
                  }`}
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
