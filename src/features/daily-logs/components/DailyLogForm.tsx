import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dailyLogSchema, type DailyLogFormData } from '../../../schemas';
import { useGetFieldsQuery } from '../../../services/api';
import { X, Upload, MapPin, Clock, Activity } from 'lucide-react';

interface DailyLogFormProps {
  onSubmit: (data: DailyLogFormData) => Promise<void>;
  onCancel: () => void;
}

export const DailyLogForm: React.FC<DailyLogFormProps> = ({ onSubmit, onCancel }) => {
  const { data: fields = [] } = useGetFieldsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<DailyLogFormData>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: {
      activities: [],
      notes: '',
      photoUrls: [],
    },
  });

  const [activityInput, setActivityInput] = useState('');

  const handleAddActivity = () => {
    if (activityInput.trim()) {
      const currentActivities = watch('activities') || [];
      // Need to use setValue or a workaround since we're outside react-hook-form context
      const event = new CustomEvent('add-activity', { detail: activityInput.trim() });
      window.dispatchEvent(event);
      setActivityInput('');
    }
  };

  const handleFormSubmit = async (data: DailyLogFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit daily log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Submit Daily Log</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Field Selection */}
      <div>
        <label htmlFor="fieldId" className="block text-sm font-medium text-gray-700 mb-2">
          Field <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            id="fieldId"
            {...register('fieldId')}
            className="input-field pl-10"
            aria-invalid={!!errors.fieldId}
          >
            <option value="">Select a field</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>
        {errors.fieldId && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.fieldId.message}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          {...register('date')}
          className="input-field"
          aria-invalid={!!errors.date}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              id="startTime"
              {...register('startTime')}
              className="input-field pl-10"
              aria-invalid={!!errors.startTime}
            />
          </div>
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.startTime.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              id="endTime"
              {...register('endTime')}
              className="input-field pl-10"
              aria-invalid={!!errors.endTime}
            />
          </div>
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.endTime.message}
            </p>
          )}
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activities <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Activity className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={activityInput}
            onChange={(e) => setActivityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())}
            placeholder="Add an activity..."
            className="input-field pl-10 pr-24"
          />
          <button
            type="button"
            onClick={handleAddActivity}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-forest-500 text-white text-sm font-medium rounded-lg hover:bg-forest-600 transition-colors"
          >
            Add
          </button>
        </div>
        <Controller
          name="activities"
          control={control}
          render={({ field }) => (
            <ActivityList activities={field.value || []} onRemove={field.onChange} />
          )}
        />
        {errors.activities && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.activities.message}
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="input-field resize-none"
          placeholder="Add any additional observations or notes..."
          aria-invalid={!!errors.notes}
        />
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.notes.message}
          </p>
        )}
      </div>

      {/* Photo Upload Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-forest-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload photos or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Log'}
        </button>
      </div>
    </form>
  );
};

// Helper component for activity list
const ActivityList: React.FC<{
  activities: string[];
  onRemove: (newActivities: string[]) => void;
}> = ({ activities, onRemove }) => {
  const handleRemove = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    onRemove(newActivities);
  };

  if (activities.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {activities.map((activity, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-50 text-forest-700 rounded-lg text-sm font-medium mr-2 mb-2"
        >
          {activity}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="text-forest-500 hover:text-forest-700 transition-colors"
            aria-label={`Remove ${activity}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
