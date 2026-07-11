'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Users, UserPlus, Upload, Mail, Phone, Building2, Download } from 'lucide-react';
import ContactsTable from './components/ContactsTable';
import ContactsGrid from './components/ContactsGrid';
import CreateContactModal from './components/CreateContactModal';
import EditContactModal from './components/EditContactModal';
import DeleteContactModal from './components/DeleteContactModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import ContactsFilters from './components/ContactsFilters';
import ContactsStats from './components/ContactsStats';
import ContactDetailsModal from './components/ContactDetailsModal';
import EmailModalRepresentative from './components/EmailModalRepresentative';
import Pagination from '@/components/Pagination';

import { useContactStore, Contact } from '@/lib/contactStore';
import { exportToCSV } from '@/lib/exportCsv';
import toast from 'react-hot-toast';

const CURRENT_USER_ID = 1;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { contacts, totalItems, loadContacts, addContact, updateContact, deleteContact } = useContactStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedForEmail, setSelectedForEmail] = useState<any>(null);

  // Fetch Companies on Mount
  useEffect(() => {
    loadContacts(currentPage, itemsPerPage);
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/companies`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCompanies(data); })
      .catch(() => { });
  }, [loadContacts, currentPage, itemsPerPage]);

  // Enrich & Filter contacts
  useEffect(() => {
    const enriched = contacts.map(c => {
      const companyInfo = companies.find(comp => comp.id === c.companyId);
      return { ...c, company: companyInfo ? companyInfo.name : 'No Company', owner: CURRENT_USER_ID, position: '-', source: '-', lastContact: new Date().toLocaleDateString() };
    });

    let filtered = enriched.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(c => filters.statuses.map((s: string) => s.toUpperCase()).includes(c.status));
    }

    if (filters.source) {
      filtered = filtered.filter(c => c.source === filters.source);
    }

    setFilteredContacts(filtered);
  }, [search, filters, contacts, companies]);

  // Temporary mock routing for 'myContacts' vs 'otherContacts' - normally driven by real auth
  const myContacts = filteredContacts;
  const otherContacts: any[] = [];

  const handleContactClick = (contact: any) => {
    setSelectedContact(contact);
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

  const handleCreateContact = async (data: any) => {
    try {
      await addContact(data);
      setShowCreate(false);
      toast.success('Contact successfully created!');
    } catch (err: any) {
      console.error('Create contact failed', err);
      toast.error(`Create contact failed: ${err?.message || err}`);
    }
  };

  const handleUpdateContact = async (contactId: number, updatedData: any) => {
    try {
      await updateContact(contactId, updatedData);
      setShowEdit(false);
      setSelectedContact(null);
      toast.success('Contact successfully updated!');
    } catch (err: any) {
      console.error('Update contact failed', err);
      toast.error(`Update contact failed: ${err?.message || err}`);
    }
  };

  const handleDeleteContactConfirm = async (contactId: number) => {
    await deleteContact(contactId);
    setShowDelete(false);
    setSelectedContact(null);
    if (showDetails) setShowDetails(false);
  };

  const handleImport = async (importedContacts: any[]) => {
    for (const contact of importedContacts) {
      await addContact({
        ...contact,
        companyId: undefined // Let the backend decide or parse if needed, but we can't map text to IDs easily
      });
    }
    setShowImport(false);
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
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const payload = {
        from: 'alex@company.com',
        to: selectedForEmail?.email || 'test@example.com',
        subject: emailData.subject,
        body: emailData.message || emailData.body || 'No content',
        status: 'sent',
        emailType: 'transactional',
        sentAt: new Date().toISOString(),
        userId: 1,
        contactId: selectedForEmail?.id || undefined
      };
      const res = await fetch(`${base}/emails`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) console.error('Failed to send email:', await res.text());
    } catch (err) {
      console.error('Failed to send email', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-emerald-600 rounded-lg p-2">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Contacts
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <UserPlus size={14} />Manage your contacts ({myContacts.length} mine • {otherContacts.length} team)
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={async () => {
              const allContacts = await useContactStore.getState().fetchAllContacts();
              const exportData = allContacts.map((c: any) => ({
                ...c,
                companyName: c.company?.name || 'N/A'
              }));
              exportToCSV(exportData, 'rep_contacts');
            }} className="relative group">
              <div className="absolute inset-0 bg-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl">
                <Download size={18} /><span className="text-sm font-medium">Export</span>
              </div>
            </button>
            <button onClick={() => setShowImport(true)} className="relative group">
              <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
                <Upload size={18} /><span className="text-sm font-medium">Import</span>
              </div>
            </button>
            <button onClick={() => setShowCreate(true)} className="relative group">
              <div className="absolute inset-0 bg-green-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-sm font-medium">New Contact</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <ContactsStats contacts={filteredContacts} myContacts={myContacts} totalItems={totalItems} />

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg">
            <span className="text-xs text-emerald-700 font-medium">Active filters:</span>
            {filters.statuses && filters.statuses.map((status: string) => (
              <span key={status} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Status: {status}
                <button onClick={() => setFilters({
                  ...filters,
                  statuses: filters.statuses.filter((s: string) => s !== status)
                })}>×</button>
              </span>
            ))}
            {filters.source && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Source: {filters.source}
                <button onClick={() => setFilters({ ...filters, source: undefined })}>×</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-emerald-600 hover:text-emerald-800 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border">
              <div className="flex gap-1">
                <button onClick={() => setView('table')}
                  className={`p-2 rounded-lg ${view === 'table' ? 'bg-emerald-500 text-white' : 'text-gray-500'}`}>
                  <Users size={18} />
                </button>
                <button onClick={() => setView('grid')}
                  className={`p-2 rounded-lg ${view === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-500'}`}>
                  <Building2 size={18} />
                </button>
              </div>
            </div>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-10 pr-4 py-2 border rounded-xl w-64 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 ${Object.keys(filters).length > 0 ? 'bg-emerald-500 text-white' : 'bg-white'}`}>
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
              currentUser={CURRENT_USER_ID}
              onEmail={handleEmailSelection}
            /> :
            <ContactsGrid
              contacts={filteredContacts}
              onContactClick={handleContactClick}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              currentUser={CURRENT_USER_ID}
            />
          }
          <div className="bg-white border-t px-4 py-3">
             <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
          </div>
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
          currentUser={CURRENT_USER_ID}
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
          currentUser={CURRENT_USER_ID}
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
            { key: 'status', label: 'Status' },
            { key: 'companyId', label: 'Company ID', type: 'number' }
          ]}
        />
      )}

      {showDetails && selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          onClose={() => setShowDetails(false)}
          onUpdate={handleUpdateContact}
          onDelete={handleDeleteContact}
          currentUser={CURRENT_USER_ID}
        />
      )}

      {showEmail && selectedForEmail && (
        <EmailModalRepresentative
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