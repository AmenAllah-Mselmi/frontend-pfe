'use client';
import { useState } from 'react';
import { X, Users, Building2, Calendar, DollarSign, Tag, Filter } from 'lucide-react';

export default function AnalyticsFilters({ onClose }: any) {
  const [filters, setFilters] = useState({
    dateRange: '30d',
    team: 'all',
    pipeline: 'all',
    stage: 'all'
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Analytics Filters</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Calendar size={14} /> Date Range
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Users size={14} /> Team Member
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters.team}
            onChange={(e) => setFilters({...filters, team: e.target.value})}
          >
            <option value="all">All Team</option>
            <option value="alex">Alex Morgan</option>
            <option value="jordan">Jordan Lee</option>
            <option value="taylor">Taylor Swift</option>
            <option value="chris">Chris Evans</option>
          </select>
        </div>

        {/* Pipeline Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Building2 size={14} /> Pipeline
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters.pipeline}
            onChange={(e) => setFilters({...filters, pipeline: e.target.value})}
          >
            <option value="all">All Pipelines</option>
            <option value="sales">Sales Pipeline</option>
            <option value="marketing">Marketing Pipeline</option>
            <option value="partners">Partners Pipeline</option>
          </select>
        </div>

        {/* Stage Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Stage
          </label>
          <select 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filters.stage}
            onChange={(e) => setFilters({...filters, stage: e.target.value})}
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-3">Quick Filters</p>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
            This Month
          </button>
          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
            Last Quarter
          </button>
          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
            Year to Date
          </button>
          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
            Compare to Previous
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
          Reset
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          Apply Filters
        </button>
      </div>
    </div>
  );
}