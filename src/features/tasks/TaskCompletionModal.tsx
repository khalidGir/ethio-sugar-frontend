import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCompleteTaskMutation } from '../../services/api';
import { X, Camera, MapPin, Clock, CheckCircle } from 'lucide-react';

const taskCompletionSchema = z.object({
  completionNotes: z.string().optional(),
  actualHours: z.number().min(0.5).max(24),
  photoUrls: z.array(z.string()).optional(),
});

type TaskCompletionFormData = z.infer<typeof taskCompletionSchema>;

interface TaskCompletionModalProps {
  taskId: string;
  taskTitle: string;
  fieldName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskCompletionModal: React.FC<TaskCompletionModalProps> = ({
  taskId,
  taskTitle,
  fieldName,
  onClose,
  onSuccess,
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [completeTask] = useCompleteTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TaskCompletionFormData>({
    resolver: zodResolver(taskCompletionSchema),
    defaultValues: {
      completionNotes: '',
      actualHours: 0,
    },
  });

  const actualHours = watch('actualHours');

  // Get current location
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPhotos = Array.from(files);
      setPhotos([...photos, ...newPhotos]);

      // Create previews
      newPhotos.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  // Submit completion
  const onSubmit = async (data: TaskCompletionFormData) => {
    setIsCompleting(true);

    try {
      // In a real implementation, you would:
      // 1. Upload photos to get URLs
      // 2. Include those URLs in the completion request
      
      await completeTask({
        id: taskId,
        data: {
          completionNotes: data.completionNotes,
          actualHours: data.actualHours,
          photoUrls: photoPreviews, // Using preview URLs as placeholder
          gpsCoordinates: currentLocation || undefined,
        },
      }).unwrap();

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to complete task:', err);
      alert(`Failed to complete task: ${err.data?.message || err.message}`);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Task</h2>
            <p className="text-sm text-gray-500 mt-1">{taskTitle}</p>
            {fieldName && (
              <p className="text-xs text-gray-400 mt-1">📍 {fieldName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Completion Notes */}
          <div>
            <label htmlFor="notes" className="label">
              Completion Notes <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="notes"
              {...register('completionNotes')}
              rows={4}
              className="input-field w-full"
              placeholder="Describe what was completed, any issues encountered, etc."
            />
          </div>

          {/* Actual Hours */}
          <div>
            <label htmlFor="hours" className="label">
              Actual Hours Worked <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                {...register('actualHours', { valueAsNumber: true })}
                className="input-field w-full pl-10"
                placeholder="0.0"
              />
            </div>
            {errors.actualHours && (
              <p className="field-error">
                <span>⚠</span> {errors.actualHours.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="label">GPS Location</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGetLocation}
                className="btn-secondary flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {currentLocation ? 'Update Location' : 'Get Current Location'}
              </button>
              {currentLocation && (
                <span className="text-sm text-gray-600">
                  📍 {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Location data helps verify task completion in the field
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="label">
              Photos <span className="text-gray-400">(optional - before/after)</span>
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload photos or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG up to 10MB each
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Choose Photos
              </label>
            </div>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {photoPreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">Task will be marked as complete</span>
              </div>
              {actualHours > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">{actualHours} hours recorded</span>
                </div>
              )}
              {currentLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Location will be saved</span>
                </div>
              )}
              {photoPreviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600">{photoPreviews.length} photo(s) attached</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCompleting || !actualHours}
              className="btn-primary px-6 py-2.5 flex items-center gap-2"
            >
              {isCompleting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Complete Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
