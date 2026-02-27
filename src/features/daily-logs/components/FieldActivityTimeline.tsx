import React from 'react';
import { DailyLog } from '../../../types';
import { Activity, Clock, User } from 'lucide-react';

interface FieldActivityTimelineProps {
  logs: DailyLog[];
  fieldId?: string;
}

export const FieldActivityTimeline: React.FC<FieldActivityTimelineProps> = ({
  logs,
  fieldId,
}) => {
  // Filter logs by field if fieldId is provided
  const filteredLogs = fieldId
    ? logs.filter((log) => log.fieldId === fieldId)
    : logs;

  // Sort by date (most recent first)
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group by date
  const logsByDate = sortedLogs.reduce((acc, log) => {
    const dateKey = log.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(log);
    return acc;
  }, {} as Record<string, DailyLog[]>);

  const dates = Object.keys(logsByDate);

  if (dates.length === 0) {
    return (
      <div className="text-center py-8">
        <Timeline className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No activity recorded</p>
        <p className="text-sm text-gray-400 mt-1">
          Activities will appear here once workers log their work
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {dates.map((date) => {
        const dateLogs = logsByDate[date];
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div key={date} className="relative">
            {/* Date Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{formattedDate}</h3>
                <p className="text-sm text-gray-500">
                  {dateLogs.length} {dateLogs.length === 1 ? 'activity' : 'activities'}
                </p>
              </div>
            </div>

            {/* Activity Items */}
            <div className="space-y-3 pl-5 border-l-2 border-gray-200 ml-5">
              {dateLogs.map((log) => (
                <div key={log.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[29px] top-0 w-4 h-4 rounded-full bg-white border-2 border-forest-500" />

                  {/* Activity Card */}
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {log.workerName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {log.startTime} - {log.endTime}
                      </span>
                    </div>

                    {/* Activities */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="flex-1">
                        {log.activities.join(', ')}
                      </span>
                    </div>

                    {/* Field */}
                    {log.fieldName && (
                      <p className="text-xs text-gray-500 mt-2">
                        Field: {log.fieldName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
