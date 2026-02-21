import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fields': 'Fields',
  '/incidents': 'Incidents',
  '/irrigation': 'Irrigation Logs',
  '/tasks': 'Tasks',
};

export const Topbar: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const pageLabel = routeLabels[location.pathname] ?? 'EthioSugar';
  const initials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-6"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left: page title */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">{pageLabel}</h2>
        <p className="text-xs text-gray-400 font-medium -mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-500 flex items-center justify-center shadow-glow-green">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-400 leading-tight capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
