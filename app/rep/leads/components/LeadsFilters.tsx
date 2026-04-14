'use client';
import { useState, useEffect } from 'react';
import { X, Tag, Calendar, DollarSign } from 'lucide-react';

interface LeadsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export default function LeadsFilters({ onClose, onApply, initialFilters = {} }: LeadsFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);

  const tags = ['VIP', 'Enterprise', 'Tech', 'SME', 'New'];

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
        <h3 className="font-semibold">Filter Leads</h3>
        <button onClick={onClose}><X size={18} /></button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Status Filter */}
        <select 
          className="w-full p-2 border rounded-lg text-sm"
          value={filters?.status || ''}
          onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
        >
          <option value="">All Statuses</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>

        {/* Source Filter */}
        <select 
          className="w-full p-2 border rounded-lg text-sm"
          value={filters?.source || ''}
          onChange={(e) => setFilters({...filters, source: e.target.value || undefined})}
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="Event">Event</option>
          <option value="LinkedIn">LinkedIn</option>
        </select>

        {/* Value Range */}
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Min €" 
            className="w-1/2 p-2 border rounded-lg text-sm"
            value={filters?.minValue || ''}
            onChange={(e) => setFilters({...filters, minValue: e.target.value ? parseInt(e.target.value) : undefined})}
          />
          <input 
            type="number" 
            placeholder="Max €" 
            className="w-1/2 p-2 border rounded-lg text-sm"
            value={filters?.maxValue || ''}
            onChange={(e) => setFilters({...filters, maxValue: e.target.value ? parseInt(e.target.value) : undefined})}
          />
        </div>

        {/* Tags */}
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1"><Tag size={14} />Tags</p>
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