'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Filter {
  field: string;
  operator: string;
  value: string;
}

interface FilterPanelProps {
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  onClose: () => void;
}

export default function FilterPanel({ filters, setFilters, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<Filter[]>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const addFilter = () => {
    setLocalFilters([...localFilters, { field: 'company', operator: 'contains', value: '' }]);
  };

  const updateFilter = (index: number, key: keyof Filter, value: string) => {
    const newFilters = [...localFilters];
    newFilters[index][key] = value;
    setLocalFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setLocalFilters(localFilters.filter((_, i) => i !== index));
  };

  const applyFilters = () => {
    // Ne garder que les filtres qui ont une valeur
    const validFilters = localFilters.filter(f => f.value.trim() !== '');
    setFilters(validFilters);
    onClose();
  };

  const clearAll = () => {
    setLocalFilters([]);
    setFilters([]);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 mb-4">
      <div className="space-y-4 mb-6">
        {localFilters.map((filter, i) => (
          <div key={i} className="relative p-4 bg-gray-50 rounded-xl border border-gray-100 group">
            <button 
              className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100"
              onClick={() => removeFilter(i)}
            >
              <X size={14} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Field</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filter.field}
                  onChange={(e) => updateFilter(i, 'field', e.target.value)}
                >
                  <option value="company">Company</option>
                  <option value="value">Deal Value</option>
                  <option value="stage">Stage</option>
                  <option value="owner">Owner</option>
                  <option value="probability">Probability</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Operator</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={filter.operator}
                  onChange={(e) => updateFilter(i, 'operator', e.target.value)}
                >
                  <option value="equals">equals</option>
                  <option value="gt">greater than</option>
                  <option value="lt">less than</option>
                  <option value="contains">contains</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Value</label>
                <input 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Enter value..."
                  value={filter.value}
                  onChange={(e) => updateFilter(i, 'value', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button 
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          onClick={addFilter}
        >
          + Add Filter
        </button>
        
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            onClick={clearAll}
          >
            Clear All
          </button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}