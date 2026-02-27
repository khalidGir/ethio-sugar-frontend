import React from 'react';
import { DailyLog } from '../../../types';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DailyLogCardProps {
  log: DailyLog;
  onViewDetails?: (id: string) => void;
  onVerify?: (id: string, status: 'VERIFIED' | 'REJECTED') => void;
  showVerification?: boolean;
}

export const DailyLogCard: React.FC<DailyLogCardProps> = ({
  log,
  onViewDetails,
  onVerify,
  showVerification = false,
}) => {
  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    VERIFIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusIcons = {
    PENDING: AlertCircle,
    VERIFIED: CheckCircle,
    REJECTED: XCircle,
  };

  const StatusIcon = statusIcons[log.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{log.workerName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(log.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[log.status]}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {log.status}
        </span>
      </div>

      {/* Field Info */}
      {log.fieldName && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          {log.fieldName}
        </div>
      )}

      {/* Time Worked */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Clock className="w-4 h-4" />
        {log.startTime} - {log.endTime} ({log.hoursWorked} hours)
      </div>

      {/* Activities */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Activities
        </p>
        <div className="flex flex-wrap gap-1.5">
          {log.activities.slice(0, 3).map((activity, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
            >
              {activity}
            </span>
          ))}
          {log.activities.length > 3 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
              +{log.activities.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Notes */}
      {log.notes && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Notes
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">{log.notes}</p>
        </div>
      )}

      {/* Photos */}
      {log.photoUrls && log.photoUrls.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Photos
          </p>
          <div className="flex gap-2">
            {log.photoUrls.slice(0, 3).map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Log photo ${index + 1}`}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            ))}
            {log.photoUrls.length > 3 && (
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium">
                +{log.photoUrls.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {log.status === 'REJECTED' && log.rejectionReason && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-medium text-red-700 mb-1">Rejection Reason:</p>
          <p className="text-sm text-red-600">{log.rejectionReason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(log.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100 transition-colors"
          >
            View Details
          </button>
        )}
        {showVerification && log.status === 'PENDING' && onVerify && (
          <>
            <button
              onClick={() => onVerify(log.id, 'VERIFIED')}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onVerify(log.id, 'REJECTED')}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};
