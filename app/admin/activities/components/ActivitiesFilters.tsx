'use client';
import { useState } from 'react';
import { X, User, Tag, Calendar, Filter } from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';

export default function ActivitiesFilters({ onClose }: any) {
  const { filters, setFilters, loadActivities } = useActivityStore();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.types || []);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(filters.users || []);
  const [selectedEntities, setSelectedEntities] = useState<string[]>(filters.entities || []);
  const [dateRange, setDateRange] = useState(filters.dateRange || '');

  const activityTypes = [
    { value: 'deal_created', label: 'Deal Created', color: 'green' },
    { value: 'deal_won', label: 'Deal Won', color: 'green' },
    { value: 'deal_lost', label: 'Deal Lost', color: 'red' },
    { value: 'lead_status_change', label: 'Lead Change', color: 'blue' },
    { value: 'note_added', label: 'Note Added', color: 'yellow' },
    { value: 'email_sent', label: 'Email Sent', color: 'purple' },
    { value: 'call_logged', label: 'Call Logged', color: 'orange' },
    { value: 'task_completed', label: 'Task Completed', color: 'green' },
    { value: 'pipeline_created', label: 'Pipeline Created', color: 'indigo' }
  ];

  const users = ['Alex Morgan', 'Jordan Lee', 'Taylor Swift', 'Chris Evans'];
  const entities = ['deal', 'lead', 'contact', 'task', 'pipeline'];

  const handleApply = () => {
    const newFilters: any = {};
    if (selectedTypes.length) newFilters.types = selectedTypes;
    if (selectedUsers.length) newFilters.users = selectedUsers;
    if (selectedEntities.length) newFilters.entities = selectedEntities;
    if (dateRange) newFilters.dateRange = dateRange;

    setFilters(newFilters);
    loadActivities(); // Recharger avec les nouveaux filtres
    onClose();
  };

  const handleClear = () => {
    setSelectedTypes([]);
    setSelectedUsers([]);
    setSelectedEntities([]);
    setDateRange('');
    setFilters({});
    loadActivities();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Filter Activities</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Activity Types */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Tag size={14} /> Activity Type
          </label>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setSelectedTypes(
                  selectedTypes.includes(t.value)
                    ? selectedTypes.filter(x => x !== t.value)
                    : [...selectedTypes, t.value]
                )}
                className={`px-3 py-1.5 text-xs rounded-full transition ${selectedTypes.includes(t.value)
                  ? `bg-${t.color}-600 text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <User size={14} /> Team Members
          </label>
          <div className="flex flex-wrap gap-2">
            {users.map(u => (
              <button
                key={u}
                onClick={() => setSelectedUsers(
                  selectedUsers.includes(u)
                    ? selectedUsers.filter(x => x !== u)
                    : [...selectedUsers, u]
                )}
                className={`px-3 py-1.5 text-xs rounded-full transition ${selectedUsers.includes(u)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Entities */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2">
            <Filter size={14} /> Entity Type
          </label>
          <div className="flex flex-wrap gap-2">
            {entities.map(e => (
              <button
                key={e}
                onClick={() => setSelectedEntities(
                  selectedEntities.includes(e)
                    ? selectedEntities.filter(x => x !== e)
                    : [...selectedEntities, e]
                )}
                className={`px-3 py-1.5 text-xs rounded-full transition ${selectedEntities.includes(e)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {e.charAt(0).toUpperCase() + e.slice(1)}
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-6000/20"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="quarter">This quarter</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}