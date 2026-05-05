'use client';
import { useState, useEffect } from 'react';
import { X, Tag, Calendar, AlertCircle } from 'lucide-react';

interface TicketsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
  isRepresentative?: boolean;
}

export default function TicketsFilters({ onClose, onApply, initialFilters = {}, isRepresentative = false }: TicketsFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);

  const statuses = ['NEW', 'OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];
  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const categories = ['technical', 'feature', 'import', 'admin', 'billing'];
  const tags = ['bug', 'urgent', 'feature', 'import', 'sync', 'reporting', 'email'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    
    if (selectedTags.length > 0) {
      appliedFilters.tags = selectedTags;
    } else {
      delete appliedFilters.tags;
    }
    
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedTags([]);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filter Tickets</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <AlertCircle size={14} /> Status
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.status || ''}
            onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <AlertCircle size={14} /> Priority
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.priority || ''}
            onChange={(e) => setFilters({...filters, priority: e.target.value || undefined})}
          >
            <option value="">All Priorities</option>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Category
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.category || ''}
            onChange={(e) => setFilters({...filters, category: e.target.value || undefined})}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <button
                key={t}
                type="button"
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedTags.includes(t) ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedTags.includes(t)) {
                    setSelectedTags(selectedTags.filter(x => x !== t));
                  } else {
                    setSelectedTags([...selectedTags, t]);
                  }
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}