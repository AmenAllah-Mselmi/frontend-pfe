'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Search, Plus, Filter, Users, UserPlus, Calendar, Upload, Download, Sparkles } from 'lucide-react';
import LeadsTable from './components/LeadsTable';
import LeadsKanban from './components/LeadsKanban';
import CreateLeadModal from './components/CreateLeadModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import LeadsFilters from './components/LeadsFilters';
import LeadsStats from './components/LeadsStats';
import LeadDetailsModal from './components/LeadDetailsModal';
import EmailModalRepresentative from '@/app/rep/contacts/components/EmailModalRepresentative';
import Pagination from '@/components/Pagination';
import { useLeadStore } from '@/lib/leadStore';
import { useNoteStore } from '@/lib/noteStore';
import { useTaskStore } from '@/lib/taskStore';
import { useUserStore } from '@/lib/userStore';
import { useAuthStore } from '@/lib/authStore';
import { exportToCSV } from '@/lib/exportCsv';

const CURRENT_USER = 'Alex M.';

function LeadsContent() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
 
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
 
  useEffect(() => {
    if (action === 'import') {
      setShowImport(true);
    }
  }, [action]);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedForEmail, setSelectedForEmail] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { leads, totalItems, loadLeads, addLead, updateLead, deleteLead } = useLeadStore();
  const { notes, loadNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const { tasks, loadTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const { users, loadUsers } = useUserStore();

  const [filteredLeads, setFilteredLeads] = useState<any[]>(leads);
  const scoringDone = useRef(false);

  useEffect(() => {
    loadLeads(currentPage, itemsPerPage, search);
    loadNotes();
    loadTasks();
    loadUsers();
  }, [loadLeads, loadNotes, loadTasks, loadUsers, currentPage, itemsPerPage, refreshTrigger, search]);

  // Auto-calculate AI scores for leads missing them (runs once)
  useEffect(() => {
    if (scoringDone.current) return;
    const calcMissing = async () => {
      const missing = leads.filter((l: any) => !l.leadScore);
      if (missing.length === 0) return;
      scoringDone.current = true;
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      try {
        await Promise.all(
          missing.map((l: any) =>
            fetch(`${base}/lead-scoring/${l.id}`, { credentials: 'include' }).catch(() => null)
          )
        );
        loadLeads();
      } catch (e) {
        console.error('Auto-scoring failed', e);
      }
    };
    if (leads.length > 0) calcMissing();
  }, [leads]);

  const { user } = useAuthStore();
  const currentUserId = user?.id || (users.length > 0 ? users[0].id : 2);

  // Appliquer les filtres et la recherche
  useEffect(() => {
    let filtered = [...leads];

    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(lead =>
        (lead.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.company?.name || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre par statut
    if (filters.status) {
      filtered = filtered.filter((lead: any) => lead.status === filters.status);
    }

    // Filtre par valeur min
    if (filters.minValue) {
      filtered = filtered.filter((lead: any) => lead.dealValue >= filters.minValue);
    }

    // Filtre par valeur max
    if (filters.maxValue) {
      filtered = filtered.filter((lead: any) => lead.dealValue <= filters.maxValue);
    }



    setFilteredLeads(filtered);
  }, [search, filters, leads]);

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    await updateLead(leadId, { status: newStatus as any });
  };

  const handleAddNote = async (leadId: number, content: string) => {
    await addNote({ content, leadId, userId: currentUserId });
    loadNotes();
  };

  const handleUpdateNote = async (leadId: number, noteId: number, content: string) => {
    await updateNote(noteId, { content });
  };

  const handleDeleteNote = async (leadId: number, noteId: number) => {
    await deleteNote(noteId);
  };

  const handleAddTask = async (leadId: number, task: any) => {
    await addTask({
      title: task.title,
      dueDate: new Date(task.dueDate),
      priority: task.priority?.toUpperCase() || 'MEDIUM',
      status: 'PENDING',
      leadId,
      userId: currentUserId,
    });
    loadTasks();
  };

  const handleUpdateTask = async (leadId: number, taskId: number, updates: any) => {
    if (updates.priority) updates.priority = updates.priority.toUpperCase();
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (leadId: number, taskId: number) => {
    await deleteTask(taskId);
  };

  const handleUpdateLead = async (leadId: number, data: any) => {
    await updateLead(leadId, data);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteLead = async (leadId: number) => {
    await deleteLead(leadId);
    setShowDetails(false);
    setSelectedLead(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleImport = async (importedLeads: any[]) => {
    for (const lead of importedLeads) {
      await addLead(lead);
    }
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleEmailSelection = (selectedIds: number[]) => {
    const firstSelected = leads.find(l => l.id === selectedIds[0]);
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
        userId: currentUserId,
        leadId: selectedForEmail?.id || undefined
      };
      const res = await fetch(`${base}/emails`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error('Failed to send email:', await res.text());
        toast.error('Failed to send email');
      } else {
        toast.success('Email sent successfully!');
        setShowEmail(false);
        setRefreshTrigger(prev => prev + 1);
        loadLeads(currentPage, itemsPerPage);
      }
    } catch (err) {
      console.error('Failed to send email', err);
      toast.error('Failed to send email');
    }
  };

  const handleConvertToContact = async (leadToConvert: any) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const payload = {
        name: leadToConvert.name || 'Unknown Lead',
        email: leadToConvert.email || `contact-${Date.now()}@example.com`,
        phone: leadToConvert.phone || '0000000000',
        status: 'ACTIVE'
      };
      if (leadToConvert.companyId) {
        (payload as any).companyId = Number(leadToConvert.companyId);
      }

      const res = await fetch(`${base}/contacts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        throw new Error('API returned ' + res.status);
      }
      await updateLead(leadToConvert.id, { status: 'WON' as any });
      setShowDetails(false);
      toast.success('Lead successfully converted to Contact!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to convert to contact');
    }
  };

  const handleConvertToDeal = async (leadToConvert: any, pipelineId?: number) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const dealPayload: any = {
        name: `Deal for ${leadToConvert.name}`,
        amount: Number(leadToConvert.dealValue || 0),
        probability: Number(leadToConvert.probability || 50),
        status: 'PENDING',
        expectedCloseDate: new Date().toISOString(),
        leadId: leadToConvert.id
      };
      if (pipelineId) dealPayload.pipelineId = pipelineId;

      const res = await fetch(`${base}/deals`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealPayload)
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', errorText);
        throw new Error('API returned ' + res.status);
      }
      await updateLead(leadToConvert.id, { status: 'WON' as any });
      setShowDetails(false);
      toast.success('Deal successfully created! Check your Pipeline.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to convert to Deal');
    }
  };

  const activeLead = selectedLead ? {
    ...selectedLead,
    notes: notes.filter((n) => n.leadId === selectedLead.id),
    tasks: tasks.filter((t) => t.leadId === selectedLead.id),
  } : null;

  const handleRecalculateScores = async () => {
    try {
      toast.loading('Analyzing leads with AI...', { id: 'scoring' });
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/lead-scoring/recalculate-all`, { method: 'POST', credentials: 'include' });
      if (res.ok) {
        toast.success('AI Scores recalculated successfully!', { id: 'scoring' });
        loadLeads(); // refresh the list
      } else {
        toast.error('Failed to recalculate scores.', { id: 'scoring' });
      }
    } catch (e) {
      toast.error('Error contacting AI Service.', { id: 'scoring' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-emerald-600 rounded-lg p-2">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                My Leads
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <UserPlus size={14} />Manage and track your prospects
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button onClick={handleRecalculateScores} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-indigo-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl">
                <Sparkles size={18} /><span className="text-sm font-medium">Run AI Analysis</span>
              </div>
            </button>
            <button onClick={async () => {
              const allLeads = await useLeadStore.getState().fetchAllLeads();
              const exportData = allLeads.map((l: any) => ({
                ...l,
                companyName: l.company?.name || 'N/A'
              }));
              exportToCSV(exportData, 'rep_leads');
            }} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-purple-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl">
                <Download size={18} /><span className="text-sm font-medium">Export</span>
              </div>
            </button>
            <button onClick={() => setShowImport(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl">
                <Upload size={18} /><span className="text-sm font-medium">Import</span>
              </div>
            </button>
            <button onClick={() => setShowCreate(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-green-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-sm font-medium">New Lead</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats */}
        <LeadsStats leads={filteredLeads} />

        {/* Active Filters Display */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50 rounded-lg">
            <span className="text-xs text-emerald-700 font-medium">Active filters:</span>
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Status: {filters.status}
                <button onClick={() => setFilters({ ...filters, status: undefined })}>×</button>
              </span>
            )}
            {filters.source && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Source: {filters.source}
                <button onClick={() => setFilters({ ...filters, source: undefined })}>×</button>
              </span>
            )}
            {filters.tags?.map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                {tag}
                <button onClick={() => setFilters({ ...filters, tags: filters.tags.filter((t: string) => t !== tag) })}>×</button>
              </span>
            ))}
            {filters.minValue && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Min: {filters.minValue}€
                <button onClick={() => setFilters({ ...filters, minValue: undefined })}>×</button>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white p-1 rounded-xl border flex justify-center">
              <div className="flex gap-1 flex-1 sm:flex-none">
                <button onClick={() => setView('table')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg ${view === 'table' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Users size={18} />
                </button>
                <button onClick={() => setView('kanban')}
                  className={`flex-1 sm:flex-none p-2 rounded-lg ${view === 'kanban' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Calendar size={18} />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads..."
                className="pl-10 pr-4 py-2 border rounded-xl w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex-1 sm:flex-none px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none px-4 py-2 border rounded-xl flex items-center justify-center gap-2 ${Object.keys(filters).length > 0 ? 'bg-emerald-500 text-white shadow-md border-transparent' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              <Filter size={16} />Filters{Object.keys(filters).length > 0 && ` (${Object.keys(filters).length})`}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4">
            <LeadsFilters
              onClose={() => setShowFilters(false)}
              onApply={handleApplyFilters}
              initialFilters={filters}
            />
          </div>
        )}

        {/* Leads View */}
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
          {view === 'table' ?
            <LeadsTable leads={filteredLeads} onLeadClick={handleLeadClick} onEmail={handleEmailSelection} /> :
            <LeadsKanban leads={filteredLeads} onLeadClick={handleLeadClick} onStatusChange={handleStatusChange} />
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
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreate={async (data: any) => {
            await addLead(data);
            setShowCreate(false);
          }}
        />
      )}
      {showImport && (
        <CSVImportWizard
          isOpen={showImport}
          onClose={() => setShowImport(false)}
          onSuccess={() => {
            setShowImport(false);
            loadLeads();
          }}
          title="Import Leads"
          endpoint="/leads/import-bulk"
          fields={[
            { key: 'name', label: 'Name', required: true },
            { key: 'email', label: 'Email', type: 'string' },
            { key: 'phone', label: 'Phone', type: 'string' },
            { key: 'status', label: 'Status', type: 'string' },
            { key: 'dealValue', label: 'Deal Value', type: 'number' },
            { key: 'probability', label: 'Probability', type: 'number' },
            { key: 'companyId', label: 'Company ID', type: 'number' }
          ]}
        />
      )}
      {showDetails && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          currentUser={currentUserId}
          onClose={() => setShowDetails(false)}
          onAddNote={handleAddNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onUpdateLead={handleUpdateLead}
          onDeleteLead={handleDeleteLead}
          onConvertToContact={handleConvertToContact}
          onConvertToDeal={handleConvertToDeal}
          onSendEmail={(lead: any) => {
            setSelectedForEmail(lead);
            setShowEmail(true);
          }}
          refreshTrigger={refreshTrigger}
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

export default function LeadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LeadsContent />
    </Suspense>
  );
}