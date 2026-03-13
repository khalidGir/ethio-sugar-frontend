import React, { useState } from 'react';
import {
  useGetPriorityItemsQuery,
  useGetDashboardSummaryQuery,
  useGetIncidentsQuery,
  useGetTasksQuery,
} from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Layout } from '../../components/Layout';
import {
  AlertTriangle, BarChart3, CheckSquare, Clock, ArrowRight,
  Users, TrendingUp, TrendingDown, Sprout, Droplets, Sun,
  CloudRain, CheckCircle, XCircle, FileText, Brain
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { AIRecommendationCard, AIRecommendation } from '../../components/AIRecommendationCard';

// Metric Card with Trends
interface MetricCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: React.ElementType;
  color: 'red' | 'amber' | 'green' | 'blue' | 'purple';
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title, value, trend, icon: Icon, color, onClick
}) => {
  const colorClasses = {
    red: 'bg-red-50 text-red-700 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };

  return (
    <div
      onClick={onClick}
      className={`
        card cursor-pointer transition-all duration-200
        hover:shadow-md hover:scale-[1.02]
        border ${colorClasses[color]}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend < 0 ? (
                <TrendingDown className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-xs font-semibold ${trend < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend < 0 ? '↓' : '↑'} {Math.abs(trend)}%
              </span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// Priority Alert Banner
interface PriorityBannerProps {
  items: any[];
  type: 'critical' | 'warning' | 'info';
}

const PriorityBanner: React.FC<PriorityBannerProps> = ({ items, type }) => {
  const typeStyles = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const typeIcons = {
    critical: AlertTriangle,
    warning: AlertTriangle,
    info: FileText,
  };

  const Icon = typeIcons[type];

  return (
    <div className={`border-2 rounded-2xl p-4 ${typeStyles[type]}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Requires Immediate Attention</h2>
          <p className="text-sm mt-1 opacity-90">
            {items.length} item{items.length !== 1 ? 's' : ''} need your action
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {items.slice(0, 3).map((item: any, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-white rounded-lg text-sm font-semibold shadow-sm"
              >
                {item.type || item.title}
              </span>
            ))}
            {items.length > 3 && (
              <span className="px-3 py-1.5 bg-white/50 rounded-lg text-sm font-semibold">
                +{items.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Recommended Action Card
interface RecommendedActionCardProps {
  action: any;
  onClick: () => void;
}

const RecommendedActionCard: React.FC<RecommendedActionCardProps> = ({ action, onClick }) => {
  const urgencyColors = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
    MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
    LOW: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const typeIcons: Record<string, React.ElementType> = {
    INCIDENT_RESPONSE: AlertTriangle,
    IRRIGATION: Droplets,
    VERIFY_LOGS: CheckCircle,
    FERTILIZATION: Sprout,
    PEST_CONTROL: AlertTriangle,
  };

  const Icon = typeIcons[action.type] || FileText;

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-forest-400 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${urgencyColors[action.urgency]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{action.type.replace(/_/g, ' ')}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${urgencyColors[action.urgency]}`}>
              {action.urgency}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{action.reason}</p>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" />
            {action.field || 'All Fields'}
          </p>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'overview' | 'weather' | 'soil' | 'ai-insights' | 'budget'>('overview');
  
  // Mock AI Recommendations data
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'ai-1',
      title: 'Maize Leaf Spot Risk High',
      source: 'DeepSeek',
      confidence: 87,
      justification: 'Image patterns in Field C match Maize Leaf Spot markers. Weather forecast indicates 85% humidity over the next 3 days, accelerating fungal spread.',
      actionRequired: 'Apply Fungicide X within 48 hours.',
      status: 'PENDING'
    },
    {
      id: 'ai-2',
      title: 'Irrigation Delay Recommended',
      source: 'Gemini',
      confidence: 94,
      justification: 'Rainfall forecast indicates 15mm of rain within the next 24 hours. Soil moisture currently adequate.',
      actionRequired: 'Postpone scheduled irrigation by 48 hours.',
      status: 'APPROVED'
    },
    {
      id: 'ai-3',
      title: 'Nitrogen Deficiency Alert',
      source: 'Custom AI',
      confidence: 76,
      justification: 'Recent soil sensor data shows N dropping below optimal 1.0% in Field B. Correlates with vegetative growth stage.',
      actionRequired: 'Apply 35 kg/ha Urea split application.',
      status: 'PENDING'
    }
  ]);

  const handleApproveAI = (id: string) => {
    setAiRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'APPROVED' } : rec));
  };
  
  const handleRejectAI = (id: string) => {
    setAiRecommendations(prev => prev.map(rec => rec.id === id ? { ...rec, status: 'REJECTED' } : rec));
  };

  // Fetch priority items
  const { data: priorityData, isLoading: priorityLoading } = useGetPriorityItemsQuery();
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummaryQuery();
  const { data: incidents } = useGetIncidentsQuery(undefined);
  const { data: tasks } = useGetTasksQuery(undefined);

  const isLoading = priorityLoading || summaryLoading;

  // Redirect workers
  if (user?.role === 'WORKER') {
    return <Navigate to="/my-tasks" replace />;
  }

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  // Extract priority items
  const criticalIncidents = priorityData?.data?.criticalIncidents || [];
  const overdueTasks = priorityData?.data?.overdueTasks || [];
  const weatherAlerts = priorityData?.data?.weatherAlerts || [];
  const recommendedActions = priorityData?.data?.recommendedActions || [];
  const pendingLogCount = priorityData?.data?.pendingLogCount || 0;

  const requiresAttention = criticalIncidents.length > 0 || overdueTasks.length > 0 || weatherAlerts.length > 0;

  // Calculate metrics with trends (mock trends for now)
  const metrics = {
    incidents: incidents?.length || 0,
    openIssues: incidents?.filter(i => i.status === 'PENDING' || i.status === 'IN_PROGRESS').length || 0,
    critical: criticalIncidents.length,
    pendingTasks: tasks?.filter(t => t.status === 'PENDING').length || 0,
    pendingLogs: pendingLogCount,
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header with Personalization */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.fullName?.split(' ')[0] || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening on your farm {timeRange === 'today' ? 'today' : `this ${timeRange}`}
            </p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0 border-b border-gray-200 sticky top-16 z-20 bg-gray-50/80 backdrop-blur-md pt-2 -mt-4 mb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          {(['overview', 'weather', 'soil', 'ai-insights', 'budget'] as const)
            .filter(tab => user?.role === 'AGRONOMIST' ? tab !== 'budget' : true)
            .map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2
                ${activeTab === tab 
                  ? 'border-forest-600 text-forest-700 bg-forest-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
        {/* Priority Alert Banner */}
        {requiresAttention && (
          <>
            {criticalIncidents.length > 0 && (
              <PriorityBanner items={criticalIncidents} type="critical" />
            )}
            {overdueTasks.length > 0 && !criticalIncidents.length && (
              <PriorityBanner items={overdueTasks} type="warning" />
            )}
            {weatherAlerts.length > 0 && !criticalIncidents.length && !overdueTasks.length && (
              <PriorityBanner items={weatherAlerts} type="info" />
            )}
          </>
        )}

        {/* Key Metrics with Trends */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Incidents"
            value={metrics.incidents}
            trend={-8}
            icon={BarChart3}
            color="blue"
            onClick={() => window.location.href = '/incidents'}
          />
          <MetricCard
            title="Open Issues"
            value={metrics.openIssues}
            trend={-12}
            icon={AlertTriangle}
            color="red"
            onClick={() => window.location.href = '/incidents'}
          />
          <MetricCard
            title="Critical"
            value={metrics.critical}
            trend={metrics.critical > 0 ? 100 : 0}
            icon={AlertTriangle}
            color="red"
            onClick={() => window.location.href = '/incidents'}
          />
          <MetricCard
            title="Pending Tasks"
            value={metrics.pendingTasks}
            trend={5}
            icon={CheckSquare}
            color="amber"
            onClick={() => window.location.href = '/tasks'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Tasks - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Actions */}
            {recommendedActions.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="section-title flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-forest-500" />
                    Recommended Actions
                  </h2>
                  <Link
                    to="/tasks"
                    className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendedActions.slice(0, 4).map((action, idx) => (
                    <RecommendedActionCard
                      key={idx}
                      action={action}
                      onClick={() => {
                        if (action.type === 'IRRIGATION') window.location.href = '/irrigation';
                        if (action.type === 'VERIFY_LOGS') window.location.href = '/approvals';
                        if (action.type === 'INCIDENT_RESPONSE') window.location.href = '/incidents';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Overdue Tasks */}
            {overdueTasks.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="section-title flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-500" />
                    Overdue Tasks
                  </h2>
                  <Link
                    to="/tasks"
                    className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {task.field?.name || 'Unknown Field'} • {task.assignedTo?.fullName}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                        OVERDUE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Incidents */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
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
                {incidents?.slice(0, 5).map((incident) => (
                  <div
                    key={incident.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      incident.severity === 'CRITICAL'
                        ? 'bg-red-50 border border-red-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                        incident.severity === 'CRITICAL'
                          ? 'bg-red-500'
                          : incident.severity === 'HIGH'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{incident.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {incident.fieldName || 'Unknown Field'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      incident.severity === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : incident.severity === 'HIGH'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                ))}
                {(!incidents || incidents.length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-4">No incidents recorded</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Weather Alerts */}
            {weatherAlerts.length > 0 && (
              <div className="card bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  <h2 className="section-title">Weather Alerts</h2>
                </div>
                <div className="space-y-3">
                  {weatherAlerts.slice(0, 3).map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border-2 ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-50 border-red-200'
                          : alert.severity === 'WARNING'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {alert.type === 'HEAVY_RAIN' && <CloudRain className="w-4 h-4" />}
                        {alert.type === 'DROUGHT' && <Sun className="w-4 h-4" />}
                        <span className="text-xs font-bold uppercase">{alert.type.replace(/_/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Valid until: {new Date(alert.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="section-title mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/daily-logs"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-forest-50 hover:border-forest-300 border border-gray-200 transition-all"
                >
                  <FileText className="w-5 h-5 text-forest-600" />
                  <span className="text-sm font-medium text-gray-700">Submit Daily Log</span>
                </Link>
                <Link
                  to="/incidents"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 hover:border-red-300 border border-gray-200 transition-all"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Report Incident</span>
                </Link>
                <Link
                  to="/approvals"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:border-amber-300 border border-gray-200 transition-all"
                >
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">Verify Logs ({pendingLogCount})</span>
                </Link>
                <Link
                  to="/tasks"
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-gray-200 transition-all"
                >
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">View Tasks</span>
                </Link>
              </div>
            </div>

            {/* Team Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title flex items-center gap-2">
                  <Users className="w-4 h-4 text-forest-500" />
                  Team Activity
                </h2>
                <Link
                  to="/users"
                  className="text-xs text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
                >
                  Manage <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {/* Mock worker activity - replace with real data */}
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center">
                    <span className="text-forest-700 text-xs font-bold">TB</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Tadesse Bekele</p>
                    <p className="text-xs text-gray-500">Completed 3 tasks today</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 text-xs font-bold">KM</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Kebede Mohammed</p>
                    <p className="text-xs text-gray-500">Submitted 2 logs</p>
                  </div>
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {activeTab === 'ai-insights' && (
          <div className="animate-fade-in pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="p-2 bg-blue-100 rounded-lg"><Brain className="w-5 h-5 text-blue-600" /></span>
                  AI Decision Intelligence
                </h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
                  Review and approve operational recommendations generated by our integrated multi-model Smart Farm DSS (DeepSeek, Gemini, ChatGPT, and localized Custom AI).
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {aiRecommendations.map(rec => (
                <AIRecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  onApprove={handleApproveAI}
                  onReject={handleRejectAI}
                />
              ))}
            </div>
          </div>
        )}

        {['weather', 'soil', 'budget'].includes(activeTab) && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50 mt-4 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Module Under Construction</h3>
            <p className="text-gray-500 max-w-sm text-sm">
              The {activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} dashboard is currently being connected to the AI backend and will be available soon.
            </p>
          </div>
        )}

      </div>
    </Layout>
  );
};
