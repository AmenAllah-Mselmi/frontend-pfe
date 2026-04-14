'use client';
import { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';
import RepresentativesTable from './components/RepresentativesTable';
import RepresentativesGrid from './components/RepresentativesGrid';
import CreateRepresentativeModal from './components/CreateRepresentativeModal';
import EditRepresentativeModal from './components/EditRepresentativeModal';
import DeleteRepresentativeModal from './components/DeleteRepresentativeModal';
import RepresentativeDetailsModal from './components/RepresentativeDetailsModal';
import RepresentativesFilters from './components/RepresentativesFilters';
import RepresentativesStats from './components/RepresentativesStats';

import { useUserStore, User } from '@/lib/userStore';

export default function RepresentativesPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedRep, setSelectedRep] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});

  const { users, loadUsers, addUser, updateUser, deleteUser } = useUserStore();

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Normalize `users` into a typed array in case the API returns a wrapper
  const userList: User[] = Array.isArray(users)
    ? users
    : Array.isArray((users as unknown as { users?: User[] })?.users)
    ? (users as unknown as { users: User[] }).users
    : [];

  const [filteredReps, setFilteredReps] = useState<User[]>([]);

  useEffect(() => {
    applyFilters();
  }, [search, filters, users]);

  const applyFilters = () => {
    let filtered = [...userList];

    if (search) {
      filtered = filtered.filter(rep =>
        (rep.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (rep.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (rep.role || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter(rep => rep.role === filters.role);
    }

    setFilteredReps(filtered);
  };

  // Handlers
  const handleViewDetails = (rep: any) => {
    setSelectedRep(rep);
    setShowDetails(true);
  };

  const handleEdit = (rep: any) => {
    setSelectedRep(rep);
    setShowEdit(true);
  };

  const handleDelete = (rep: any) => {
    setSelectedRep(rep);
    setShowDelete(true);
  };

  const handleCreate = async (data: any) => {
    await addUser(data);
    setShowCreate(false);
  };

  const handleUpdate = async (id: number, data: any) => {
    await updateUser(id, data);
    setShowEdit(false);
    setSelectedRep(null);
  };

  const handleDeleteConfirm = async (id: number) => {
    await deleteUser(id);
    setShowDelete(false);
    setSelectedRep(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-blue-600 rounded-lg p-2">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Sales Representatives
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <UserPlus size={14} /> Manage your sales team and performance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Add Representative</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats */}
        <RepresentativesStats representatives={filteredReps} />

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setView('table')}
                  className={`p-2 rounded-lg transition ${view === 'table' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Users size={18} />
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition ${view === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <TrendingUp size={18} />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search representatives..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${Object.keys(filters).length > 0
              ? 'bg-blue-500 text-white border-transparent'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">
              Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
            </span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <RepresentativesFilters
              onClose={() => setShowFilters(false)}
              onApply={setFilters}
              initialFilters={filters}
            />
          </div>
        )}

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-xs text-blue-700 font-medium">Active filters:</span>
            {filters.team && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Team: {filters.team}
                <button onClick={() => setFilters({ ...filters, team: undefined })}>×</button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Status: {filters.status}
                <button onClick={() => setFilters({ ...filters, status: undefined })}>×</button>
              </span>
            )}
            {filters.topPerformer && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Top Performer
                <button onClick={() => setFilters({ ...filters, topPerformer: undefined })}>×</button>
              </span>
            )}
            <button
              onClick={() => setFilters({})}
              className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Representatives View */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {view === 'table' ? (
            <RepresentativesTable
              representatives={filteredReps}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <RepresentativesGrid
              representatives={filteredReps}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateRepresentativeModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {showEdit && selectedRep && (
        <EditRepresentativeModal
          representative={selectedRep}
          onClose={() => {
            setShowEdit(false);
            setSelectedRep(null);
          }}
          onSave={handleUpdate}
        />
      )}

      {showDelete && selectedRep && (
        <DeleteRepresentativeModal
          representative={selectedRep}
          onClose={() => {
            setShowDelete(false);
            setSelectedRep(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showDetails && selectedRep && (
        <RepresentativeDetailsModal
          representative={selectedRep}
          onClose={() => {
            setShowDetails(false);
            setSelectedRep(null);
          }}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}