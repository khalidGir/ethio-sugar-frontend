import React from 'react';
import { FileText, CheckCircle, AlertCircle, Clock, TrendingUp, Calendar } from 'lucide-react';

interface DailyReportData {
  date: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalWorkers: number;
  totalHours: number;
  weatherSummary: string;
  incidents: number;
  highlights: string[];
  concerns: string[];
}

interface DailyReportProps {
  data: DailyReportData;
}

export const DailyReport: React.FC<DailyReportProps> = ({ data }) => {
  const completionRate = Math.round((data.completedTasks / data.totalTasks) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Daily Summary</h3>
          <p className="text-sm text-gray-500">{new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Calendar className="w-8 h-8 text-forest-500" />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Total Tasks</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{data.totalTasks}</p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900">{data.completedTasks}</p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-900">{data.pendingTasks}</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
        </div>
      </div>

      {/* Worker Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Active Workers</p>
          <p className="text-xl font-bold text-gray-900">{data.totalWorkers}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Total Hours Worked</p>
          <p className="text-xl font-bold text-gray-900">{data.totalHours} hrs</p>
        </div>
      </div>

      {/* Weather */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-200">
        <p className="text-sm text-sky-700 font-medium mb-1">Weather Summary</p>
        <p className="text-gray-900">{data.weatherSummary}</p>
      </div>

      {/* Highlights */}
      {data.highlights.length > 0 && (
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">Highlights</p>
          </div>
          <ul className="space-y-1">
            {data.highlights.map((highlight, index) => (
              <li key={index} className="text-sm text-emerald-800 flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {data.concerns.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">Concerns</p>
          </div>
          <ul className="space-y-1">
            {data.concerns.map((concern, index) => (
              <li key={index} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                {concern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Incidents */}
      {data.incidents > 0 && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{data.incidents} Incident{data.incidents > 1 ? 's' : ''} Reported</p>
          </div>
        </div>
      )}
    </div>
  );
};
