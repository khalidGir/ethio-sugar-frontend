import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateReportSchema, type GenerateReportFormData } from '../../../schemas';
import { X, FileText, Calendar, Users, Sprout, Beaker, Droplets, TrendingUp } from 'lucide-react';

interface ReportGeneratorProps {
  onSubmit: (data: GenerateReportFormData) => Promise<void>;
  onCancel: () => void;
}

const REPORT_TYPE_OPTIONS = [
  { value: 'DAILY_SUMMARY', label: 'Daily Summary', icon: FileText, description: 'Overview of daily farm activities' },
  { value: 'WEEKLY_SUMMARY', label: 'Weekly Summary', icon: Calendar, description: 'Weekly performance metrics' },
  { value: 'MONTHLY_SUMMARY', label: 'Monthly Summary', icon: Calendar, description: 'Monthly comprehensive report' },
  { value: 'SOIL_ANALYSIS', label: 'Soil Analysis', icon: Beaker, description: 'Soil health and nutrient report' },
  { value: 'FERTILIZER_SUMMARY', label: 'Fertilizer Summary', icon: Sprout, description: 'Fertilizer application tracking' },
  { value: 'WORKER_PERFORMANCE', label: 'Worker Performance', icon: Users, description: 'Worker productivity analysis' },
  { value: 'WEATHER_ANALYTICS', label: 'Weather Analytics', icon: TrendingUp, description: 'Weather patterns and trends' },
  { value: 'IRRIGATION_REPORT', label: 'Irrigation Report', icon: Droplets, description: 'Water usage and irrigation logs' },
  { value: 'TASK_COMPLETION', label: 'Task Completion', icon: FileText, description: 'Task completion rates' },
  { value: 'YIELD_REPORT', label: 'Yield Report', icon: TrendingUp, description: 'Crop yield analysis' },
];

const FORMAT_OPTIONS = [
  { value: 'PDF', label: 'PDF Document' },
  { value: 'EXCEL', label: 'Excel Spreadsheet' },
  { value: 'CSV', label: 'CSV File' },
];

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GenerateReportFormData>({
    resolver: zodResolver(generateReportSchema),
    defaultValues: {
      format: 'PDF',
    },
  });

  const selectedType = watch('type');
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const handleFormSubmit = async (data: GenerateReportFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReportType = REPORT_TYPE_OPTIONS.find((t) => t.value === selectedType);
  const Icon = selectedReportType?.icon;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Generate Report</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Report Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Report Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {REPORT_TYPE_OPTIONS.map((type) => {
            const TypeIcon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <label
                key={type.value}
                className={`relative flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register('type')}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-forest-500' : 'bg-gray-100'
                  }`}
                >
                  <TypeIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${isSelected ? 'text-forest-900' : 'text-gray-900'}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'border-forest-500 bg-forest-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </label>
            );
          })}
        </div>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.type.message}
          </p>
        )}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="startDate"
              {...register('startDate')}
              className="input-field pl-10"
              aria-invalid={!!errors.startDate}
            />
          </div>
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="endDate"
              {...register('endDate')}
              className="input-field pl-10"
              aria-invalid={!!errors.endDate}
            />
          </div>
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Export Format <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {FORMAT_OPTIONS.map((format) => (
            <label
              key={format.value}
              className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                watch('format') === format.value
                  ? 'border-forest-500 bg-forest-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={format.value}
                {...register('format')}
                className="sr-only"
              />
              <span
                className={`font-medium text-sm ${
                  watch('format') === format.value ? 'text-forest-700' : 'text-gray-700'
                }`}
              >
                {format.label}
              </span>
            </label>
          ))}
        </div>
        {errors.format && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.format.message}
          </p>
        )}
      </div>

      {/* Email Recipients (Optional) */}
      <div>
        <label htmlFor="emailTo" className="block text-sm font-medium text-gray-700 mb-2">
          Email Recipients (Optional)
        </label>
        <input
          type="text"
          id="emailTo"
          {...register('emailTo')}
          className="input-field"
          placeholder="Enter emails separated by commas"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave blank to download directly
        </p>
      </div>

      {/* Summary */}
      {selectedReportType && startDate && endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">{selectedReportType.label}</p>
              <p className="text-sm text-blue-700 mt-1">
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Format: {watch('format')}
              </p>
            </div>
          </div>
        </div>
      )}

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
          disabled={isSubmitting || !selectedType || !startDate || !endDate}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    </form>
  );
};
