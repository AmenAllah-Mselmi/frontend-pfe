'use client';
import { useState, useEffect } from 'react';
import { X, Users, Building2, Calendar, Tag, Filter, Search } from 'lucide-react';
import { useUserStore } from '@/lib/userStore';
import { useCompanyStore } from '@/lib/companyStore';
import { usePipelineStore } from '@/lib/pipelineStore';

export default function AnalyticsFilters({ onClose, onApply }: { onClose: () => void; onApply?: (f: any) => void }) {
  const [filters, setFilters] = useState({ userId: '', status: '', companyId: '', pipelineId: '', search: '' });
  const { users, loadUsers } = useUserStore();
  const { companies, loadCompanies } = useCompanyStore();
  const { pipelines, loadPipelines } = usePipelineStore();

  useEffect(() => { loadUsers(); loadCompanies(); loadPipelines(); }, [loadUsers, loadCompanies, loadPipelines]);

  const userList = Array.isArray(users) ? users : [];
  const companyList = Array.isArray(companies) ? companies : [];
  const pipelineList = Array.isArray(pipelines) ? pipelines : [];

  const handleApply = () => { if (onApply) onApply(filters); };
  const handleReset = () => { setFilters({ userId: '', status: '', companyId: '', pipelineId: '', search: '' }); if (onApply) onApply({}); };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2"><Filter size={18} className="text-blue-600" /><h3 className="font-semibold text-gray-900">Filtres Analytiques</h3></div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Search size={14} /> Recherche rapide</label>
        <input type="text" placeholder="Rechercher..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Users size={14} /> Utilisateur</label>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={filters.userId} onChange={e => setFilters({ ...filters, userId: e.target.value })}>
            <option value="">Tous</option>
            {userList.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Tag size={14} /> Statut Lead</label>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Tous</option>
            <option value="NEW">Nouveau</option>
            <option value="CONTACTED">Contacté</option>
            <option value="QUALIFIED">Qualifié</option>
            <option value="LOST">Perdu</option>
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Building2 size={14} /> Company</label>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={filters.companyId} onChange={e => setFilters({ ...filters, companyId: e.target.value })}>
            <option value="">Toutes</option>
            {companyList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Calendar size={14} /> Pipeline</label>
          <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" value={filters.pipelineId} onChange={e => setFilters({ ...filters, pipelineId: e.target.value })}>
            <option value="">Toutes</option>
            {pipelineList.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Réinitialiser</button>
        <button onClick={handleApply} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">Appliquer</button>
      </div>
    </div>
  );
}