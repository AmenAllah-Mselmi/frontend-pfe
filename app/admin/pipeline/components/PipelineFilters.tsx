'use client';
import { useState } from 'react';
import { X, User, Building2, Calendar, DollarSign, Tag } from 'lucide-react';

interface PipelineFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
}

export default function PipelineFilters({ onClose, onApply, initialFilters }: PipelineFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.tags || []);

  const owners = ['Alex Morgan', 'Jordan Lee', 'Taylor Swift', 'Chris Evans'];
  const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const tags = ['Hot', 'Warm', 'Cold', 'Enterprise', 'SME', 'Tech'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    if (selectedTags.length > 0) {
      appliedFilters.tags = selectedTags;
    }
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedTags([]);
    onApply({});
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Owner Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
            <User size={14} /> Propriétaire
          </label>
          <select 
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            value={filters.owner || ''}
            onChange={(e) => setFilters({...filters, owner: e.target.value})}
          >
            <option value="">Tous les propriétaires</option>
            {owners.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
            <Building2 size={14} /> Étape
          </label>
          <select 
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            value={filters.stage || ''}
            onChange={(e) => setFilters({...filters, stage: e.target.value})}
          >
            <option value="">Toutes les étapes</option>
            {stages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
            <Calendar size={14} /> Période
          </label>
          <select 
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            value={filters.dateRange || ''}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="">Sélectionner</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">Ce trimestre</option>
          </select>
        </div>

        {/* Value Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
            <DollarSign size={14} /> Fourchette de Valeur (€)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minValue || ''}
              onChange={(e) => setFilters({...filters, minValue: parseInt(e.target.value)})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxValue || ''}
              onChange={(e) => setFilters({...filters, maxValue: parseInt(e.target.value)})}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-2 tracking-wider">
            <Tag size={14} /> Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedTags.includes(tag.toLowerCase())
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                }`}
                onClick={() => {
                  const tagLower = tag.toLowerCase();
                  if (selectedTags.includes(tagLower)) {
                    setSelectedTags(selectedTags.filter(t => t !== tagLower));
                  } else {
                    setSelectedTags([...selectedTags, tagLower]);
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}