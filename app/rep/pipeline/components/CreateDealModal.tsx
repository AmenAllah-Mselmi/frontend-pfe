'use client';
import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Search, User } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  WON: 'Won',
  LOST: 'Lost',
  CLOSED: 'Closed',
  ON_HOLD: 'On Hold',
};

export default function CreateDealModal({ onClose, onCreate, stages = [] }: any) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    probability: '50',
    status: stages[0] || 'PENDING',
    expectedCloseDate: new Date().toISOString().split('T')[0],
    leadId: ''
  });

  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
    setLoadingLeads(true);
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${base}/leads`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setLeads(data); })
        .catch(() => { })
        .finally(() => setLoadingLeads(false));
  }, []);

  const filteredLeads = leads.filter(l =>
    l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const selectedLead = leads.find(l => String(l.id) === String(form.leadId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...form,
      amount: Number(form.amount),
      probability: Number(form.probability),
      leadId: form.leadId ? Number(form.leadId) : undefined,
      expectedCloseDate: new Date(form.expectedCloseDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Create New Deal</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Deal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deal Name *</label>
            <input placeholder="Deal Name" required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          {/* Lead Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead *</label>
            {selectedLead ? (
              <div className="flex items-center justify-between p-3 border border-emerald-400 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.name}</p>
                    <p className="text-xs text-gray-500">{selectedLead.email}</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setForm({ ...form, leadId: '' }); setLeadSearch(''); }} className="text-xs text-red-500 hover:text-red-700">Change</button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" placeholder="Search lead by name or email..."
                    className="w-full pl-9 p-3 text-sm border-b focus:outline-none"
                    value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} />
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {loadingLeads ? (
                    <p className="text-center text-sm text-gray-400 py-4">Loading leads...</p>
                  ) : filteredLeads.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-4">No leads found</p>
                  ) : (
                    filteredLeads.map(lead => (
                      <button key={lead.id} type="button"
                        onClick={() => setForm({ ...form, leadId: String(lead.id) })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b last:border-0">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User size={13} className="text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lead.name}</p>
                          <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Amount & Probability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (€)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type="number" required placeholder="0"
                  className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
              <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.probability} onChange={(e) => setForm({ ...form, probability: e.target.value })}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => <option key={p} value={p}>{p}%</option>)}
              </select>
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {(stages.length > 0 ? stages : Object.keys(STATUS_LABELS)).map((s: string) => (
                  <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type="date" className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={form.expectedCloseDate} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={!form.leadId} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">Create Deal</button>
          </div>
        </form>
      </div>
    </div>
  );
}