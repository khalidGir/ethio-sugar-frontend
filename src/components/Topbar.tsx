import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-800">
        {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : ''} Portal
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
