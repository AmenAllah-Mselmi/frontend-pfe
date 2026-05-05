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
  Upload
} from 'lucide-react';
import TicketsTable from './components/TicketsTable';
import TicketsKanban from './components/TicketsKanban';
import CreateTicketModal from './components/CreateTicketModal';
import EditTicketModal from './components/EditTicketModal';
import DeleteTicketModal from './components/DeleteTicketModal';
import TicketDetailsModal from './components/TicketDetailsModal';
import TicketsFilters from './components/TicketsFilters';
import Pagination from '@/components/Pagination';

const CURRENT_USER = 'Alex Morgan';

import { useTicketStore } from '@/lib/ticketStore';
import { useLeadStore } from '@/lib/leadStore';
import { useContactStore } from '@/lib/contactStore';
import { useUserStore } from '@/lib/userStore';
export default function RepresentativeTicketsPage() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { tickets, totalItems, loadTickets, addTicket, updateTicket, deleteTicket } = useTicketStore();
  const { leads, loadLeads } = useLeadStore();
  const { contacts, loadContacts } = useContactStore();
  const { users, loadUsers } = useUserStore();
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);

  useEffect(() => {
    loadTickets(currentPage, itemsPerPage);
    loadLeads(1, 1000);
    loadContacts(1, 1000);
    loadUsers();
  }, [loadTickets, loadLeads, loadContacts, loadUsers, currentPage, itemsPerPage]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tickets].map((t: any) => ({
      ...t,
      // Provide dummy fields for standard UI
      priority: t.priority || 'MEDIUM',
      tags: ['support'],
      assignedTo: CURRENT_USER,
      createdBy: CURRENT_USER,
      leadName: leads.find((l: any) => l.id === t.leadId)?.name || 'Unknown Lead',
      contactName: contacts.find((c: any) => c.id === t.contactId)?.name || 'Unknown Contact'
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
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    setFilteredTickets(filtered);
  }, [search, filters, tickets, leads, contacts]);

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
    if (showDetails) setShowDetails(false);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await updateTicket(id, { status: newStatus as any });
  };

  const handleAddComment = (ticketId: number, comment: string) => {
    // API not setup for comments natively inside Ticket model yet
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Calculate stats
  const myTickets = tickets;
  const openTickets = myTickets.filter((t: any) => t.status === 'OPEN').length;
  const inProgressTickets = myTickets.filter((t: any) => t.status === 'PENDING').length;
  const resolvedTickets = myTickets.filter((t: any) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const criticalTickets = 0; // Filter no longer native

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-emerald-600 rounded-lg p-2">
                <Ticket size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Tickets
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MessageSquare size={14} /> Track and manage your support tickets
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="relative group"
          >
            <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
            <div className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
              <Plus size={18} />
              <span className="text-sm font-medium">New Ticket</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Ticket size={16} className="text-emerald-600" />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full ml-auto">+2</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{myTickets.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Tickets</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock size={16} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{openTickets + inProgressTickets}</p>
            <p className="text-xs text-gray-500 mt-1">Open / In Progress</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{resolvedTickets}</p>
            <p className="text-xs text-gray-500 mt-1">Resolved</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle size={16} className="text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{criticalTickets}</p>
            <p className="text-xs text-gray-500 mt-1">Critical</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => setView('table')}
                  className={`p-2 rounded-lg transition ${view === 'table' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <Ticket size={18} />
                </button>
                <button
                  onClick={() => setView('kanban')}
                  className={`p-2 rounded-lg transition ${view === 'kanban' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search my tickets..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${Object.keys(filters).length > 0
                ? 'bg-emerald-500 text-white border-transparent'
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
              isRepresentative={true}
            />
          </div>
        )}

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg">
            <span className="text-xs text-emerald-700 font-medium">Active filters:</span>

            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Status: {filters.status.replace('_', ' ')}
                <button onClick={() => setFilters({ ...filters, status: undefined })}>×</button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-xs text-emerald-600 hover:text-emerald-800 ml-auto font-medium"
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
              currentUser={CURRENT_USER}
            />
          ) : (
            <TicketsKanban
              tickets={filteredTickets}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              currentUser={CURRENT_USER}
            />
          )}
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
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
          currentUser={CURRENT_USER}
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
          currentUser={CURRENT_USER}
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
          currentUser={CURRENT_USER}
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
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
          currentUser={CURRENT_USER}
        />
      )}
    </div>
  );
}