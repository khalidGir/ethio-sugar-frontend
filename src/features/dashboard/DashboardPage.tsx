import React from 'react';
import { useGetIncidentsQuery, useGetTasksQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import {
  AlertTriangle, BarChart3, Layers, CheckSquare,
  Clock, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const { data: incidents, isLoading: incidentsLoading, error: incidentsError } = useGetIncidentsQuery();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetTasksQuery();

  const isLoading = incidentsLoading || tasksLoading;
  const error = incidentsError || tasksError;

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

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">Operational Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">Live farm status at a glance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Incidents Today"
            value={incidents?.length || 0}
            icon={BarChart3}
            gradient="bg-card-blue"
          />
          <StatCard
            label="Open Incidents"
            value={openIncidents.length}
            icon={AlertTriangle}
            gradient="bg-card-red"
            pulse={openIncidents.length > 0}
          />
          <StatCard
            label="Critical Incidents"
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
