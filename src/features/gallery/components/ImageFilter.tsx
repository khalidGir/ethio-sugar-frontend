import React from 'react';
import { FieldImage } from '../../../types';
import { Filter, Search, MapPin, Calendar, Tag, X } from 'lucide-react';

interface ImageFilterProps {
  images: FieldImage[];
  onFilterChange: (filters: ImageFilters) => void;
}

interface ImageFilters {
  search: string;
  fieldId: string;
  imageType: string;
  startDate: string;
  endDate: string;
  tags: string[];
}

export const ImageFilter: React.FC<ImageFilterProps> = ({
  images,
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState<ImageFilters>({
    search: '',
    fieldId: 'all',
    imageType: 'all',
    startDate: '',
    endDate: '',
    tags: [],
  });

  const [showFilters, setShowFilters] = React.useState(false);

  // Extract unique values for filters
  const uniqueFields = Array.from(
    new Set(images.map((img) => img.fieldName).filter(Boolean))
  );

  const uniqueTypes = Array.from(new Set(images.map((img) => img.imageType)));

  const uniqueTags = Array.from(
    new Set(images.flatMap((img) => img.tags || []))
  );

  const handleFilterChange = (key: keyof ImageFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      fieldId: 'all',
      imageType: 'all',
      startDate: '',
      endDate: '',
      tags: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.fieldId !== 'all' ||
    filters.imageType !== 'all' ||
    filters.startDate ||
    filters.endDate ||
    filters.tags.length > 0;

  const formatType = (type: string) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-4">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by caption or tags..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input-field pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-forest-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-white text-forest-600 rounded-full text-xs font-bold flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            <X className="w-5 h-5" />
            Clear
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="card space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Field Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Field
              </label>
              <select
                value={filters.fieldId}
                onChange={(e) => handleFilterChange('fieldId', e.target.value)}
                className="input-field"
              >
                <option value="all">All Fields</option>
                {uniqueFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Type
              </label>
              <select
                value={filters.imageType}
                onChange={(e) => handleFilterChange('imageType', e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatType(type)}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Tags
              </label>
              <select
                value={filters.tags[0] || ''}
                onChange={(e) =>
                  handleFilterChange('tags', e.target.value ? [e.target.value] : [])
                }
                className="input-field"
              >
                <option value="">All Tags</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        Showing {images.length} images
      </p>
    </div>
  );
};
