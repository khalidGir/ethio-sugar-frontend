import React, { useState } from 'react';
import { DailyLog } from '../../../types';
import { X, Check, MessageSquare } from 'lucide-react';

interface DailyLogVerificationProps {
  log: DailyLog;
  onVerify: (id: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => void;
  onCancel: () => void;
}

export const DailyLogVerification: React.FC<DailyLogVerificationProps> = ({
  log,
  onVerify,
  onCancel,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onVerify(log.id, 'VERIFIED');
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsSubmitting(true);
    await onVerify(log.id, 'REJECTED', rejectionReason);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Verify Daily Log</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Worker Info */}
          <div>
            <p className="text-sm text-gray-500">Worker</p>
            <p className="font-medium text-gray-900">{log.workerName}</p>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(log.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hours Worked</p>
              <p className="font-medium text-gray-900">{log.hoursWorked} hours</p>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <p className="text-sm text-gray-500">Time Range</p>
            <p className="font-medium text-gray-900">
              {log.startTime} - {log.endTime}
            </p>
          </div>

          {/* Field */}
          {log.fieldName && (
            <div>
              <p className="text-sm text-gray-500">Field</p>
              <p className="font-medium text-gray-900">{log.fieldName}</p>
            </div>
          )}

          {/* Activities */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Activities</p>
            <div className="flex flex-wrap gap-2">
              {log.activities.map((activity, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {log.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                {log.notes}
              </p>
            </div>
          )}

          {/* Photos */}
          {log.photoUrls && log.photoUrls.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Photos</p>
              <div className="grid grid-cols-3 gap-2">
                {log.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Log photo ${index + 1}`}
                    className="w-full h-24 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => window.open(url, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rejection Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="inline w-4 h-4 mr-1" />
              Rejection Reason (if rejecting)
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="Explain why this log is being rejected..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};
