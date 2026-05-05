'use client';
import { useState, useEffect } from 'react';
import { X, User, Tag, Calendar, AlertCircle, Filter } from 'lucide-react';

interface TicketsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export default function TicketsFilters({ onClose, onApply, initialFilters = {} }: TicketsFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialFilters?.statuses || []);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(initialFilters?.priorities || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);

  const statuses = ['NEW', 'OPEN', 'PENDING', 'RESOLVED', 'CLOSED'];
  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const categories = ['technical', 'feature', 'import', 'admin', 'billing'];
  const tags = ['bug', 'urgent', 'feature', 'import', 'sync', 'reporting', 'permissions', 'auth', 'export'];
  const assignees = ['Alex Morgan', 'Taylor Swift', 'Chris Evans', 'Jordan Lee'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    
    if (selectedStatuses.length > 0) {
      appliedFilters.statuses = selectedStatuses;
    } else {
      delete appliedFilters.statuses;
    }
    
    if (selectedPriorities.length > 0) {
      appliedFilters.priorities = selectedPriorities;
    } else {
      delete appliedFilters.priorities;
    }
    
    if (selectedTags.length > 0) {
      appliedFilters.tags = selectedTags;
    } else {
      delete appliedFilters.tags;
    }
    
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedStatuses([]);
    setSelectedPriorities([]);
    setSelectedTags([]);
  };

  // Mettre à jour les filtres quand les props changent
  useEffect(() => {
    setFilters(initialFilters);
    setSelectedStatuses(initialFilters?.statuses || []);
    setSelectedPriorities(initialFilters?.priorities || []);
    setSelectedTags(initialFilters?.tags || []);
  }, [initialFilters]);

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
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
              <button
                key={s}
                type="button"
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedStatuses.includes(s) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedStatuses.includes(s)) {
                    setSelectedStatuses(selectedStatuses.filter(x => x !== s));
                  } else {
                    setSelectedStatuses([...selectedStatuses, s]);
                  }
                }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <AlertCircle size={14} /> Priority
          </label>
          <div className="flex flex-wrap gap-2">
            {priorities.map(p => (
              <button
                key={p}
                type="button"
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedPriorities.includes(p) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedPriorities.includes(p)) {
                    setSelectedPriorities(selectedPriorities.filter(x => x !== p));
                  } else {
                    setSelectedPriorities([...selectedPriorities, p]);
                  }
                }}
              >
                {p}
              </button>
            ))}
          </div>
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

        {/* Assigned To */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <User size={14} /> Assigned To
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.assignedTo || ''}
            onChange={(e) => setFilters({...filters, assignedTo: e.target.value || undefined})}
          >
            <option value="">All Assignees</option>
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
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
                  selectedTags.includes(t) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
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

        {/* Date Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Calendar size={14} /> Date Range
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.dateRange || ''}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value || undefined})}
          >
            <option value="">Select range</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
          </select>
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
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}