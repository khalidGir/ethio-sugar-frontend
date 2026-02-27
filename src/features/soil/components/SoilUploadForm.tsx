import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { soilDataSchema, type SoilDataFormData } from '../../../schemas';
import { X, Beaker, Upload } from 'lucide-react';
import { useGetFieldsQuery } from '../../../services/api';

interface SoilUploadFormProps {
  onSubmit: (data: SoilDataFormData) => Promise<void>;
  onCancel: () => void;
}

export const SoilUploadForm: React.FC<SoilUploadFormProps> = ({ onSubmit, onCancel }) => {
  const { data: fields } = useGetFieldsQuery();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SoilDataFormData>({
    resolver: zodResolver(soilDataSchema),
    defaultValues: {
      analyzedAt: new Date().toISOString().split('T')[0],
    },
  });

  const handleSubmitWithFile = async (data: SoilDataFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithFile)} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
            <Beaker className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Upload Soil Analysis</h2>
            <p className="text-sm text-gray-500">Enter soil test results from lab report</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
        {/* Field Selection */}
        <div>
          <label htmlFor="fieldId" className="label">Field *</label>
          <select
            id="fieldId"
            {...register('fieldId')}
            className="select-field"
            defaultValue=""
          >
            <option value="" disabled>Select a field</option>
            {fields?.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name} - {field.cropType}
              </option>
            ))}
          </select>
          {errors.fieldId && <p className="field-error"><span>⚠</span>{errors.fieldId.message}</p>}
        </div>

        {/* NPK Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nitrogen" className="label">Nitrogen (ppm) *</label>
            <input
              id="nitrogen"
              type="number"
              step="0.1"
              {...register('nitrogen', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
            />
            {errors.nitrogen && <p className="field-error"><span>⚠</span>{errors.nitrogen.message}</p>}
          </div>

          <div>
            <label htmlFor="phosphorus" className="label">Phosphorus (ppm) *</label>
            <input
              id="phosphorus"
              type="number"
              step="0.1"
              {...register('phosphorus', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
            />
            {errors.phosphorus && <p className="field-error"><span>⚠</span>{errors.phosphorus.message}</p>}
          </div>

          <div>
            <label htmlFor="potassium" className="label">Potassium (ppm) *</label>
            <input
              id="potassium"
              type="number"
              step="0.1"
              {...register('potassium', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
            />
            {errors.potassium && <p className="field-error"><span>⚠</span>{errors.potassium.message}</p>}
          </div>
        </div>

        {/* pH Level */}
        <div>
          <label htmlFor="pH" className="label">pH Level *</label>
          <input
            id="pH"
            type="number"
            step="0.1"
            {...register('pH', { valueAsNumber: true })}
            className="input-field"
            placeholder="7.0"
          />
          {errors.pH && <p className="field-error"><span>⚠</span>{errors.pH.message}</p>}
          <p className="text-xs text-gray-500 mt-1">Optimal range: 6.0 - 7.5</p>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="organicMatter" className="label">Organic Matter (%)</label>
            <input
              id="organicMatter"
              type="number"
              step="0.1"
              {...register('organicMatter', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
            />
            {errors.organicMatter && <p className="field-error"><span>⚠</span>{errors.organicMatter.message}</p>}
          </div>

          <div>
            <label htmlFor="moisture" className="label">Moisture (%)</label>
            <input
              id="moisture"
              type="number"
              step="0.1"
              {...register('moisture', { valueAsNumber: true })}
              className="input-field"
              placeholder="0"
            />
            {errors.moisture && <p className="field-error"><span>⚠</span>{errors.moisture.message}</p>}
          </div>

          <div>
            <label htmlFor="temperature" className="label">Temperature (°C)</label>
            <input
              id="temperature"
              type="number"
              step="0.1"
              {...register('temperature', { valueAsNumber: true })}
              className="input-field"
              placeholder="25"
            />
            {errors.temperature && <p className="field-error"><span>⚠</span>{errors.temperature.message}</p>}
          </div>
        </div>

        {/* Analysis Date */}
        <div>
          <label htmlFor="analyzedAt" className="label">Analysis Date *</label>
          <input
            id="analyzedAt"
            type="date"
            {...register('analyzedAt')}
            className="input-field"
          />
          {errors.analyzedAt && <p className="field-error"><span>⚠</span>{errors.analyzedAt.message}</p>}
        </div>

        {/* Recommendations */}
        <div>
          <label htmlFor="recommendations" className="label">Recommendations</label>
          <textarea
            id="recommendations"
            {...register('recommendations')}
            className="input-field"
            rows={3}
            placeholder="Enter recommendations (one per line)"
          />
          {errors.recommendations && <p className="field-error"><span>⚠</span>{errors.recommendations.message}</p>}
        </div>

        {/* Lab Report Upload */}
        <div>
          <label className="label">Lab Report PDF</label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-forest-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PDF files only (max 10MB)</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Analysis
            </>
          )}
        </button>
      </div>
    </form>
  );
};
