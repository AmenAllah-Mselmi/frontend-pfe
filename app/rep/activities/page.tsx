'use client';
import { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  Search,
  Calendar,
  Download,
  Plus,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';
import { useAuthStore } from '@/lib/authStore';
import ActivitiesStats from './components/ActivitiesStats';
import ActivitiesFeed from './components/ActivitiesFeed';
import CreateActivityModal from './components/CreateActivityModal';
import ActivityDetailsModal from './components/ActivityDetailsModal';
import ActivitiesFilters from './components/ActivitiesFilters';
import Pagination from '@/components/Pagination';

export default function ActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { activities, totalItems, loading, loadActivities, addActivity } = useActivityStore();
  const { user } = useAuthStore();

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Rep sees only their own activities (filtered by userId)
  const myActivities = activities.filter((a) =>
    !user || a.userId === user.id
  );

  // Apply search + filters on top
  const filteredActivities = myActivities.filter((a) => {
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());

    const matchTypes =
      !appliedFilters.types?.length || appliedFilters.types.includes(a.type);

    const matchEntities =
      !appliedFilters.entities?.length || appliedFilters.entities.includes(a.entity);

    const matchDate = (() => {
      if (!appliedFilters.dateRange) return true;
      const ts = new Date(a.timestamp).getTime();
      const now = Date.now();
      const day = 86400000;
      if (appliedFilters.dateRange === 'today') return now - ts < day;
      if (appliedFilters.dateRange === 'week') return now - ts < 7 * day;
      if (appliedFilters.dateRange === 'month') return now - ts < 30 * day;
      if (appliedFilters.dateRange === 'quarter') return now - ts < 90 * day;
      return true;
    })();

    return matchSearch && matchTypes && matchEntities && matchDate;
  });

  const currentUserName = user?.name || 'Representative';
  const currentUserAvatar = currentUserName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleCreate = async (data: any) => {
    await addActivity({
      ...data,
      timestamp: new Date().toISOString(),
      user: { name: currentUserName, avatar: currentUserAvatar },
      userId: user?.id,
    });
    setShowCreate(false);
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2">
                <Sparkles size={37} className="text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-md" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Activities
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Activity size={14} /> Track your personal activities
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Create Button */}
            <button className="relative group" onClick={() => setShowCreate(true)}>
              <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl">
                <Plus size={18} />
                <span className="text-sm font-medium hidden sm:inline">New Activity</span>
              </div>
            </button>

          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats (scoped to current user's activities) */}
        <ActivitiesStats activities={myActivities} />

        {/* Search and Filters bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 sm:max-w-sm">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-bg-gradient-to-br from-green-500 to-emerald-600/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">Last 30 days</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-xl transition text-sm ${showFilters || Object.keys(appliedFilters).length > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {Object.keys(appliedFilters).length > 0 && (
                <span className="ml-1 w-5 h-5 bg-bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                  {Object.keys(appliedFilters).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <ActivitiesFilters
              onClose={() => setShowFilters(false)}
              onApply={(f: any) => { setAppliedFilters(f); setShowFilters(false); }}
              initialFilters={appliedFilters}
            />
          </div>
        )}

        {/* Activities Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Activities</h2>
            <div className="flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin text-bg-gradient-to-br from-green-500 to-emerald-600" />}
              <span className="text-sm text-gray-400">{filteredActivities.length} activities</span>
            </div>
          </div>

          {loading && myActivities.length === 0 ? (
            <div className="p-12 text-center">
              <Loader2 size={40} className="mx-auto text-bg-gradient-to-br from-green-500 to-emerald-600 mb-3 animate-spin" />
              <p className="text-gray-500">Loading activities...</p>
            </div>
          ) : (
            <>
              <ActivitiesFeed
                activities={filteredActivities}
                onActivityClick={handleActivityClick}
              />
              <div className="bg-white border-t px-4 py-3">
                 <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={setItemsPerPage}
                    accentColor="emerald"
                  />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateActivityModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          currentUser={currentUserName}
        />
      )}

      {showDetails && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => { setShowDetails(false); setSelectedActivity(null); }}
        />
      )}
    </div>
  );
}