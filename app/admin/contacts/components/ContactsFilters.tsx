'use client';
import { useState, useEffect } from 'react';
import { X, Users, Building2, Tag, Calendar } from 'lucide-react';

interface ContactsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export default function ContactsFilters({ onClose, onApply, initialFilters = {} }: ContactsFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialFilters?.statuses || []);
  const [selectedSources, setSelectedSources] = useState<string[]>(initialFilters?.sources || []);

  const statusOptions = ['Active', 'Inactive', 'Lead'];
  const sourceOptions = ['Website', 'Referral', 'Event', 'LinkedIn', 'Import'];
  const ownerOptions = ['Alex M.', 'Jordan L.', 'Taylor S.', 'Chris E.'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    if (selectedStatuses.length > 0) {
      appliedFilters.statuses = selectedStatuses;
    } else {
      delete appliedFilters.statuses;
    }
    if (selectedSources.length > 0) {
      appliedFilters.sources = selectedSources;
    } else {
      delete appliedFilters.sources;
    }
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedStatuses([]);
    setSelectedSources([]);
  };

  return (
    <div className="bg-white rounded-xl border shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filter Contacts</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Tag size={14} />Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(s => (
              <button 
                key={s} 
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
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Calendar size={14} />Source</label>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map(s => (
              <button 
                key={s} 
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedSources.includes(s) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedSources.includes(s)) {
                    setSelectedSources(selectedSources.filter(x => x !== s));
                  } else {
                    setSelectedSources([...selectedSources, s]);
                  }
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Owner */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Users size={14} />Owner</label>
          <select 
            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters?.owner || ''}
            onChange={(e) => setFilters({...filters, owner: e.target.value || undefined})}
          >
            <option value="">All Owners</option>
            {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Building2 size={14} />Company</label>
          <input 
            type="text" 
            placeholder="Company name" 
            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters?.company || ''}
            onChange={(e) => setFilters({...filters, company: e.target.value || undefined})}
          />
        </div>
      </div>

      <div className="p-4 border-t flex justify-end gap-2">
        <button 
          className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg" 
          onClick={handleClear}
        >
          Clear
        </button>
        <button 
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700" 
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}