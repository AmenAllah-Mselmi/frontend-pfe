'use client';
import { useState } from 'react';
import { X, Users, Building2, Tag, Calendar, Star } from 'lucide-react';

export default function ContactsFilters({ onClose, onApply }: any) {
  const [filters, setFilters] = useState({});
  const [statuses, setStatuses] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [owner, setOwner] = useState<string>('');

  const statusOptions = ['Active', 'Inactive', 'Lead'];
  const sourceOptions = ['Website', 'Referral', 'Event', 'LinkedIn', 'Import'];
  const ownerOptions = ['Mine', 'Team', 'All'];

  return (
    <div className="bg-white rounded-xl border shadow-lg">
      <div className="p-4 border-b flex justify-between">
        <h3 className="font-semibold">Filter Contacts</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Owner Filter */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Star size={14} />Owner</label>
          <div className="flex gap-2">
            {ownerOptions.map(o => (
              <button key={o} className={`flex-1 px-3 py-2 text-xs rounded-lg ${owner === o ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setOwner(o)}>{o}</button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Tag size={14} />Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(s => (
              <button key={s} className={`px-3 py-1 text-xs rounded-full ${statuses.includes(s) ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setStatuses(statuses.includes(s) ? statuses.filter(x => x !== s) : [...statuses, s])}>{s}</button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Calendar size={14} />Source</label>
          <div className="flex flex-wrap gap-2">
            {sourceOptions.map(s => (
              <button key={s} className={`px-3 py-1 text-xs rounded-full ${sources.includes(s) ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}
                onClick={() => setSources(sources.includes(s) ? sources.filter(x => x !== s) : [...sources, s])}>{s}</button>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-2"><Building2 size={14} />Company</label>
          <input type="text" placeholder="Company name" className="w-full p-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="p-4 border-t flex justify-end gap-2">
        <button className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg" onClick={() => { setFilters({}); setStatuses([]); setSources([]); setOwner(''); onApply({}); }}>Clear</button>
        <button className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg" onClick={() => onApply({...filters, statuses, sources, owner})}>Apply</button>
      </div>
    </div>
  );
}