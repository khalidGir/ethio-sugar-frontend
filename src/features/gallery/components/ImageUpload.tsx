import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadImageSchema, type UploadImageFormData } from '../../../schemas';
import { useGetFieldsQuery } from '../../../services/api';
import { X, Upload, Image as ImageIcon, XCircle } from 'lucide-react';

interface ImageUploadProps {
  onSubmit: (data: UploadImageFormData & { image: File }) => Promise<void>;
  onCancel: () => void;
}

const IMAGE_TYPE_OPTIONS = [
  { value: 'GENERAL', label: 'General', color: 'bg-gray-100 text-gray-700' },
  { value: 'GROWTH', label: 'Growth Stage', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'DISEASE', label: 'Disease', color: 'bg-red-100 text-red-700' },
  { value: 'PEST', label: 'Pest', color: 'bg-amber-100 text-amber-700' },
  { value: 'IRRIGATION', label: 'Irrigation', color: 'bg-blue-100 text-blue-700' },
  { value: 'HARVEST', label: 'Harvest', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'DAMAGE', label: 'Damage', color: 'bg-orange-100 text-orange-700' },
  { value: 'OTHER', label: 'Other', color: 'bg-purple-100 text-purple-700' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({ onSubmit, onCancel }) => {
  const { data: fields = [] } = useGetFieldsQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<UploadImageFormData>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {
      imageType: 'GENERAL',
      tags: [],
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = async (data: UploadImageFormData) => {
    if (!selectedFile) {
      alert('Please select an image');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...data, image: selectedFile });
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
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
              {field.name}
            </option>
          ))}
        </select>
        {errors.fieldId && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.fieldId.message}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image <span className="text-red-500">*</span>
        </label>
        {!previewUrl ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-forest-500 bg-forest-50'
                : 'border-gray-300 hover:border-forest-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload image"
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-xl border border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}
        {errors.imageType && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.imageType.message}
          </p>
        )}
      </div>

      {/* Image Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {IMAGE_TYPE_OPTIONS.map((type) => (
            <label
              key={type.value}
              className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                watch('imageType') === type.value
                  ? 'border-forest-500 bg-forest-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                value={type.value}
                {...register('imageType')}
                className="sr-only"
              />
              <span
                className={`text-sm font-medium ${
                  watch('imageType') === type.value
                    ? 'text-forest-700'
                    : 'text-gray-700'
                }`}
              >
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <input
          type="text"
          id="caption"
          {...register('caption')}
          className="input-field"
          placeholder="Add a description for this image..."
          maxLength={200}
        />
        <p className="text-xs text-gray-500 mt-1">
          {watch('caption')?.length || 0}/200 characters
        </p>
        {errors.caption && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.caption.message}
          </p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          {...register('tags')}
          className="input-field"
          placeholder="Enter tags separated by commas"
        />
        <p className="text-xs text-gray-500 mt-1">
          e.g., healthy, growth, stage-3
        </p>
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.tags.message}
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
          disabled={isSubmitting || !selectedFile}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isSubmitting ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </form>
  );
};
