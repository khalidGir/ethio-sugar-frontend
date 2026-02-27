import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/fields': 'Fields',
  '/incidents': 'Incidents',
  '/tasks': 'Tasks',
  '/users': 'Users',
  '/my-tasks': 'My Tasks',
  '/report-issue': 'Report Issue',
};

export const Topbar: React.FC<TopbarProps> = ({
  onMenuClick,
  showMenuButton = false,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const pageLabel = routeLabels[location.pathname] ?? 'EthioSugar';
  const initials = (user?.fullName || user?.email || 'U')
    .split(' ')
    .map((p: string) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}
      role="banner"
      aria-label="Main navigation header"
    >
      {/* Left: menu button + page title */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showMenuButton && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
            aria-expanded="false"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 tracking-tight">{pageLabel}</h2>
          <p className="text-xs text-gray-500 font-medium -mt-0.5 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px]"
          aria-label="View notifications"
          aria-haspopup="true"
        >
          <Bell className="w-5 h-5 text-gray-600" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          <span className="sr-only">Notifications</span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5" role="group" aria-label="User menu">
          <div
            className="w-10 h-10 rounded-xl bg-forest-500 flex items-center justify-center shadow-glow-green flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.fullName || user?.email}
            </p>
            <p className="text-xs text-gray-500 leading-tight capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium transition-colors min-h-[44px]"
          aria-label="Logout from application"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
