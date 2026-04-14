'use client';
import { useState, useEffect } from 'react';
import {
  Search, Filter, Plus, LayoutGrid, List,
  MoreHorizontal, Star, X, Edit, Copy, Trash2,
  Sparkles, Activity, TrendingUp, DollarSign, Target, Clock
} from 'lucide-react';
import PipelineBoard from './components/PipelineBoard';
import PipelineList from './components/PipelineList';
import PipelineFilters from './components/PipelineFilters';
import CreateDealModal from './components/CreateDealModal';
import EditDealModal from './components/EditDealModal';
import DeleteDealModal from './components/DeleteDealModal';
import CreatePipelineModal from './components/CreatePipelineModal';
import EditPipelineModal from './components/EditPipelineModal';
import DeletePipelineModal from './components/DeletePipelineModal';
import { usePipelineStore, Pipeline } from '@/lib/pipelineStore';

// Deal stages grouped by backend PipelineStage enum values
const DEAL_STATUSES = ['PENDING', 'ACTIVE', 'WON', 'LOST', 'CLOSED', 'ON_HOLD'];

export default function PipelinePage() {
  const { pipelines, loadPipelines, addPipeline, updatePipeline, deletePipeline } = usePipelineStore();

  // Normalize pipelines into a typed array in case API returns a wrapper
  const pipelineList: Pipeline[] = Array.isArray(pipelines)
    ? pipelines
    : Array.isArray((pipelines as unknown as { pipelines?: Pipeline[] })?.pipelines)
    ? (pipelines as unknown as { pipelines: Pipeline[] }).pipelines
    : [];

  const [view, setView] = useState<'board' | 'list'>('board');
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showEditDeal, setShowEditDeal] = useState(false);
  const [showDeleteDeal, setShowDeleteDeal] = useState(false);
  const [showCreatePipeline, setShowCreatePipeline] = useState(false);
  const [showEditPipeline, setShowEditPipeline] = useState(false);
  const [showDeletePipeline, setShowDeletePipeline] = useState(false);
  const [showPipelineMenu, setShowPipelineMenu] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [selectedPipelineItem, setSelectedPipelineItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  // Local deals state aligned to backend schema
  const [deals, setDeals] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

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
    if (pipelineList.length > 0 && !selectedPipeline) {
      setSelectedPipeline(String(pipelineList[0].id));
    }
  }, [pipelineList, selectedPipeline]);

  // Enrich deals with pipelineId mapping from their lead
  const enrichedDeals = deals.map(d => {
    const lead = leads.find(l => l.id === d.leadId);
    const pipelineId = d.pipelineId ? String(d.pipelineId) : (lead ? String(lead.pipelineId) : null);
    return { ...d, pipelineId };
  });

  // Group deals into stages for the board
  const filteredDeals = enrichedDeals.filter(d => {
    const matchesPipeline = !selectedPipeline || d.pipelineId === selectedPipeline;
    const matchesSearch = !searchQuery ||
      d.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !activeFilters.stage || d.status === activeFilters.stage;
    const matchesMinValue = !activeFilters.minValue || d.amount >= activeFilters.minValue;
    const matchesMaxValue = !activeFilters.maxValue || d.amount <= activeFilters.maxValue;
    return matchesPipeline && matchesSearch && matchesStage && matchesMinValue && matchesMaxValue;
  });

  const stages = DEAL_STATUSES.map(status => ({
    id: status,
    name: status,
    color: '',
    deals: filteredDeals.filter(d => d.status === status)
  }));

  const handleEditDeal = (deal: any) => {
    setSelectedDeal(deal);
    setShowEditDeal(true);
  };

  const handleDeleteDeal = (deal: any) => {
    setSelectedDeal(deal);
    setShowDeleteDeal(true);
  };

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

  const handleEditPipeline = (pipeline: any) => {
    setSelectedPipelineItem(pipeline);
    setShowEditPipeline(true);
    setShowPipelineMenu(false);
  };

  const handleDeletePipeline = (pipeline: any) => {
    setSelectedPipelineItem(pipeline);
    setShowDeletePipeline(true);
    setShowPipelineMenu(false);
  };

  const handleUpdatePipeline = (pipelineId: number, updatedData: any) => {
    updatePipeline(pipelineId, updatedData);
    setShowEditPipeline(false);
    setSelectedPipelineItem(null);
  };

  const handleDeletePipelineConfirm = async (pipelineId: number) => {
    const leadsToDetach = leads.filter(l => String(l.pipelineId) === String(pipelineId));
    // Detach leads before deleting the pipeline to prevent FK constraint errors
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    await Promise.all(leadsToDetach.map(l =>
      fetch(`${base}/leads/${l.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId: null })
      }).catch(() => { })
    ));
    setLeads(prev => prev.map(l => String(l.pipelineId) === String(pipelineId) ? { ...l, pipelineId: null } : l));

    deletePipeline(pipelineId);
    if (String(pipelineId) === selectedPipeline && pipelines.length > 1) {
      const remaining = pipelines.filter(p => p.id !== pipelineId);
      setSelectedPipeline(remaining.length > 0 ? String(remaining[0].id) : '');
    }
    setShowDeletePipeline(false);
    setSelectedPipelineItem(null);
  };

  const handleDuplicatePipeline = (pipeline: any) => {
    addPipeline({ name: `${pipeline.name} (Copy)`, stage: pipeline.stage });
    setShowPipelineMenu(false);
  };

  const handleCreatePipeline = async (pipelineData: any) => {
    await addPipeline(pipelineData);
  };

  const handleCreateDeal = async (dealData: any) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const dealToCreate = { ...dealData, pipelineId: Number(selectedPipeline) };

      const res = await fetch(`${base}/deals`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealToCreate),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to create deal'}`);
        return;
      }
      const newDeal = await res.json();
      // If backend didn't persist pipelineId or returned a different one, attempt to persist it server-side
      const desiredPipelineId = Number(selectedPipeline);
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
      alert('Network error: could not create deal');
    }
  };

  const handleDragEnd = async (dealId: number, sourceStage: string, targetStage: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: targetStage } : d));

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/deals/${dealId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStage }),
      });
      if (!res.ok) {
        setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: sourceStage } : d));
      }
    } catch (error) {
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: sourceStage } : d));
    }
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  const totalDeals = deals.length;
  const totalValue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const avgValue = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
  const closedDeals = deals.filter(d => d.status === 'CLOSED').length;
  const conversionRate = totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0;

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Pipeline</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Activity size={14} /> Track and manage your deals in real-time</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button onClick={() => setShowCreateDeal(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-xs sm:text-sm font-medium whitespace-nowrap">New Deal</span>
              </div>
            </button>
            <button onClick={() => setShowCreatePipeline(true)} className="flex-1 sm:flex-none relative group">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur opacity-60 group-hover:opacity-80" />
              <div className="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-xl">
                <Plus size={18} /><span className="text-xs sm:text-sm font-medium whitespace-nowrap">New Pipeline</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Deals', value: totalDeals, icon: TrendingUp, color: 'blue', change: '' },
            { label: 'Total Value', value: `${totalValue.toLocaleString()}€`, icon: DollarSign, color: 'green', change: '' },
            { label: 'Avg Value', value: `${avgValue.toLocaleString()}€`, icon: Target, color: 'blue', change: '' },
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: Clock, color: 'orange', change: '' },
          ].map((stat) => {
            const Icon = stat.icon;
            const colorClass = stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                             stat.color === 'green' ? 'bg-green-50 text-green-600' :
                             stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                             'bg-gray-50 text-gray-600';
            return (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition group">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 ${colorClass} rounded-lg group-hover:scale-110 transition`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Pipeline Selector */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/80 p-3 mb-4 shadow-sm flex items-center justify-between gap-2 overflow-visible">
          <div className="flex items-center gap-2 overflow-x-auto flex-grow pb-1 -mb-1">
            {pipelineList.map((pipeline) => (
              <button
                key={pipeline.id}
                onClick={() => setSelectedPipeline(String(pipeline.id))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedPipeline === String(pipeline.id)
                  ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                  }`}
              >
                {pipeline.name}
                <span className="text-xs text-gray-400 ml-1">{enrichedDeals.filter(d => d.pipelineId === String(pipeline.id)).length}</span>
              </button>
            ))}
            <button onClick={() => setShowCreatePipeline(true)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition shrink-0">
              <Plus size={18} />
            </button>
          </div>
          <div className="relative border-l border-gray-200 pl-2 shrink-0">
            <button onClick={() => setShowPipelineMenu(!showPipelineMenu)} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition shadow-sm">
              <Edit size={14} /> Actions
            </button>
            {showPipelineMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowPipelineMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                  {pipelineList.filter(p => String(p.id) === selectedPipeline).map((pipeline) => (
                    <div key={pipeline.id}>
                      <button onClick={() => handleEditPipeline(pipeline)} className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <Edit size={14} className="text-gray-400" /> Edit Pipeline
                      </button>
                      <button onClick={() => handleDuplicatePipeline(pipeline)} className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                        <Copy size={14} className="text-gray-400" /> Duplicate
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => handleDeletePipeline(pipeline)} className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <Trash2 size={14} /> Delete Pipeline
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* View Toggle & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex justify-center">
              <div className="flex items-center gap-1">
                <button onClick={() => setView('board')} className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'board' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setView('list')} className={`flex-1 sm:flex-none p-2 rounded-lg transition ${view === 'list' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                  <List size={18} />
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deals..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${Object.keys(activeFilters).length > 0
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-md'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}</span>
          </button>
        </div >

        {/* Active Filters */}
        {
          Object.keys(activeFilters).length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-600 font-medium">Active filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded-lg text-xs shadow-sm">
                  {key}: {String(value)}
                  <button onClick={() => { const f = { ...activeFilters }; delete f[key]; setActiveFilters(f); }} className="hover:text-blue-900 ml-1"><X size={12} /></button>
                </span>
              ))}
              <button onClick={() => setActiveFilters({})} className="text-xs text-blue-600 hover:text-blue-800 ml-auto font-medium">Clear all</button>
            </div>
          )
        }

        {/* Filter Panel */}
        {
          showFilters && (
            <div className="mb-4 animate-in slide-in-from-top duration-300">
              <PipelineFilters onClose={() => setShowFilters(false)} onApply={handleApplyFilters} initialFilters={activeFilters} />
            </div>
          )
        }

        {/* Pipeline View */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {view === 'board' ? (
            <PipelineBoard stages={stages} onDragEnd={handleDragEnd} onEdit={handleEditDeal} onDelete={handleDeleteDeal} />
          ) : (
            <PipelineList deals={filteredDeals} onEdit={handleEditDeal} onDelete={handleDeleteDeal} />
          )}
        </div>
      </div >

      {/* Modals */}
      {
        showCreateDeal && (
          <CreateDealModal
            onClose={() => setShowCreateDeal(false)}
            onCreateDeal={handleCreateDeal}
            stages={DEAL_STATUSES}
            owners={[]}
          />
        )
      }
      {
        showEditDeal && selectedDeal && (
          <EditDealModal
            deal={selectedDeal}
            onClose={() => { setShowEditDeal(false); setSelectedDeal(null); }}
            onSave={handleUpdateDeal}
            stages={DEAL_STATUSES}
          />
        )
      }
      {
        showDeleteDeal && selectedDeal && (
          <DeleteDealModal
            deal={selectedDeal}
            onClose={() => { setShowDeleteDeal(false); setSelectedDeal(null); }}
            onConfirm={handleDeleteDealConfirm}
          />
        )
      }
      {
        showCreatePipeline && (
          <CreatePipelineModal onClose={() => setShowCreatePipeline(false)} onCreatePipeline={handleCreatePipeline} />
        )
      }
      {
        showEditPipeline && selectedPipelineItem && (
          <EditPipelineModal
            pipeline={selectedPipelineItem}
            onClose={() => { setShowEditPipeline(false); setSelectedPipelineItem(null); }}
            onSave={handleUpdatePipeline}
          />
        )
      }
      {
        showDeletePipeline && selectedPipelineItem && (
          <DeletePipelineModal
            pipeline={selectedPipelineItem}
            onClose={() => { setShowDeletePipeline(false); setSelectedPipelineItem(null); }}
            onConfirm={handleDeletePipelineConfirm}
          />
        )
      }
    </div >
  );
}