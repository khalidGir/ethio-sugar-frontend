import React, { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { Layout } from '../../components/Layout';
import { Users, Plus, X, Edit, Trash2 } from 'lucide-react';

type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MANAGER' | 'AGRONOMIST' | 'WORKER';
  isActive: boolean;
  createdAt: string;
};

const roleBadgeColor: Record<string, string> = {
  ADMIN: 'bg-amber-400/20 text-amber-800 border border-amber-300',
  MANAGER: 'bg-blue-400/20 text-blue-800 border border-blue-300',
  AGRONOMIST: 'bg-purple-400/20 text-purple-800 border border-purple-300',
  WORKER: 'bg-emerald-400/20 text-emerald-800 border border-emerald-300',
};

export const UsersPage: React.FC = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery(undefined);
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'MANAGER' | 'AGRONOMIST' | 'WORKER'>('ALL');
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'WORKER' as 'ADMIN' | 'MANAGER' | 'AGRONOMIST' | 'WORKER',
  });

  const filteredUsers = users?.filter((u) =>
    filter === 'ALL' ? true : u.role === filter
  );

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (error) return <Layout><ErrorMessage message="Failed to load users" onRetry={() => window.location.reload()} /></Layout>;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Users' }]} />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">{users?.length || 0} users in system</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {(['ALL', 'ADMIN', 'MANAGER', 'AGRONOMIST', 'WORKER'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all min-h-[36px] whitespace-nowrap shrink-0 ${filter === role
                ? 'bg-forest-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              {role === 'ALL' ? 'All Users' : role.charAt(0) + role.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Users table */}
        <div className="card p-0 overflow-hidden">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <EmptyState message="No users found" description="Add users to get started." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header">User</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Joined</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="table-row hover:bg-gray-50">
                      <td className="table-cell font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                            <span className="text-forest-700 text-sm font-bold">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {user.fullName}
                        </div>
                      </td>
                      <td className="table-cell text-gray-600">{user.email}</td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadgeColor[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${user.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New User</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px]"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400 min-h-[44px]"
                  placeholder="Min. 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-forest-400 min-h-[44px] cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                  <option value="WORKER">Worker</option>
                  <option value="AGRONOMIST">Agronomist</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button
                onClick={async () => {
                  if (!newUser.email || !newUser.password || !newUser.fullName) {
                    alert('Please fill in all fields');
                    return;
                  }
                  try {
                    await createUser(newUser).unwrap();
                    setShowModal(false);
                    setNewUser({ email: '', password: '', fullName: '', role: 'WORKER' });
                    refetch();
                  } catch (err) {
                    console.error('Failed to create user:', err);
                    alert('Failed to create user. Please try again.');
                  }
                }}
                disabled={isCreating}
                className="w-full py-2.5 bg-forest-500 text-white rounded-xl font-semibold hover:bg-forest-600 min-h-[44px] disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
