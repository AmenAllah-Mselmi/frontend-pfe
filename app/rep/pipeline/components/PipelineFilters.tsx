'use client';
import { useState, useEffect } from 'react';
import { X, User, Building2, Calendar, DollarSign, Tag } from 'lucide-react';

interface PipelineFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
  stages?: string[];
}

export default function PipelineFilters({ onClose, onApply, initialFilters = {}, stages = [] }: PipelineFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);

  const owners = ['Alex Morgan', 'Jordan Lee', 'Taylor Swift'];
  const tags = ['Hot', 'Warm', 'Cold', 'Enterprise', 'SME'];

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
    <div className="bg-white rounded-xl border shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Stage Filter */}
        <select 
          className="w-full p-2 border rounded-lg text-sm"
          value={filters?.stage || ''}
          onChange={(e) => setFilters({...filters, stage: e.target.value || undefined})}
        >
          <option value="">All Stages</option>
          {stages.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Owner Filter */}
        <select 
          className="w-full p-2 border rounded-lg text-sm"
          value={filters?.owner || ''}
          onChange={(e) => setFilters({...filters, owner: e.target.value || undefined})}
        >
          <option value="">All Owners</option>
          {owners.map(owner => <option key={owner} value={owner}>{owner}</option>)}
        </select>

        {/* Value Range */}
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Min €" 
            className="w-1/2 p-2 border rounded-lg text-sm"
            value={filters?.min || ''}
            onChange={(e) => setFilters({...filters, min: e.target.value ? parseInt(e.target.value) : undefined})}
          />
          <input 
            type="number" 
            placeholder="Max €" 
            className="w-1/2 p-2 border rounded-lg text-sm"
            value={filters?.max || ''}
            onChange={(e) => setFilters({...filters, max: e.target.value ? parseInt(e.target.value) : undefined})}
          />
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

      {/* Actions */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button 
          className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg" 
          onClick={handleClear}
        >
          Clear
        </button>
        <button 
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700" 
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}