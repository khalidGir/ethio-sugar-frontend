import React, { useState } from 'react';
import { useGetDashboardSummaryQuery } from '../../services/api';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { StatusBadge } from '../../components/StatusBadge';
import { Layout } from '../../components/Layout';
import {
  AlertTriangle, BarChart3, Layers, CheckSquare,
  Clock, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_DATA = {
  totalIncidentsToday: 3,
  openIncidents: 5,
  criticalFieldsCount: 2,
  pendingTasksCount: 8,
  latestIncidents: [
    { id: '1', type: 'Pest Detected', fieldName: 'Field A1', severity: 'CRITICAL' as const },
    { id: '2', type: 'Low Moisture', fieldName: 'Field B3', severity: 'WARNING' as const },
    { id: '3', type: 'Equipment Malfunction', fieldName: 'Field C2', severity: 'CRITICAL' as const },
    { id: '4', type: 'Soil Imbalance', fieldName: 'Field D1', severity: 'WARNING' as const },
    { id: '5', type: 'Normal Check', fieldName: 'Field A2', severity: 'NORMAL' as const },
  ],
  latestTasks: [
    { id: '1', title: 'Irrigation Check', fieldName: 'Field A1', priority: 'CRITICAL' as const },
    { id: '2', title: 'Pesticide Application', fieldName: 'Field B3', priority: 'WARNING' as const },
    { id: '3', title: 'Soil Testing', fieldName: 'Field C2', priority: 'NORMAL' as const },
    { id: '4', title: 'Equipment Inspection', fieldName: 'Field D2', priority: 'WARNING' as const },
    { id: '5', title: 'Weekly Field Review', fieldName: 'Field E1', priority: 'NORMAL' as const },
  ],
};

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  pulse?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, gradient, pulse }) => (
  <div className={`stat-card ${gradient}`}>
    {/* bg decoration */}
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
  const { data, isLoading, error } = useGetDashboardSummaryQuery();
  const [useMockData, setUseMockData] = useState(false);

  const dashboardData = useMockData ? MOCK_DATA : data;

  if (isLoading && !useMockData) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error && !useMockData) {
    return (
      <Layout>
        <div className="space-y-4 p-2">
          <ErrorMessage
            message="Failed to load dashboard data"
            onRetry={() => window.location.reload()}
          />
          <button
            onClick={() => setUseMockData(true)}
            className="text-sm text-forest-600 hover:text-forest-700 font-medium underline underline-offset-2"
          >
            Use mock data for demo →
          </button>
        </div>
      </Layout>
    );
  }

  if (!dashboardData) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20 text-gray-400">No data available</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-header">Operational Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">Live farm status at a glance</p>
          </div>
          <button
            onClick={() => setUseMockData(v => !v)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${useMockData
                ? 'bg-forest-50 border-forest-200 text-forest-700'
                : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {useMockData ? '✓ Mock Data' : 'Use Mock Data'}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Incidents Today"
            value={dashboardData.totalIncidentsToday}
            icon={BarChart3}
            gradient="bg-card-blue"
          />
          <StatCard
            label="Open Incidents"
            value={dashboardData.openIncidents}
            icon={AlertTriangle}
            gradient="bg-card-red"
            pulse={dashboardData.openIncidents > 0}
          />
          <StatCard
            label="Critical Fields"
            value={dashboardData.criticalFieldsCount}
            icon={Layers}
            gradient="bg-card-red"
            pulse={dashboardData.criticalFieldsCount > 0}
          />
          <StatCard
            label="Pending Tasks"
            value={dashboardData.pendingTasksCount}
            icon={CheckSquare}
            gradient="bg-card-amber"
          />
        </div>

        {/* Two-column layout for lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Incidents */}
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
              {dashboardData.latestIncidents.map((incident) => {
                const isCritical = incident.severity === 'CRITICAL';
                return (
                  <div
                    key={incident.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCritical ? 'bg-red-50 border border-red-100' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <div
                      className={`w-1 self-stretch rounded-full flex-shrink-0 ${isCritical ? 'bg-red-500' : incident.severity === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-500'
                        }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{incident.type}</p>
                      <p className="text-xs text-gray-500 truncate">{incident.fieldName}</p>
                    </div>
                    <StatusBadge status={incident.severity} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Latest Tasks */}
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
              {dashboardData.latestTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 truncate">{task.fieldName}</p>
                  </div>
                  <StatusBadge status={task.priority} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
