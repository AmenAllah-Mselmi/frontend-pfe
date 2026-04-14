'use client';
import { useState, useEffect } from 'react';
import { X, Users, Building2, Tag, TrendingUp, DollarSign } from 'lucide-react';
interface RepresentativesFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}

export default function RepresentativesFilters({ onClose, onApply, initialFilters = {} }: RepresentativesFiltersProps) {
  const [filters, setFilters] = useState<any>(initialFilters);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(initialFilters?.teams || []);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialFilters?.statuses || []);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialFilters?.roles || []);

  const teams = ['SMB', 'Enterprise', 'Mid-Market', 'Partners'];
  const statuses = ['Active', 'Probation', 'Inactive'];
  const roles = ['Junior Sales Rep', 'Sales Representative', 'Senior Sales Rep', 'Team Lead'];
  const regions = ['North America', 'Europe', 'APAC', 'Latin America'];

  const handleApply = () => {
    const appliedFilters: any = { ...filters };
    if (selectedTeams.length > 0) appliedFilters.teams = selectedTeams;
    if (selectedStatuses.length > 0) appliedFilters.statuses = selectedStatuses;
    if (selectedRoles.length > 0) appliedFilters.roles = selectedRoles;
    onApply(appliedFilters);
  };

  const handleClear = () => {
    setFilters({});
    setSelectedTeams([]);
    setSelectedStatuses([]);
    setSelectedRoles([]);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filter Representatives</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Teams */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Users size={14} /> Teams
          </label>
          <div className="flex flex-wrap gap-2">
            {teams.map(t => (
              <button
                key={t}
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedTeams.includes(t) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedTeams.includes(t)) {
                    setSelectedTeams(selectedTeams.filter(x => x !== t));
                  } else {
                    setSelectedTeams([...selectedTeams, t]);
                  }
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Statuses */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(s => (
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

        {/* Roles */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Briefcase size={14} /> Roles
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <button
                key={r}
                className={`px-3 py-1 text-xs rounded-full transition ${
                  selectedRoles.includes(r) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  if (selectedRoles.includes(r)) {
                    setSelectedRoles(selectedRoles.filter(x => x !== r));
                  } else {
                    setSelectedRoles([...selectedRoles, r]);
                  }
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Globe size={14} /> Region
          </label>
          <select
            className="w-full p-2 border rounded-lg text-sm"
            value={filters.region || ''}
            onChange={(e) => setFilters({...filters, region: e.target.value || undefined})}
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Performance Filters */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <TrendingUp size={14} /> Performance
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min deals"
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters.minDeals || ''}
              onChange={(e) => setFilters({...filters, minDeals: e.target.value ? parseInt(e.target.value) : undefined})}
            />
            <input
              type="number"
              placeholder="Min revenue (K€)"
              className="w-1/2 p-2 border rounded-lg text-sm"
              value={filters.minRevenue || ''}
              onChange={(e) => setFilters({...filters, minRevenue: e.target.value ? parseInt(e.target.value) : undefined})}
            />
          </div>
        </div>

        {/* Top Performer Toggle */}
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="topPerformer"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={filters.topPerformer || false}
            onChange={(e) => setFilters({...filters, topPerformer: e.target.checked || undefined})}
          />
          <label htmlFor="topPerformer" className="text-sm text-gray-700">
            Show only top performers
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t flex justify-end gap-2">
        <button onClick={handleClear} className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg">
          Clear
        </button>
        <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Apply Filters
        </button>
      </div>
    </div>
  );
}

// Missing imports
import { Briefcase, Globe } from 'lucide-react';