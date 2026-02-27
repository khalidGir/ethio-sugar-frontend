import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fertilizerApplicationSchema, type FertilizerApplicationFormData } from '../../../schemas';
import { useGetFieldsQuery } from '../../../services/api';
import { X, Sprout, Calculator } from 'lucide-react';

interface FertilizerApplicationFormProps {
  onSubmit: (data: FertilizerApplicationFormData) => Promise<void>;
  onCancel: () => void;
}

const FERTILIZER_OPTIONS = [
  { value: 'UREA', label: 'Urea (46% N)', nContent: 46 },
  { value: 'DAP', label: 'DAP (18% N, 46% P)', nContent: 18, pContent: 46 },
  { value: 'NPS', label: 'NPS (19% N, 38% P, 7% S)', nContent: 19, pContent: 38 },
  { value: 'COMPOST', label: 'Compost (Organic)', nContent: 1 },
  { value: 'MANURE', label: 'Manure (Organic)', nContent: 0.5 },
  { value: 'UREA_46', label: 'Urea 46%', nContent: 46 },
  { value: 'CAN', label: 'CAN (27% N)', nContent: 27 },
  { value: 'OTHER', label: 'Other', nContent: 0 },
];

const GROWTH_STAGE_OPTIONS = [
  'PRE_PLANTING',
  'PLANTING',
  'EARLY_GROWTH',
  'VEGETATIVE',
  'FLOWERING',
  'FRUITING',
  'MATURATION',
  'POST_HARVEST',
];

export const FertilizerApplicationForm: React.FC<FertilizerApplicationFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { data: fields = [] } = useGetFieldsQuery();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FertilizerApplicationFormData>({
    resolver: zodResolver(fertilizerApplicationSchema),
  });

  const fertilizerType = watch('fertilizerType');
  const quantity = watch('quantity');
  const applicationRate = watch('applicationRate');

  // Auto-calculate application rate based on field size (if quantity is entered)
  React.useEffect(() => {
    if (quantity && fertilizerType) {
      // This is a simple calculation - in production, you'd get field size from API
      const selectedField = fields.find((f) => f.id === watch('fieldId'));
      if (selectedField?.size) {
        const calculatedRate = quantity / selectedField.size;
        setValue('applicationRate', Math.round(calculatedRate * 10) / 10);
      }
    }
  }, [quantity, fertilizerType, watch('fieldId'), fields, setValue]);

  const handleFormSubmit = async (data: FertilizerApplicationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit fertilizer application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFertilizer = FERTILIZER_OPTIONS.find((f) => f.value === fertilizerType);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Log Fertilizer Application</h2>
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

      {/* Fertilizer Type */}
      <div>
        <label htmlFor="fertilizerType" className="block text-sm font-medium text-gray-700 mb-2">
          Fertilizer Type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            id="fertilizerType"
            {...register('fertilizerType')}
            className="input-field pl-10"
            aria-invalid={!!errors.fertilizerType}
          >
            <option value="">Select fertilizer</option>
            {FERTILIZER_OPTIONS.map((fert) => (
              <option key={fert.value} value={fert.value}>
                {fert.label}
              </option>
            ))}
          </select>
        </div>
        {selectedFertilizer && (
          <p className="text-xs text-gray-500 mt-1">
            Nutrient content: N {selectedFertilizer.nContent}%
            {selectedFertilizer.pContent && `, P ${selectedFertilizer.pContent}%`}
          </p>
        )}
        {errors.fertilizerType && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.fertilizerType.message}
          </p>
        )}
      </div>

      {/* Quantity and Rate */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            id="quantity"
            {...register('quantity', { valueAsNumber: true })}
            className="input-field"
            aria-invalid={!!errors.quantity}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="applicationRate" className="block text-sm font-medium text-gray-700 mb-2">
            Rate (kg/ha) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.1"
              id="applicationRate"
              {...register('applicationRate', { valueAsNumber: true })}
              className="input-field pl-10"
              aria-invalid={!!errors.applicationRate}
            />
          </div>
          {errors.applicationRate && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.applicationRate.message}
            </p>
          )}
        </div>
      </div>

      {/* Cost */}
      <div>
        <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
          Cost (ETB) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          step="0.01"
          id="cost"
          {...register('cost', { valueAsNumber: true })}
          className="input-field"
          aria-invalid={!!errors.cost}
        />
        {errors.cost && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.cost.message}
          </p>
        )}
      </div>

      {/* Growth Stage */}
      <div>
        <label htmlFor="growthStage" className="block text-sm font-medium text-gray-700 mb-2">
          Growth Stage <span className="text-red-500">*</span>
        </label>
        <select
          id="growthStage"
          {...register('growthStage')}
          className="input-field"
          aria-invalid={!!errors.growthStage}
        >
          <option value="">Select growth stage</option>
          {GROWTH_STAGE_OPTIONS.map((stage) => (
            <option key={stage} value={stage}>
              {stage.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.growthStage && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.growthStage.message}
          </p>
        )}
      </div>

      {/* Application Date */}
      <div>
        <label htmlFor="appliedAt" className="block text-sm font-medium text-gray-700 mb-2">
          Application Date
        </label>
        <input
          type="date"
          id="appliedAt"
          {...register('appliedAt')}
          className="input-field"
        />
        {errors.appliedAt && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.appliedAt.message}
          </p>
        )}
      </div>

      {/* Weather Conditions */}
      <div>
        <label htmlFor="weatherConditions" className="block text-sm font-medium text-gray-700 mb-2">
          Weather Conditions
        </label>
        <input
          type="text"
          id="weatherConditions"
          {...register('weatherConditions')}
          className="input-field"
          placeholder="e.g., Sunny, Light rain, Cloudy"
        />
        {errors.weatherConditions && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.weatherConditions.message}
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
          placeholder="Additional notes about the application..."
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
          {isSubmitting ? 'Saving...' : 'Save Application'}
        </button>
      </div>
    </form>
  );
};
