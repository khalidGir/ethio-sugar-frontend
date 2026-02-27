import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cropPlanSchema, type CropPlanFormData } from '../../../schemas';
import { useGetFieldsQuery } from '../../../services/api';
import { X, Calendar, Sprout, Target, DollarSign } from 'lucide-react';

interface CropPlanFormProps {
  onSubmit: (data: CropPlanFormData) => Promise<void>;
  onCancel: () => void;
}

const SEASON_OPTIONS = [
  { value: 'BELG', label: 'Belg (Feb-May)', description: 'Short rainy season' },
  { value: 'MEHER', label: 'Meher (Jun-Sep)', description: 'Main rainy season' },
  { value: 'BEGA', label: 'Bega (Oct-Jan)', description: 'Dry season' },
  { value: 'YEAR_ROUND', label: 'Year Round', description: 'Irrigated crops' },
];

const CROP_TYPE_OPTIONS = [
  'Sugarcane',
  'Maize',
  'Wheat',
  'Barley',
  'Sorghum',
  'Teff',
  'Chickpea',
  'Faba Bean',
  'Coffee',
  'Cotton',
  'Vegetables',
  'Other',
];

export const CropPlanForm: React.FC<CropPlanFormProps> = ({ onSubmit, onCancel }) => {
  const { data: fields = [] } = useGetFieldsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CropPlanFormData>({
    resolver: zodResolver(cropPlanSchema),
  });

  const plantingDate = watch('plantingDate');
  const expectedHarvestDate = watch('expectedHarvestDate');

  // Calculate duration in days
  const calculateDuration = () => {
    if (plantingDate && expectedHarvestDate) {
      const start = new Date(plantingDate);
      const end = new Date(expectedHarvestDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const duration = calculateDuration();

  const handleFormSubmit = async (data: CropPlanFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to create crop plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Create Crop Plan</h2>
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
        <select
          id="fieldId"
          {...register('fieldId')}
          className="input-field"
          aria-invalid={!!errors.fieldId}
        >
          <option value="">Select a field</option>
          {fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name} ({field.size} ha)
            </option>
          ))}
        </select>
        {errors.fieldId && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.fieldId.message}
          </p>
        )}
      </div>

      {/* Season */}
      <div>
        <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">
          Season <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {SEASON_OPTIONS.map((season) => (
            <label
              key={season.value}
              className={`relative flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                watch('season') === season.value
                  ? 'border-forest-500 bg-forest-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={season.value}
                {...register('season')}
                className="sr-only"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{season.label}</p>
                <p className="text-xs text-gray-500">{season.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  watch('season') === season.value
                    ? 'border-forest-500 bg-forest-500'
                    : 'border-gray-300'
                }`}
              >
                {watch('season') === season.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </label>
          ))}
        </div>
        {errors.season && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.season.message}
          </p>
        )}
      </div>

      {/* Crop Type */}
      <div>
        <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2">
          Crop Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            id="cropType"
            {...register('cropType')}
            className="input-field pl-10"
            aria-invalid={!!errors.cropType}
          >
            <option value="">Select crop type</option>
            {CROP_TYPE_OPTIONS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>
        {errors.cropType && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.cropType.message}
          </p>
        )}
      </div>

      {/* Crop Variety */}
      <div>
        <label htmlFor="cropVariety" className="block text-sm font-medium text-gray-700 mb-2">
          Crop Variety
        </label>
        <input
          type="text"
          id="cropVariety"
          {...register('cropVariety')}
          className="input-field"
          placeholder="e.g., Improved variety, Local variety"
        />
        {errors.cropVariety && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.cropVariety.message}
          </p>
        )}
      </div>

      {/* Planned Area */}
      <div>
        <label htmlFor="plannedArea" className="block text-sm font-medium text-gray-700 mb-2">
          Planned Area (hectares) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.1"
          id="plannedArea"
          {...register('plannedArea', { valueAsNumber: true })}
          className="input-field"
          aria-invalid={!!errors.plannedArea}
        />
        {errors.plannedArea && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.plannedArea.message}
          </p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700 mb-2">
            Planting Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="plantingDate"
              {...register('plantingDate')}
              className="input-field pl-10"
              aria-invalid={!!errors.plantingDate}
            />
          </div>
          {errors.plantingDate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.plantingDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="expectedHarvestDate" className="block text-sm font-medium text-gray-700 mb-2">
            Expected Harvest <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              id="expectedHarvestDate"
              {...register('expectedHarvestDate')}
              className="input-field pl-10"
              aria-invalid={!!errors.expectedHarvestDate}
            />
          </div>
          {errors.expectedHarvestDate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.expectedHarvestDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Duration Display */}
      {duration > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-sm text-blue-800">
            <strong>Expected Duration:</strong> {duration} days ({Math.ceil(duration / 30)} months)
          </p>
        </div>
      )}

      {/* Target Yield */}
      <div>
        <label htmlFor="plannedYield" className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="inline w-4 h-4 mr-1" />
          Target Yield (tons) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.1"
          id="plannedYield"
          {...register('plannedYield', { valueAsNumber: true })}
          className="input-field"
          aria-invalid={!!errors.plannedYield}
        />
        {errors.plannedYield && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.plannedYield.message}
          </p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline w-4 h-4 mr-1" />
          Budget (ETB) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="budget"
          {...register('budget', { valueAsNumber: true })}
          className="input-field"
          aria-invalid={!!errors.budget}
        />
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.budget.message}
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
          placeholder="Additional notes about this crop plan..."
        />
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.notes.message}
          </p>
        )}
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
          {isSubmitting ? 'Creating...' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
};
