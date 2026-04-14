'use client';
import { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  Download,
  Upload,
  MoreHorizontal
} from 'lucide-react';
import TicketsTable from './components/TicketsTable';
import TicketsKanban from './components/TicketsKanban';
import CreateTicketModal from './components/CreateTicketModal';
import EditTicketModal from './components/EditTicketModal';
import DeleteTicketModal from './components/DeleteTicketModal';
import TicketDetailsModal from './components/TicketDetailsModal';
import TicketsFilters from './components/TicketsFilters';
import { useTicketStore } from '@/lib/ticketStore';
import { useLeadStore } from '@/lib/leadStore';
import { useContactStore } from '@/lib/contactStore';
import { useUserStore } from '@/lib/userStore';


export default function TicketsPage() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const { tickets, loadTickets, addTicket, updateTicket, deleteTicket } = useTicketStore();
  const { leads, loadLeads } = useLeadStore();
  const { contacts, loadContacts } = useContactStore();
  const { users, loadUsers } = useUserStore();
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
    loadLeads();
    loadContacts();
    loadUsers();
  }, [loadTickets, loadLeads, loadContacts, loadUsers]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tickets].map((t: any) => ({
      ...t,
      priority: 'medium',
      tags: ['support'],
      assignedTo: 'Admin',
      leadName: leads.find(l => l.id === t.leadId)?.name || '-',
      contactName: contacts.find(c => c.id === t.contactId)?.name || '-'
    }));

    // Search filter
    if (search) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.leadName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(t => filters.statuses.includes(t.status));
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(t => {
        const ticketDate = new Date(t.createdAt);
        if (filters.dateRange === 'today') return ticketDate >= today;
        if (filters.dateRange === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return ticketDate >= weekAgo;
        }
        if (filters.dateRange === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return ticketDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredTickets(filtered);
  }, [search, filters, tickets, leads, contacts]);

  // Handlers
  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowDetails(true);
  };

  const handleEdit = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowEdit(true);
  };

  const handleDelete = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowDelete(true);
  };

  const handleCreate = async (data: any) => {
    await addTicket(data);
    setShowCreate(false);
  };

  const handleUpdate = async (id: number, data: any) => {
    await updateTicket(id, data);
    setShowEdit(false);
    setSelectedTicket(null);
  };

  const handleDeleteConfirm = async (id: number) => {
    await deleteTicket(id);
    setShowDelete(false);
    setSelectedTicket(null);
  };


  const handleStatusChange = async (id: number, newStatus: string) => {
    await updateTicket(id, { status: newStatus as any });
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-blue-600 rounded-lg p-2">
                <Ticket size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Ticket Management
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MessageSquare size={14} /> Track and manage support tickets
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCreate(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Tickets</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Open</p>
            <p className="text-2xl font-bold text-blue-600">{tickets.filter((t: any) => t.status === 'OPEN' || t.status === 'NEW').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{tickets.filter((t: any) => t.status === 'PENDING').length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600">{tickets.filter((t: any) => t.status === 'RESOLVED' || t.status === 'CLOSED').length}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm flex justify-center">
              <div className="flex gap-1 flex-1 sm:flex-none">
                <button
                  onClick={() => setView('table')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'table' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Ticket size={18} />
                </button>
                <button
                  onClick={() => setView('kanban')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'kanban' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>

            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm transition"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 bg-white shadow-sm transition"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all ${Object.keys(filters).length > 0
                ? 'bg-blue-500 text-white border-transparent shadow-md'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Filter size={18} />
              <span className="text-sm font-medium">
                Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <TicketsFilters
              onClose={() => setShowFilters(false)}
              onApply={handleApplyFilters}
              initialFilters={filters}
            />
          </div>
        )}

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-xs text-blue-700 font-medium">Active filters:</span>

            {filters.statuses?.map((status: string) => (
              <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Status: {status.replace('_', ' ')}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.statuses = filters.statuses.filter((s: string) => s !== status);
                  if (newFilters.statuses.length === 0) delete newFilters.statuses;
                  setFilters(newFilters);
                }}>×</button>
              </span>
            ))}

            {filters.priorities?.map((priority: string) => (
              <span key={priority} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Priority: {priority}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.priorities = filters.priorities.filter((p: string) => p !== priority);
                  if (newFilters.priorities.length === 0) delete newFilters.priorities;
                  setFilters(newFilters);
                }}>×</button>
              </span>
            ))}

            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Category: {filters.category}
                <button onClick={() => setFilters({ ...filters, category: undefined })}>×</button>
              </span>
            )}

            {filters.assignedTo && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Assigned: {filters.assignedTo}
                <button onClick={() => setFilters({ ...filters, assignedTo: undefined })}>×</button>
              </span>
            )}

            {filters.tags?.map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Tag: {tag}
                <button onClick={() => {
                  const newFilters = { ...filters };
                  newFilters.tags = filters.tags.filter((t: string) => t !== tag);
                  if (newFilters.tags.length === 0) delete newFilters.tags;
                  setFilters(newFilters);
                }}>×</button>
              </span>
            ))}

            {filters.dateRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Period: {
                  filters.dateRange === 'today' ? 'Today' :
                    filters.dateRange === 'week' ? 'This week' :
                      filters.dateRange === 'month' ? 'This month' : 'This quarter'
                }
                <button onClick={() => setFilters({ ...filters, dateRange: undefined })}>×</button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 ml-auto font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Tickets View */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {view === 'table' ? (
            <TicketsTable
              tickets={filteredTickets}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TicketsKanban
              tickets={filteredTickets}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          leads={leads}
          contacts={contacts}
          users={users}
        />
      )}

      {showEdit && selectedTicket && (
        <EditTicketModal
          ticket={selectedTicket}
          onClose={() => {
            setShowEdit(false);
            setSelectedTicket(null);
          }}
          onSave={handleUpdate}
          leads={leads}
          contacts={contacts}
        />
      )}

      {showDelete && selectedTicket && (
        <DeleteTicketModal
          ticket={selectedTicket}
          onClose={() => {
            setShowDelete(false);
            setSelectedTicket(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showDetails && selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => {
            setShowDetails(false);
            setSelectedTicket(null);
          }}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}