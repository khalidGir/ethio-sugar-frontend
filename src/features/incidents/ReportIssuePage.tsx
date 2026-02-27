import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateIncidentMutation, useGetFieldsQuery } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Layout } from '../../components/Layout';
import { AlertTriangle, CheckCircle, Camera, X, Bug, Droplets, Wrench, Package } from 'lucide-react';

const incidentSchema = z.object({
  fieldId: z.string().min(1, 'Field is required'),
  type: z.string().min(1, 'Issue type is required'),
  severity: z.enum(['NORMAL', 'WARNING', 'CRITICAL']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

const issueTypes = [
  { value: 'Pest Infestation', label: 'Pest/Disease', icon: Bug },
  { value: 'Irrigation Issue', label: 'Irrigation', icon: Droplets },
  { value: 'Equipment Failure', label: 'Equipment', icon: Wrench },
  { value: 'Other', label: 'Other', icon: Package },
];

export const ReportIssuePage: React.FC = () => {
  const { user } = useAuth();
  const { data: fields } = useGetFieldsQuery();
  const [createIncident, { isLoading: isSubmitting }] = useCreateIncidentMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } =
    useForm<IncidentFormData>({
      resolver: zodResolver(incidentSchema),
      defaultValues: { fieldId: '', severity: 'NORMAL' },
    });

  const onSubmit = async (data: IncidentFormData) => {
    try {
      await createIncident(data).unwrap();
      setShowSuccess(true);
      reset();
      setSelectedPhoto(null);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to report issue:', err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Success Banner */}
        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-emerald-800">Report Submitted!</p>
              <p className="text-sm text-emerald-700 mt-0.5">
                Your supervisor has been notified and will respond soon.
              </p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-emerald-400 hover:text-emerald-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="page-header">Report Issue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quickly report problems in the field</p>
        </div>

        {/* Simplified Form */}
        <div className="card border-l-4 border-l-amber-500">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Issue Type - Large buttons */}
            <div>
              <label className="label">What's the issue?</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {issueTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <label
                      key={type.value}
                      className={`
                        relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[100px]
                        ${watch('type') === type.value
                          ? 'border-forest-500 bg-forest-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        {...register('type')}
                        className="sr-only"
                      />
                      <Icon className="w-8 h-8 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700 text-center">{type.label}</span>
                    </label>
                  );
                })}
              </div>
              {errors.type && <p className="field-error mt-2">⚠ {errors.type.message}</p>}
            </div>

            {/* Field Selection */}
            <div>
              <label htmlFor="fieldId" className="label">Which field?</label>
              <select id="fieldId" {...register('fieldId')} className="select-field min-h-[48px] text-base">
                <option value="">Select a field</option>
                {fields?.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              {errors.fieldId && <p className="field-error">⚠ {errors.fieldId.message}</p>}
            </div>

            {/* Severity */}
            <div>
              <label className="label">How urgent?</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[
                  { value: 'NORMAL', label: 'Normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
                  { value: 'WARNING', label: 'Warning', color: 'text-amber-700 bg-amber-50 border-amber-300' },
                  { value: 'CRITICAL', label: 'Urgent', color: 'text-red-700 bg-red-50 border-red-300' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`
                      relative p-3 rounded-xl border-2 cursor-pointer transition-all text-center min-h-[60px] flex items-center justify-center
                      ${watch('severity') === opt.value
                        ? `border-2 ${opt.color}`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...register('severity')}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
              {errors.severity && <p className="field-error mt-2">⚠ {errors.severity.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows={3}
                className="input-field resize-none min-h-[100px] text-base"
                placeholder="Describe what you see..."
              />
              {errors.description && <p className="field-error">⚠ {errors.description.message}</p>}
            </div>

            {/* Photo Upload (Optional) */}
            <div>
              <label className="label">Add Photo (Optional)</label>
              <div className="mt-2">
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-forest-400 transition-colors min-h-[80px]">
                  <Camera className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">
                    {selectedPhoto ? 'Photo selected' : 'Tap to take photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => setSelectedPhoto(e.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Submit Button - Large and prominent */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-amber-500 text-white rounded-xl font-bold text-base hover:bg-amber-600 transition-colors min-h-[52px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
