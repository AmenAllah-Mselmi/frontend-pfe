'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Search, Plus, LayoutGrid, List as ListIcon, Filter, TrendingUp,
  DollarSign, Target, Clock, Sparkles, Activity, Menu
} from 'lucide-react';
import PipelineBoard from './components/PipelineBoard';
import PipelineList from './components/PipelineList';
import PipelineStats from './components/PipelineStats';
import PipelineFilters from './components/PipelineFilters';
import CreateDealModal from './components/CreateDealModal';
import EditDealModal from './components/EditDealModal';
import DeleteDealModal from './components/DeleteDealModal';
import CreatePipelineModal from './components/CreatePipelineModal';
import EditPipelineModal from './components/EditPipelineModal';
import DeletePipelineModal from './components/DeletePipelineModal';
import PipelineSelector from './components/PipelineSelector';
import { usePipelineStore } from '@/lib/pipelineStore';

const DEAL_STATUSES = ['PENDING', 'ACTIVE', 'WON', 'LOST', 'CLOSED', 'ON_HOLD'];

export default function PipelinePage() {
  const { pipelines, loadPipelines, addPipeline, updatePipeline, deletePipeline } = usePipelineStore();

  const [view, setView] = useState<'board' | 'list'>('board');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showEditDeal, setShowEditDeal] = useState(false);
  const [showDeleteDeal, setShowDeleteDeal] = useState(false);
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [showEditPipeline, setShowEditPipeline] = useState(false);
  const [showDeletePipeline, setShowDeletePipeline] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [selectedPipeline, setSelectedPipeline] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({});
  const [selected, setSelected] = useState('');
  const [deals, setDeals] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadPipelines();
  }, [loadPipelines]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || '';

    fetch(`${base}/deals`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDeals(data); })
      .catch(() => { });

    fetch(`${base}/leads`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLeads(data); })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (pipelines.length > 0 && !selected) {
      setSelected(String(pipelines[0].id));
    }
  }, [pipelines, selected]);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 768) setSidebarOpen(false); };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPipeline = pipelines.find(p => String(p.id) === selected);

  const enrichedDeals = deals.map(d => {
    const lead = leads.find(l => l.id === d.leadId);
    const pipelineId = d.pipelineId ? String(d.pipelineId) : (lead ? String(lead.pipelineId) : null);
    return { ...d, pipelineId };
  });

  const filteredDeals = enrichedDeals.filter(d => {
    if (d.pipelineId !== selected) return false;
    if (search && !d.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.stage && d.status !== filters.stage) return false;
    if (filters.min && d.amount < filters.min) return false;
    if (filters.max && d.amount > filters.max) return false;
    return true;
  });

  const handleEditDeal = (deal: any) => { setSelectedDeal(deal); setShowEditDeal(true); };
  const handleDeleteDeal = (deal: any) => { setSelectedDeal(deal); setShowDeleteDeal(true); };

  const handleUpdateDeal = async (dealId: number, updatedData: any) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/deals/${dealId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const updated = await res.json();
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...updated } : d));
      }
    } catch (e) { }
    setShowEditDeal(false);
    setSelectedDeal(null);
  };

  const handleDeleteDealConfirm = async (dealId: number) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      await fetch(`${base}/deals/${dealId}`, { method: 'DELETE', credentials: 'include' });
    } catch (e) { }
    setDeals(prev => prev.filter(d => d.id !== dealId));
    setShowDeleteDeal(false);
    setSelectedDeal(null);
  };

  const handleEditPipeline = (pipeline: any) => { setSelectedPipeline(pipeline); setShowEditPipeline(true); };
  const handleDeletePipeline = (pipeline: any) => { setSelectedPipeline(pipeline); setShowDeletePipeline(true); };

  const handleUpdatePipeline = (id: number, data: any) => {
    updatePipeline(id, data);
    setShowEditPipeline(false);
    setSelectedPipeline(null);
  };

  const handleDeletePipelineConfirm = async (id: number) => {
    const leadsToDetach = leads.filter(l => String(l.pipelineId) === String(id));
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    await Promise.all(leadsToDetach.map(l =>
      fetch(`${base}/leads/${l.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId: null })
      }).catch(() => { })
    ));
    setLeads(prev => prev.map(l => String(l.pipelineId) === String(id) ? { ...l, pipelineId: null } : l));

    deletePipeline(id);
    if (String(id) === selected && pipelines.length > 1) {
      const remaining = pipelines.filter(p => p.id !== id);
      setSelected(remaining.length > 0 ? String(remaining[0].id) : '');
    }
    setShowDeletePipeline(false);
    setSelectedPipeline(null);
  };

  const handleCreateDeal = async (data: any) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const dealToCreate = { ...data, pipelineId: Number(selected) };
      const res = await fetch(`${base}/deals`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealToCreate),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(`Error: ${err.message || 'Failed to create deal'}`);
        return;
      }
      const newDeal = await res.json();
      // If backend didn't persist pipelineId or returned a different one, attempt to persist it server-side
      const desiredPipelineId = Number(selected);
      if (!newDeal.pipelineId || Number(newDeal.pipelineId) !== desiredPipelineId) {
        try {
          await fetch(`${base}/deals/${newDeal.id}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pipelineId: desiredPipelineId }),
          });
          newDeal.pipelineId = desiredPipelineId;
        } catch (e) {
          console.warn('Could not persist pipelineId for deal', e);
        }
      }
      setDeals(prev => [newDeal, ...prev]);
      setShowCreateDeal(false);
    } catch (e) {
      toast.error('Network error: could not create deal');
    }
  };

  const handleCreatePipeline = async (data: any) => {
    await addPipeline(data);
    setShowCreatePipeline(false);
  };

  const handleDragEnd = async (dealId: number, from: string, to: string) => {
    // Optimistic update
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: to } : d));

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/deals/${dealId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: to }),
      });
      if (!res.ok) {
        // Revert on failure
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: from } : d));
      }
    } catch (error) {
      // Revert on error
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: from } : d));
    }
  };

  const pipelinesAsCards = pipelines.map(p => ({
    id: String(p.id),
    name: p.name,
    color: 'emerald',
    dealsCount: enrichedDeals.filter(d => d.pipelineId === String(p.id)).length,
    value: enrichedDeals.filter(d => d.pipelineId === String(p.id)).reduce((s: number, d: any) => s + (d.amount || 0), 0),
    favorite: false,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu size={20} className="text-gray-600" />
            </button>
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-20" />
              <div className="relative bg-emerald-600 rounded-lg p-1.5 sm:p-2">
                <Sparkles size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">Pipeline</h1>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <Activity size={12} className="flex-shrink-0" /><span className="truncate">Track deals in real-time</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button onClick={() => setShowCreateDeal(true)} className="relative group">
              <div className="absolute inset-0 bg-emerald-600 rounded-lg blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg text-xs sm:text-sm">
                <Plus size={14} /> New Deal
              </div>
            </button>
            <button onClick={() => setShowCreatePipeline(true)} className="relative group hidden sm:block">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">
                <Plus size={18} /> New Pipeline
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        {/* Pipeline Selector */}
        <div className="mb-4 overflow-x-auto pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4">
          <div className="min-w-max">
            <PipelineSelector
              pipelines={pipelinesAsCards}
              selected={selected}
              onSelect={setSelected}
              onCreate={() => setShowCreatePipeline(true)}
              onEdit={(p: any) => handleEditPipeline(pipelines.find(pl => String(pl.id) === p.id))}
              onDelete={(p: any) => handleDeletePipeline(pipelines.find(pl => String(pl.id) === p.id))}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 sm:mb-6">
          <PipelineStats deals={filteredDeals} />
        </div>

        {/* Active Filters */}
        {(filters.stage || filters.owner) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-2 sm:p-3 bg-emerald-50 rounded-lg">
            <span className="text-xs text-emerald-700 font-medium">Active filters:</span>
            {filters.stage && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-emerald-700 rounded-lg text-xs">
                Stage: {filters.stage}
                <button onClick={() => setFilters({ ...filters, stage: undefined })}>×</button>
              </span>
            )}
            <button onClick={() => setFilters({})} className="text-xs text-emerald-600 ml-auto">Clear all</button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="bg-gray-100 p-1 rounded-lg flex-shrink-0">
              <div className="flex items-center gap-1">
                <button onClick={() => setView('board')} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === 'board' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                  <LayoutGrid size={16} /> Board <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-full">{filteredDeals.length}</span>
                </button>
                <button onClick={() => setView('list')} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${view === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}>
                  <ListIcon size={16} /> List <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-full">{filteredDeals.length}</span>
                </button>
              </div>
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${Object.keys(filters).length > 0 ? 'bg-emerald-600 text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Filter size={16} /> Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4">
            <PipelineFilters onClose={() => setShowFilters(false)} onApply={(f: any) => { setFilters(f); setShowFilters(false); }} initialFilters={filters} stages={DEAL_STATUSES} />
          </div>
        )}

        {/* Pipeline View */}
        <div className="bg-white rounded-xl sm:rounded-2xl border shadow-lg overflow-hidden">
          {view === 'board' ? (
            <PipelineBoard deals={filteredDeals} stages={DEAL_STATUSES} onDragEnd={handleDragEnd} onEdit={handleEditDeal} onDelete={handleDeleteDeal} />
          ) : (
            <div className="overflow-x-auto">
              <PipelineList deals={filteredDeals} onEdit={handleEditDeal} onDelete={handleDeleteDeal} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateDeal && <CreateDealModal onClose={() => setShowCreateDeal(false)} onCreate={handleCreateDeal} stages={DEAL_STATUSES} />}
      {showEditDeal && selectedDeal && <EditDealModal deal={selectedDeal} onClose={() => { setShowEditDeal(false); setSelectedDeal(null); }} onSave={handleUpdateDeal} stages={DEAL_STATUSES} />}
      {showDeleteDeal && selectedDeal && <DeleteDealModal deal={selectedDeal} onClose={() => { setShowDeleteDeal(false); setSelectedDeal(null); }} onConfirm={handleDeleteDealConfirm} />}
      {showCreatePipeline && <CreatePipelineModal onClose={() => setShowCreatePipeline(false)} onCreate={handleCreatePipeline} />}
      {showEditPipeline && selectedPipeline && <EditPipelineModal pipeline={selectedPipeline} onClose={() => { setShowEditPipeline(false); setSelectedPipeline(null); }} onSave={handleUpdatePipeline} />}
      {showDeletePipeline && selectedPipeline && <DeletePipelineModal pipeline={selectedPipeline} onClose={() => { setShowDeletePipeline(false); setSelectedPipeline(null); }} onConfirm={handleDeletePipelineConfirm} />}
    </div>
  );
}