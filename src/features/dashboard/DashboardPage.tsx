import React from 'react';
import { useGetIncidentsQuery, useGetTasksQuery, useGetUsersQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import {
  AlertTriangle, BarChart3, Layers, CheckSquare,
  Clock, ArrowRight, Users
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  pulse?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, gradient, pulse }) => (
  <div className={`stat-card ${gradient}`}>
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-6 translate-x-6 bg-white/10" />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-white/70 text-sm font-medium mb-1">{label}</p>
        <p className={`text-4xl font-extrabold text-white ${pulse ? 'animate-pulse' : ''}`}>
          {value}
        </p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5.5 h-5.5 text-white" size={22} />
      </div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: incidents, isLoading: incidentsLoading, error: incidentsError } = useGetIncidentsQuery(undefined);
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetTasksQuery(undefined);
  const { data: users } = useGetUsersQuery(undefined);

  const isLoading = incidentsLoading || tasksLoading;
  const error = incidentsError || tasksError;

  // Redirect workers to their dedicated tasks page
  if (user?.role === 'WORKER') {
    return <Navigate to="/my-tasks" replace />;
  }

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load dashboard data"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  const openIncidents = incidents?.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS') || [];
  const pendingTasks = tasks?.filter(t => t.status === 'OPEN') || [];
  const criticalIncidents = incidents?.filter(i => i.severity === 'CRITICAL') || [];
  const criticalTasks = tasks?.filter(t => t.priority === 'CRITICAL' && t.status === 'OPEN') || [];
  const workers = users?.filter(u => u.role === 'WORKER') || [];

  const requiresAttention = {
    critical: criticalIncidents.length + criticalTasks.length,
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">
              {user?.role === 'ADMIN' ? 'Command Center' : 'Field Operations'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {user?.role === 'ADMIN' ? 'System-wide overview and alerts' : 'Manage your fields and team'}
            </p>
          </div>
        </div>

        {/* ADMIN: Critical Alerts Widget */}
        {user?.role === 'ADMIN' && requiresAttention.critical > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-red-800 text-lg">Requires Immediate Attention</h2>
                <p className="text-sm text-red-700 mt-1">
                  {criticalIncidents.length} critical incidents and {criticalTasks.length} critical tasks need action
                </p>
                <div className="flex gap-2 mt-3">
                  <Link
                    to="/incidents"
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
                  >
                    View Incidents
                  </Link>
                  <Link
                    to="/tasks"
                    className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-50"
                  >
                    View Tasks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label={user?.role === 'ADMIN' ? 'Total Incidents' : 'My Incidents'}
            value={incidents?.length || 0}
            icon={BarChart3}
            gradient="bg-card-blue"
          />
          <StatCard
            label="Open Issues"
            value={openIncidents.length}
            icon={AlertTriangle}
            gradient="bg-card-red"
            pulse={openIncidents.length > 0}
          />
          <StatCard
            label="Critical"
            value={criticalIncidents.length}
            icon={Layers}
            gradient="bg-card-red"
            pulse={criticalIncidents.length > 0}
          />
          <StatCard
            label="Pending Tasks"
            value={pendingTasks.length}
            icon={CheckSquare}
            gradient="bg-card-amber"
          />
        </div>

        {/* ADMIN: Worker Activity Section */}
        {user?.role === 'ADMIN' && workers.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title flex items-center gap-2">
                <Users className="w-4 h-4 text-forest-500" />
                Worker Activity
              </h2>
              <Link
                to="/users"
                className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {workers.slice(0, 6).map((worker) => {
                const workerTasks = tasks?.filter(t => t.assignedToId === worker.id) || [];
                const pendingCount = workerTasks.filter(t => t.status === 'OPEN').length;
                const overdueCount = workerTasks.filter(t => 
                  t.status === 'OPEN' && t.dueDate && new Date(t.dueDate) < new Date()
                ).length;
                
                return (
                  <div key={worker.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                        <span className="text-forest-700 text-sm font-bold">
                          {worker.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{worker.fullName}</p>
                        <p className="text-xs text-gray-500">{pendingCount} pending tasks</p>
                      </div>
                      {overdueCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                          ⚠ {overdueCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Latest Incidents
              </h2>
              <Link
                to="/incidents"
                className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {incidents?.slice(0, 5).map((incident) => {
                const isCritical = incident.severity === 'CRITICAL';
                return (
                  <div
                    key={incident.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCritical ? 'bg-red-50 border border-red-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div
                      className={`w-1 self-stretch rounded-full flex-shrink-0 ${isCritical ? 'bg-red-500' : incident.severity === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{incident.type}</p>
                      <p className="text-xs text-gray-500 truncate">{incident.fieldName || 'Unknown Field'}</p>
                    </div>
                    <StatusBadge status={incident.severity} size="sm" />
                  </div>
                );
              })}
              {(!incidents || incidents.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No incidents recorded</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-500" />
                Latest Tasks
              </h2>
              <Link
                to="/tasks"
                className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {tasks?.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 truncate">{task.fieldName || 'Unknown Field'}</p>
                  </div>
                  <StatusBadge status={task.priority} size="sm" />
                </div>
              ))}
              {(!tasks || tasks.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">No tasks assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
