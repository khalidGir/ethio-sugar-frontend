import React from 'react';
import { FieldImage } from '../../../types';
import { Image, Calendar, User, MapPin, Tag, Trash2 } from 'lucide-react';

interface ImageCardProps {
  image: FieldImage;
  onViewFull?: (image: FieldImage) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onViewFull,
  onDelete,
  showActions = false,
}) => {
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
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => onViewFull?.(image)}
      >
        <img
          src={image.thumbnailUrl || image.imageUrl}
          alt={image.caption || 'Field image'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Type Badge */}
        <span
          className={`absolute top-2 left-2 px-2.5 py-1 rounded-md text-xs font-semibold ${typeColors[image.imageType] || typeColors.GENERAL}`}
        >
          {formatType(image.imageType)}
        </span>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onViewFull?.(image)}
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              View Full
            </button>
          </div>
        </div>

        {/* Delete Button */}
        {showActions && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
            aria-label="Delete image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        {image.caption && (
          <p className="text-sm text-gray-700 font-medium line-clamp-2">
            {image.caption}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          {image.fieldName && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              {image.fieldName}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(image.uploadedAt).toLocaleDateString()}
          </div>

          {image.uploaderName && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3.5 h-3.5" />
              {image.uploaderName}
            </div>
          )}
        </div>

        {/* Tags */}
        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
            {image.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {image.tags.length > 4 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{image.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
