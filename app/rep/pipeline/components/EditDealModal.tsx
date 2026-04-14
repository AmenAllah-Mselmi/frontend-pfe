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

export default function EditDealModal({ deal, onClose, onSave, stages = [] }: any) {
  const [formData, setFormData] = useState({
    name: deal.name || '',
    amount: deal.amount ?? '',
    probability: deal.probability ?? 50,
    status: deal.status || stages[0] || 'PENDING',
    expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
    leadId: deal.leadId ? String(deal.leadId) : ''
  });

  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);

  useEffect(() => {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      fetch(`${base}/leads`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => setLeads(data))
        .catch(() => { });
      setLoadingLeads(false);
  }, []);

  const filteredLeads = leads.filter(l =>
    l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const selectedLead = leads.find(l => String(l.id) === String(formData.leadId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(deal.id, {
      ...formData,
      amount: Number(formData.amount),
      probability: Number(formData.probability),
      leadId: formData.leadId ? Number(formData.leadId) : undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Edit Deal</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Deal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deal Name *</label>
            <input type="text" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Deal Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" required />
          </div>

          {/* Lead Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lead</label>
            {selectedLead && !showLeadPicker ? (
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
                <button type="button" onClick={() => setShowLeadPicker(true)} className="text-xs text-emerald-600 hover:text-emerald-800">Change</button>
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
                        onClick={() => { setFormData({ ...formData, leadId: String(lead.id) }); setShowLeadPicker(false); setLeadSearch(''); }}
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
                <input type="number" value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Probability (%)</label>
              <select value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => <option key={p} value={p}>{p}%</option>)}
              </select>
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                {(stages.length > 0 ? stages : Object.keys(STATUS_LABELS)).map((s: string) => (
                  <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Close Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3 text-gray-400" />
                <input type="date" value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                  className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}