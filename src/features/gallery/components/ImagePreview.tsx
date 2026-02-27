import React, { useState } from 'react';
import { FieldImage } from '../../../types';
import { X, ZoomIn, ZoomOut, Maximize, Calendar, User, MapPin, Tag, Download } from 'lucide-react';

interface ImagePreviewProps {
  image: FieldImage;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onDelete?: (id: string) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  image,
  onClose,
  onNext,
  onPrevious,
  onDelete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = image.filename || `image-${image.id}.jpg`;
    link.click();
  };

  const formatType = (type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const typeColors: Record<string, string> = {
    GENERAL: 'bg-gray-100 text-gray-700',
    GROWTH: 'bg-emerald-100 text-emerald-700',
    DISEASE: 'bg-red-100 text-red-700',
    PEST: 'bg-amber-100 text-amber-700',
    IRRIGATION: 'bg-blue-100 text-blue-700',
    HARVEST: 'bg-yellow-100 text-yellow-700',
    DAMAGE: 'bg-orange-100 text-orange-700',
    OTHER: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-10"
        aria-label="Close preview"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation */}
      {onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        <img
          src={image.imageUrl}
          alt={image.caption || 'Full size image'}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          {/* Caption */}
          {image.caption && (
            <p className="text-white text-lg font-medium mb-3">{image.caption}</p>
          )}

          {/* Type Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold mb-3 ${typeColors[image.imageType] || typeColors.GENERAL}`}
          >
            {formatType(image.imageType)}
          </span>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            {image.fieldName && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {image.fieldName}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(image.uploadedAt).toLocaleDateString()}
            </div>
            {image.uploaderName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {image.uploaderName}
              </div>
            )}
          </div>

          {/* Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {image.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/20 text-white rounded-lg text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>

        <button
          onClick={handleReset}
          className="px-3 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Toggle fullscreen"
        >
          <Maximize className="w-5 h-5" />
        </button>

        <button
          onClick={handleDownload}
          className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          aria-label="Download"
        >
          <Download className="w-5 h-5" />
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(image.id)}
            className="p-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            aria-label="Delete"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
