import React, { useState } from 'react';
import { useGetFieldImagesQuery, useUploadImageMutation, useDeleteImageMutation } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { Layout } from '../../components/Layout';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { EmptyState } from '../../components/EmptyState';
import { ImageUpload } from './components/ImageUpload';
import { ImageCard } from './components/ImageCard';
import { ImagePreview } from './components/ImagePreview';
import { ImageFilter } from './components/ImageFilter';
import { UploadImageFormData } from '../../schemas';
import { FieldImage } from '../../types';
import { Image as ImageIcon, Plus, Grid, List } from 'lucide-react';

export const GalleryDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FieldImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({});

  const { data: images = [], isLoading, error, refetch } = useGetFieldImagesQuery();
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const canUpload = user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'WORKER';

  // Apply filters
  const filteredImages = images.filter((image) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        image.caption?.toLowerCase().includes(searchLower) ||
        image.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    if (filters.fieldId && filters.fieldId !== 'all' && image.fieldName !== filters.fieldId) {
      return false;
    }
    if (filters.imageType && filters.imageType !== 'all' && image.imageType !== filters.imageType) {
      return false;
    }
    if (filters.startDate && new Date(image.uploadedAt) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(image.uploadedAt) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });

  const handleUpload = async (data: UploadImageFormData & { image: File }) => {
    try {
      await uploadImage(data).unwrap();
      setShowUploadModal(false);
      refetch();
    } catch (err) {
      console.error('Failed to upload image:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await deleteImage(id).unwrap();
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
      refetch();
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleViewFull = (image: FieldImage) => {
    setSelectedImage(image);
  };

  const handleNext = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  if (isLoading) {
    return <Layout><LoadingSpinner fullPage /></Layout>;
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage
          message="Failed to load gallery images"
          onRetry={() => window.location.reload()}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Image Gallery' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Image Gallery</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Browse and manage field images
            </p>
          </div>
          {canUpload && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Image
            </button>
          )}
        </div>

        {/* Filter */}
        <ImageFilter images={images} onFilterChange={handleFilterChange} />

        {/* View Toggle */}
        {filteredImages.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-forest-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-forest-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Gallery Grid/List */}
        {filteredImages.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-4'
            }
          >
            {filteredImages.map((image) => (
              viewMode === 'grid' ? (
                <ImageCard
                  key={image.id}
                  image={image}
                  onViewFull={handleViewFull}
                  onDelete={canUpload ? handleDelete : undefined}
                  showActions={canUpload}
                />
              ) : (
                <div
                  key={image.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewFull(image)}
                >
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.caption || 'Thumbnail'}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{image.caption || 'Untitled'}</p>
                    <p className="text-sm text-gray-500">{image.fieldName} • {new Date(image.uploadedAt).toLocaleDateString()}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {image.imageType}
                    </span>
                  </div>
                  {canUpload && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="card">
            <EmptyState
              message="No images in gallery"
              description={
                canUpload
                  ? 'Upload your first field image to start building your gallery'
                  : 'No images have been uploaded yet'
              }
              actionLabel={canUpload ? 'Upload Image' : undefined}
              onAction={() => setShowUploadModal(true)}
              icon={ImageIcon}
            />
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && canUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ImageUpload
              onSubmit={handleUpload}
              onCancel={() => setShowUploadModal(false)}
            />
          </div>
        </div>
      )}

      {/* Full Screen Preview */}
      {selectedImage && (
        <ImagePreview
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={filteredImages.length > 1 ? handleNext : undefined}
          onPrevious={filteredImages.length > 1 ? handlePrevious : undefined}
          onDelete={canUpload ? handleDelete : undefined}
        />
      )}
    </Layout>
  );
};
