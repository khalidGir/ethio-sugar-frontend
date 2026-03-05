import React, { useState, useEffect, useRef } from 'react';
import { useSearchQuery } from '../services/api';
import { Search, X, ChevronRight, FileText, Users, AlertTriangle, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlobalSearchProps {
  onClose?: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { data, isLoading, isFetching } = useSearchQuery(
    { q: query, type: 'all' },
    { skip: query.length < 2 }
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        // Save to recent searches
        if (!recentSearches.includes(query) && query.trim()) {
          const updated = [query, ...recentSearches.slice(0, 4)];
          setRecentSearches(updated);
          localStorage.setItem('recentSearches', JSON.stringify(updated));
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onClose?.();
        inputRef.current?.blur();
      }
      
      // Focus search on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = () => {
    setIsOpen(false);
    onClose?.();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const hasResults = data?.data && (
    data.data.fields.length > 0 ||
    data.data.workers.length > 0 ||
    data.data.incidents.length > 0 ||
    data.data.tasks.length > 0
  );

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search fields, workers, tasks... (Ctrl+K)"
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
            focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent
            placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl 
          border border-gray-100 overflow-hidden z-50 max-h-[600px] overflow-y-auto">
          
          {/* Loading State */}
          {isFetching && (
            <div className="p-8 text-center">
              <div className="w-6 h-6 border-2 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Searching...</p>
            </div>
          )}

          {/* Empty State - Too Short */}
          {query.length > 0 && query.length < 2 && (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Type at least 2 characters</p>
            </div>
          )}

          {/* Empty State - No Results */}
          {query.length >= 2 && !isLoading && !hasResults && (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-forest-600 hover:text-forest-700 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(search);
                      setIsOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                      hover:bg-gray-50 transition-colors text-left"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {hasResults && data && (
            <div className="divide-y divide-gray-50">
              {/* Fields */}
              {data.data.fields.length > 0 && (
                <section>
                  <div className="px-4 py-2.5 bg-gray-50 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-forest-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Fields ({data.data.fields.length})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.data.fields.map((field) => (
                      <Link
                        key={field.id}
                        to={`/fields/${field.id}`}
                        onClick={handleSelect}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {field.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {field.cropType} • {field.area} ha
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Workers */}
              {data.data.workers.length > 0 && (
                <section>
                  <div className="px-4 py-2.5 bg-gray-50 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Workers ({data.data.workers.length})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.data.workers.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {worker.fullName}
                          </p>
                          <p className="text-xs text-gray-500">{worker.email}</p>
                        </div>
                        {worker.telegramUsername && (
                          <span className="text-xs text-gray-400">
                            {worker.telegramUsername}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tasks */}
              {data.data.tasks.length > 0 && (
                <section>
                  <div className="px-4 py-2.5 bg-gray-50 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tasks ({data.data.tasks.length})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.data.tasks.map((task) => (
                      <Link
                        key={task.id}
                        to={`/tasks/${task.id}`}
                        onClick={handleSelect}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.field.name} • {task.assignedTo.fullName}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Incidents */}
              {data.data.incidents.length > 0 && (
                <section>
                  <div className="px-4 py-2.5 bg-gray-50 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Incidents ({data.data.incidents.length})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {data.data.incidents.map((incident) => (
                      <Link
                        key={incident.id}
                        to={`/incidents/${incident.id}`}
                        onClick={handleSelect}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {incident.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {incident.fieldName}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Footer */}
          {hasResults && (
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                {data.data.totalResults} result{data.data.totalResults !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
