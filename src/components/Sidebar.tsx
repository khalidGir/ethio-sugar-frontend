import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'SUPERVISOR', 'WORKER'] },
  { path: '/fields', label: 'Fields', roles: ['ADMIN', 'SUPERVISOR', 'WORKER'] },
  { path: '/incidents', label: 'Incidents', roles: ['ADMIN', 'SUPERVISOR', 'WORKER'] },
  { path: '/irrigation', label: 'Irrigation', roles: ['ADMIN', 'SUPERVISOR', 'WORKER'] },
  { path: '/tasks', label: 'Tasks', roles: ['ADMIN', 'SUPERVISOR', 'WORKER'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const visibleItems = menuItems.filter((item) =>
    user?.role && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">EthioSugar</h1>
        <p className="text-sm text-gray-400">Farm Automation</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
