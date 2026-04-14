'use client';
import { useState } from 'react';
import { X, Building2, Users, DollarSign, Tag } from 'lucide-react';

interface CompaniesFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export default function CompaniesFilters({ onClose, onApply, initialFilters = {} }: CompaniesFiltersProps) {
  // Utiliser directement les props sans useEffect
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(initialFilters?.industries || []);

  const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Defense', 'Research'];
  const sizes = ['1-10', '11-50', '51-200', '201-500', '500+', '1000+', '5000+'];
  const statuses = ['Active', 'Prospect', 'Inactive'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    if (selectedIndustries.length > 0) {
      appliedFilters.industries = selectedIndustries;
    } else {
      delete appliedFilters.industries;
    }
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedIndustries([]);
  };

  return (
    <div className="bg-white rounded-xl border shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filter Companies</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Status
          </label>
          <select 
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.status || ''}
            onChange={(e) => setFilters({...filters, status: e.target.value || undefined})}
          >
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Users size={14} /> Company Size
          </label>
          <select 
            className="w-full p-2 border rounded-lg text-sm"
            value={filters?.size || ''}
            onChange={(e) => setFilters({...filters, size: e.target.value || undefined})}
          >
            <option value="">All Sizes</option>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Revenue Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <DollarSign size={14} /> Revenue Range (M€)
          </label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min" 
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters?.minRevenue || ''}
              onChange={(e) => setFilters({...filters, minRevenue: e.target.value ? parseInt(e.target.value) : undefined})}
            />
            <input 
              type="number" 
              placeholder="Max" 
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters?.maxRevenue || ''}
              onChange={(e) => setFilters({...filters, maxRevenue: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>
        </div>

        {/* Leads Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Users size={14} /> Leads Count
          </label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="Min leads" 
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters?.minLeads || ''}
              onChange={(e) => setFilters({...filters, minLeads: e.target.value ? parseInt(e.target.value) : undefined})}
            />
            <input 
              type="number" 
              placeholder="Max leads" 
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters?.maxLeads || ''}
              onChange={(e) => setFilters({...filters, maxLeads: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>
        </div>

        {/* Industries */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Building2 size={14} /> Industries
          </label>
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedIndustries.includes(ind) 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedIndustries.includes(ind)) {
                    setSelectedIndustries(selectedIndustries.filter(i => i !== ind));
                  } else {
                    setSelectedIndustries([...selectedIndustries, ind]);
                  }
                }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
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