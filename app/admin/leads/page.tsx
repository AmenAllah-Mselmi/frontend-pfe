/* eslint-disable react-hooks/purity */
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from './components/Header';
import LeadTable from './components/LeadTable';
import KanbanView from './components/KanbanView';
import FilterPanel from './components/FilterPanel';
import BulkBar from './components/BulkBar';
import AddButton from '../components/AddButton';
import LeadFormModal from './components/LeadFormModal';
import EditLeadModal from './components/EditLeadModal';
import DeleteLeadModal from './components/DeleteLeadModal';
import CSVImportWizard from '@/components/CSVImportWizard';
import LeadDetailsModal from './components/LeadDetailsModal';
import EmailModalManager from '../contacts/components/EmailModalManager';
import EmailHistoryModalLead from './components/EmailHistoryModalLead';
import { useLeadStore, Lead } from '@/lib/leadStore';
import { useNoteStore } from '@/lib/noteStore';
import { useTaskStore } from '@/lib/taskStore';
import { useUserStore } from '@/lib/userStore';
import { useAuthStore } from '@/lib/authStore';
import { useEmailStore } from '@/lib/emailStore';
import toast from 'react-hot-toast';
import { exportToCSV } from '@/lib/exportCsv';
import { Sparkles, Search } from 'lucide-react';
import { Suspense } from 'react';
import Pagination from '@/components/Pagination';

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

function LeadsContent() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showDeleteLead, setShowDeleteLead] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [selectedForEmail, setSelectedForEmail] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedForHistory, setSelectedForHistory] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const searchParams = useSearchParams();
  const action = searchParams.get('action');
 
  useEffect(() => {
    if (action === 'import') {
      setShowImport(true);
    }
  }, [action]);

  const { leads, totalItems, loadLeads, addLead, updateLead, deleteLead } = useLeadStore();
  const { notes, loadNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const { tasks, loadTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const { users, loadUsers } = useUserStore();
  const { user } = useAuthStore();
  const { sendEmail } = useEmailStore();

  // Normalize leads and users into typed arrays in case API returns wrappers
  const leadList: Lead[] = Array.isArray(leads)
    ? leads
    : Array.isArray((leads as unknown as { data?: Lead[] })?.data)
    ? (leads as unknown as { data: Lead[] }).data
    : [];

  const userList = Array.isArray(users)
    ? users
    : Array.isArray((users as unknown as { users?: any[] })?.users)
    ? (users as unknown as { users: any[] }).users
    : [];

  // Note: filteredLeads is currently used for client-side filtering. 
  // With server-side pagination, we'll use leads directly for now or move filters to server.
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leadList);

  const scoringDone = useRef(false);

  useEffect(() => {
    loadLeads(currentPage, itemsPerPage, searchQuery);
    loadNotes();
    loadTasks();
    loadUsers();
  }, [loadLeads, loadNotes, loadTasks, loadUsers, currentPage, itemsPerPage, refreshTrigger, searchQuery]);

  // Auto-calculate AI scores for leads missing them (runs once)
  useEffect(() => {
    if (scoringDone.current) return;
    const calcMissing = async () => {
      const missing = leadList.filter((l: any) => !l.leadScore);
      if (missing.length === 0) return;
      scoringDone.current = true;
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      try {
        await Promise.all(
          missing.map((l) =>
            fetch(`${base}/lead-scoring/${l.id}`, { credentials: 'include' }).catch(() => null)
          )
        );
        loadLeads();
      } catch (e) {
        console.error('Auto-scoring failed', e);
      }
    };
    if (leadList.length > 0) calcMissing();
  }, [leads]);

  const currentUserId = userList.length > 0 ? userList[0].id : 2;
  const CURRENT_USER_ID = "Alex M.";



  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...leadList];

    filters.forEach((filter: any) => {
      if (filter.field && filter.value) {
        filtered = filtered.filter(lead => {
          const leadValue = (lead as any)[filter.field];

          if (filter.operator === 'equals') {
            return String(leadValue).toLowerCase() === String(filter.value).toLowerCase();
          }
          if (filter.operator === 'contains') {
            return String(leadValue).toLowerCase().includes(String(filter.value).toLowerCase());
          }
          if (filter.operator === 'gt') {
            return Number(leadValue) > Number(filter.value);
          }
          if (filter.operator === 'lt') {
            return Number(leadValue) < Number(filter.value);
          }
          return true;
        });
      }
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.email || '').toLowerCase().includes(q) ||
        (lead.phone || '').toLowerCase().includes(q) ||
        (lead.company?.name || '').toLowerCase().includes(q)
      );
    }

    setFilteredLeads(filtered);
  }, [filters, leads, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    setShowEditLead(true);
  };

  const handleDeleteLead = (lead: any) => {
    setSelectedLead(lead);
    setShowDeleteLead(true);
  };

  const handleUpdateLead = async (leadId: number, updatedData: any) => {
    await updateLead(leadId, updatedData);
    setShowEditLead(false);
    setSelectedLead(null);
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    await updateLead(leadId, { status: newStatus as any });
  };

  const handleDeleteLeadConfirm = async (leadId: number) => {
    await deleteLead(leadId);
    setShowDeleteLead(false);
    setSelectedLead(null);
  };

  const handleCreateLead = async (data: any) => {
    await addLead(data);
    setShowLeadForm(false);
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
    const priorityFormat = task.priority ? task.priority.toUpperCase() : 'MEDIUM';
    const activeUsers = userList.length > 0 ? userList : users;
    
    // Always create only ONE task, even if 'all' is selected
    const isBroadcast = task.userId === 'all';
    const targetUserId = isBroadcast 
      ? (Number(user?.id) || activeUsers[0]?.id || 1)
      : (Number(task.userId) || (activeUsers.length > 0 ? activeUsers[0].id : 1));

    await addTask({
      title: task.title,
      dueDate: new Date(task.dueDate),
      priority: priorityFormat,
      status: 'PENDING',
      leadId,
      userId: targetUserId,
      isBroadcast: isBroadcast as any
    });
    
    loadTasks();
  };

  const handleUpdateTask = async (leadId: number, taskId: number, updates: any) => {
    await updateTask(taskId, updates);
  };

  const handleDeleteTask = async (leadId: number, taskId: number) => {
    await deleteTask(taskId);
  };

  const handleClearFilters = () => {
    setFilters([]);
  };

  const handleEmailSelection = (selectedIds: number[]) => {
    const firstSelected = leads.find((l: any) => l.id === selectedIds[0]);
    if (firstSelected) {
      setSelectedForEmail(firstSelected);
      setShowEmail(true);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    if (!user) return toast.error('You must be logged in to send emails');
    try {
      await sendEmail({
        from: user.email,
        to: selectedForEmail?.email || '',
        subject: emailData.subject,
        body: emailData.message || emailData.body || '',
        userId: user.id,
        leadId: selectedForEmail?.id
      });
      toast.success('Email sent successfully');
      setShowEmail(false);
      setRefreshTrigger(prev => prev + 1);
      loadLeads(currentPage, itemsPerPage);
    } catch (err) {
      console.error('Failed to send email', err);
      toast.error('Failed to send email. Check console.');
    }
  };

  const handleShowHistory = (lead: any) => {
    setSelectedForHistory(lead);
    setShowHistory(true);
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
      setShowLeadDetails(false);
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
      setShowLeadDetails(false);
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
        loadLeads(); // refresh the table
      } else {
        toast.error('Failed to recalculate scores.', { id: 'scoring' });
      }
    } catch (e) {
      toast.error('Error contacting AI Service.', { id: 'scoring' });
    }
  };

  const totalLeadsCount = filteredLeads.length;
  const qualifiedLeads = filteredLeads.filter((l: any) => l.status === 'QUALIFIED').length;
  const activeLeadsCount = filteredLeads.filter((l: any) => l.status !== 'LOST').length;

  const pipelineValue = filteredLeads
    .filter((l: any) => l.status !== 'LOST')
    .reduce((sum: number, lead: any) => sum + (Number(lead.dealValue) || 0), 0);

  const conversionRate = totalLeadsCount > 0 ? ((qualifiedLeads / totalLeadsCount) * 100).toFixed(1) : '0.0';
  const avgDealSize = activeLeadsCount > 0 ? pipelineValue / activeLeadsCount : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Header
          totalLeads={totalLeadsCount}
          pipelineValue={pipelineValue}
          conversionRate={conversionRate}
          avgDealSize={avgDealSize}
          onFilterClick={() => setShowFilters(!showFilters)}
          onExport={async () => {
            const allLeads = await useLeadStore.getState().fetchAllLeads();
            const exportData = allLeads.map(l => ({
              ...l,
              companyName: l.company?.name || 'N/A'
            }));
            exportToCSV(exportData, 'leads');
          }}
        />

        {/* Active Filters Display */}
        {filters.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-xs text-blue-700 font-medium">Active filters:</span>
            {filters.map((filter: any, index: number) => (
              filter.value && (
                <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs">
                  {filter.field}: {filter.value}
                  <button onClick={() => {
                    const newFilters = [...filters];
                    newFilters.splice(index, 1);
                    setFilters(newFilters);
                  }}>×</button>
                </span>
              )
            ))}
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white p-1 rounded-xl border shadow-sm">
              <div className="flex gap-1 flex-1 sm:flex-none">
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'table'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  onClick={() => setView('table')}
                >
                  Table View
                </button>
                <button
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'kanban'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  onClick={() => setView('kanban')}
                >
                  Kanban Board
                </button>
              </div>
            </div>
            <div className="relative flex-1 sm:flex-none">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleRecalculateScores}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm whitespace-nowrap"
            >
              <Sparkles size={16} /> Run AI Analysis
            </button>
            <AddButton
              onAdd={() => setShowLeadForm(true)}
              onImport={() => setShowImport(true)}
              type="lead"
            />
          </div>
        </div>

        {showFilters && (
          <div className="mb-6">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border">
          {view === 'table' ? (
            <>
              <LeadTable
                data={filteredLeads}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                onLeadClick={handleLeadClick}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onEmail={handleEmailSelection}
              />
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          ) : (
            <KanbanView
              leads={filteredLeads}
              onLeadClick={handleLeadClick}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        {selectedRows.length > 0 && (
          <BulkBar
            count={selectedRows.length}
            onClear={() => setSelectedRows([])}
          />
        )}

      {/* Modals */}
      {showLeadForm && (
        <LeadFormModal
          onClose={() => setShowLeadForm(false)}
          onSave={handleCreateLead}
        />
      )}

      {showEditLead && selectedLead && (
        <EditLeadModal
          lead={selectedLead}
          onClose={() => {
            setShowEditLead(false);
            setSelectedLead(null);
          }}
          onSave={handleUpdateLead}
        />
      )}

      {showDeleteLead && selectedLead && (
        <DeleteLeadModal
          lead={selectedLead}
          onClose={() => {
            setShowDeleteLead(false);
            setSelectedLead(null);
          }}
          onConfirm={handleDeleteLeadConfirm}
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

      {showLeadDetails && activeLead && (
        <LeadDetailsModal
          lead={activeLead}
          onClose={() => setShowLeadDetails(false)}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onUpdateNote={handleUpdateNote}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onConvertToContact={handleConvertToContact}
          onConvertToDeal={handleConvertToDeal}
          onShowEmailHistory={handleShowHistory}
          onSendEmail={(l: any) => {
            setSelectedForEmail(l);
            setShowEmail(true);
          }}
          currentUser={user?.id?.toString() || user?.email || "1"}
          users={userList.length > 0 ? userList : users}
          refreshTrigger={refreshTrigger}
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

      {showHistory && selectedForHistory && (
        <EmailHistoryModalLead
          lead={selectedForHistory}
          onClose={() => {
            setShowHistory(false);
            setSelectedForHistory(null);
          }}
          currentUser={user?.id?.toString() || user?.email || "1"}
        />
      )}
      </div>
    </div>
  );
}
