'use client';
import { useState, useEffect } from 'react';
import {
  Activity,
  Filter,
  Search,
  Calendar,
  Download,
  Upload,
  Users,
  Sparkles,
  Plus
} from 'lucide-react';
import ActivitiesFeed from './components/ActivitiesFeed';
import ActivitiesFilters from './components/ActivitiesFilters';
import ActivitiesStats from './components/ActivitiesStats';
import ActivityDetailsModal from './components/ActivityDetailsModal';
import CreateActivityModal from './components/CreateActivityModal';
import DateRangePicker from './components/DateRangePicker';
import { useActivityStore } from '@/lib/activityStore';

export default function ActivitiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [dateRange, setDateRange] = useState('30d');

  const { activities = [], filters = {}, setFilters, loadActivities } = useActivityStore();

  useEffect(() => {
    loadActivities();
  }, []);

  // Client-side search filter - AVEC VÉRIFICATIONS DE SÉCURITÉ
  const filteredActivities = activities.filter(a => {
    // Vérifier que l'activité existe
    if (!a) return false;

    // Normaliser la recherche
    const searchLower = search.toLowerCase();

    // Vérifier chaque champ avec des valeurs par défaut
    const title = a.title?.toLowerCase() || '';
    const description = a.description?.toLowerCase() || '';
    const userName = a.user?.name?.toLowerCase() || '';

    // Retourner true si un des champs correspond
    return title.includes(searchLower) ||
      description.includes(searchLower) ||
      userName.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-blue-600 rounded-lg p-2">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Activity Feed
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Activity size={14} /> Track team activities
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <button onClick={() => setShowCreate(true)} className="relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                <Plus size={18} />
                <span className="text-sm font-medium hidden sm:inline">New Activity</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <ActivitiesStats />

        {/* Active Filters Display */}
        {filters && Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-600 rounded-lg">
            <span className="text-xs text-blue-600 font-medium">Active filters:</span>
            {filters.types?.map((t: string) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 rounded-lg text-xs">
                {t.replace('_', ' ')}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.types = filters.types.filter((x: string) => x !== t);
                  if (newFilters.types.length === 0) delete newFilters.types;
                  setFilters(newFilters);
                  loadActivities();
                }}>×</button>
              </span>
            ))}
            {filters.users?.map((u: string) => (
              <span key={u} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 rounded-lg text-xs">
                {u}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.users = filters.users.filter((x: string) => x !== u);
                  if (newFilters.users.length === 0) delete newFilters.users;
                  setFilters(newFilters);
                  loadActivities();
                }}>×</button>
              </span>
            ))}
            {filters.entities?.map((e: string) => (
              <span key={e} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 rounded-lg text-xs">
                {e}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.entities = filters.entities.filter((x: string) => x !== e);
                  if (newFilters.entities.length === 0) delete newFilters.entities;
                  setFilters(newFilters);
                  loadActivities();
                }}>×</button>
              </span>
            ))}
            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-600 rounded-lg text-xs">
                Period: {filters.dateRange}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  delete newFilters.dateRange;
                  setFilters(newFilters);
                  loadActivities();
                }}>×</button>
              </span>
            )}
            <button
              onClick={() => {
                setFilters({});
                loadActivities();
              }}
              className="text-xs text-blue-600 hover:text-purple-800 ml-auto font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activities..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${filters && Object.keys(filters).length > 0
              ? 'bg-blue-600 text-white border-transparent'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              Filters {filters && Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <ActivitiesFilters onClose={() => setShowFilters(false)} />
          </div>
        )}

        {/* Activities Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <ActivitiesFeed
            activities={filteredActivities}
            onActivityClick={(a: any) => {
              setSelectedActivity(a);
              setShowDetails(true);
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateActivityModal onClose={() => setShowCreate(false)} />
      )}

      {showDetails && selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}