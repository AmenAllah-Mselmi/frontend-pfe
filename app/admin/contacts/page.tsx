'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Users, UserPlus, Upload, Mail, Phone, Building2, Star, Download } from 'lucide-react';
import ContactsTable from './components/ContactsTable';
import ContactsGrid from './components/ContactsGrid';
import CreateContactModal from './components/CreateContactModal';
import EditContactModal from './components/EditContactModal';
import DeleteContactModal from './components/DeleteContactModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import ContactsFilters from './components/ContactsFilters';
import ContactsStats from './components/ContactsStats';
import ContactDetailsModal from './components/ContactDetailsModal';
import EmailModalManager from './components/EmailModalManager';

import { useContactStore } from '@/lib/contactStore';
import { useAuthStore } from '@/lib/authStore';
import { useEmailStore } from '@/lib/emailStore';
import { exportToCSV } from '@/lib/exportCsv';

const CURRENT_USER_ID = "Alex M.";

export default function ContactsPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const { contacts, loadContacts, addContact, updateContact, deleteContact } = useContactStore();
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedForEmail, setSelectedForEmail] = useState<any>(null);
  const { emails ,loadEmails,sendEmail} = useEmailStore();
  // Fetch Companies on Mount
  useEffect(() => {
    loadContacts();
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/companies`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCompanies(data); })
      .catch(() => { });
  }, [loadContacts]);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    const enriched = contacts.map(c => {
      const companyInfo = companies.find(comp => comp.id === c.companyId);
      return { ...c, company: companyInfo ? companyInfo.name : 'No Company', owner: 1, position: '-', source: '-', lastContact: new Date().toLocaleDateString() };
    });
    let filtered = [...enriched];

    // Recherche
    if (search) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.position.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre par statut
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(c => filters.statuses.includes(c.status));
    }

    // Filtre par source
    if (filters.sources && filters.sources.length > 0) {
      filtered = filtered.filter(c => filters.sources.includes(c.source));
    }

    // Filtre par propriétaire
    if (filters.owner) {
      filtered = filtered.filter(c => c.owner === filters.owner);
    }

    // Filtre par entreprise (recherche textuelle)
    if (filters.company) {
      filtered = filtered.filter(c =>
        c.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  }, [search, filters, contacts, companies]);

  const handleContactClick = (contact: any) => {
    setSelectedContact(contact);
    setSelectedForEmail(contact);
    setShowDetails(true);
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    setShowEdit(true);
  };

  const handleDeleteContact = (contact: any) => {
    setSelectedContact(contact);
    setShowDelete(true);
  };

  const handleUpdateContact = async (contactId: number, updatedData: any) => {
    await updateContact(contactId, updatedData);
    setShowEdit(false);
    setSelectedContact(null);
  };

  const handleDeleteContactConfirm = async (contactId: number) => {
    await deleteContact(contactId);
    setShowDelete(false);
    setSelectedContact(null);
  };

  const handleCreateContact = async (data: any) => {
    await addContact(data);
    setShowCreate(false);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEmailSelection = (selectedIds: number[]) => {
    // For simplicity, we get the first selected contact
    const firstSelected = contacts.find(c => c.id === selectedIds[0]);
    if (firstSelected) {
      setSelectedForEmail(firstSelected);
      setShowEmail(true);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    if (!user) return alert('You must be logged in to send emails');
    try {
        alert('Email sent successfully');
      await sendEmail({
        from: user.email,
        to: selectedForEmail?.email || '',
        subject: emailData.subject,
        body: emailData.message || emailData.body || '',
        userId: user.id,
        contactId: selectedForEmail?.id,
        leadId: selectedForEmail?.leadId
      });
      setShowEmail(false);
    } catch (err) {
      console.error('Failed to send email', err);
      alert('Failed to send email. Please check console.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-blue-600 rounded-lg p-2">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Contacts
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <UserPlus size={14} />Manage your contacts and relationships
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button onClick={() => exportToCSV(filteredContacts, 'admin_contacts')} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl">
                <Download size={18} /><span className="text-sm font-medium">Export</span>
              </div>
            </button>
            <button onClick={() => setShowImport(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                <Upload size={18} /><span className="text-sm font-medium">Import</span>
              </div>
            </button>
            <button onClick={() => setShowCreate(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-sm font-medium">New Contact</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats */}
        <ContactsStats contacts={filteredContacts} />

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-xs text-blue-700 font-medium">Active filters:</span>
            {filters.statuses?.map((status: string) => (
              <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Status: {status}
                <button onClick={() => setFilters({
                  ...filters,
                  statuses: filters.statuses.filter((s: string) => s !== status)
                })}>×</button>
              </span>
            ))}
            {filters.sources?.map((source: string) => (
              <span key={source} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Source: {source}
                <button onClick={() => setFilters({
                  ...filters,
                  sources: filters.sources.filter((s: string) => s !== source)
                })}>×</button>
              </span>
            ))}
            {filters.owner && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Owner: {filters.owner}
                <button onClick={() => setFilters({ ...filters, owner: undefined })}>×</button>
              </span>
            )}
            {filters.company && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                Company: {filters.company}
                <button onClick={() => setFilters({ ...filters, company: undefined })}>×</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white p-1 rounded-xl border flex justify-center shadow-sm">
              <div className="flex gap-1 flex-1 sm:flex-none">
                <button onClick={() => setView('table')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'table' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Users size={18} />
                </button>
                <button onClick={() => setView('grid')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'grid' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Building2 size={18} />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition shadow-sm"
              >
                Clear
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none px-4 py-2 border rounded-xl flex items-center justify-center gap-2 transition-all ${Object.keys(filters).length > 0 ? 'bg-blue-500 text-white shadow-md border-transparent' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}>
              <Filter size={16} />Filters{Object.keys(filters).length > 0 && ` (${Object.keys(filters).length})`}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4">
            <ContactsFilters
              onClose={() => setShowFilters(false)}
              onApply={handleApplyFilters}
              initialFilters={filters}
            />
          </div>
        )}

        {/* Contacts View */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
          {view === 'table' ?
            <ContactsTable
              contacts={filteredContacts}
              onContactClick={handleContactClick}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              onEmail={handleEmailSelection}
            /> :
            <ContactsGrid
              contacts={filteredContacts}
              onContactClick={handleContactClick}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          }
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateContactModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateContact}
          companies={companies}
        />
      )}

      {showEdit && selectedContact && (
        <EditContactModal
          contact={selectedContact}
          onClose={() => {
            setShowEdit(false);
            setSelectedContact(null);
          }}
          onSave={handleUpdateContact}
          companies={companies}
        />
      )}

      {showDelete && selectedContact && (
        <DeleteContactModal
          contact={selectedContact}
          onClose={() => {
            setShowDelete(false);
            setSelectedContact(null);
          }}
          onConfirm={handleDeleteContactConfirm}
        />
      )}

      {showImport && (
        <CSVImportWizard
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            loadContacts();
          }}
          title="Import Contacts"
          endpoint="/contacts/import-bulk"
          fields={[
            { key: 'name', label: 'Name', required: true },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' }
          ]}
        />
      )}

      {showDetails && selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={() => setShowDetails(false)}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onSendEmail={handleSendEmail}
          currentUser={user?.id?.toString() || user?.email || "1"}
        />
      )}

      {showEmail && selectedForEmail && (
        <EmailModalManager
          contact={selectedForEmail}
          onClose={() => {
            setShowEmail(false);
            setSelectedForEmail(null);
          }}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
}