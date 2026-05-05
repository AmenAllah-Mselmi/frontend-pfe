'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Search, User, Target, GitBranch } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  WON: 'Won',
  LOST: 'Lost',
  CLOSED: 'Closed',
  ON_HOLD: 'On Hold',
};

export default function EditDealModal({ deal, onClose, onSave, stages = [] }: any) {
  const [leads, setLeads] = useState<any[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: deal.name || '',
      amount: deal.amount ?? '',
      probability: deal.probability ?? 50,
      status: deal.status || stages[0] || 'PENDING',
      expectedCloseDate: deal.expectedCloseDate ? deal.expectedCloseDate.split('T')[0] : '',
      leadId: deal.leadId ? String(deal.leadId) : ''
    },
    validationSchema: {
      name: [validators.required, validators.minLength(3)],
      amount: [validators.required, validators.minValue(0)],
      leadId: [validators.required],
      expectedCloseDate: [validators.required]
    },
    onSubmit: (data) => {
      onSave(deal.id, {
        ...data,
        amount: Number(data.amount),
        probability: Number(data.probability),
        leadId: data.leadId ? Number(data.leadId) : undefined
      });
      onClose();
    }
  });

  useEffect(() => {
    setLoadingLeads(true);
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/leads?page=1&limit=1000`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLeads(data);
        } else if (data && Array.isArray(data.data)) {
          setLeads(data.data);
        } else if (data && Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      })
      .catch(() => { })
      .finally(() => setLoadingLeads(false));
  }, []);

  const filteredLeads = leads.filter(l =>
    l.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
    l.email?.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const selectedLead = leads.find(l => String(l.id) === String(values.leadId));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">Edit Deal</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Deal Name"
            name="name"
            error={errors.name}
            touched={touched.name}
            icon={Target}
            required
          >
            <input
              placeholder="e.g. Enterprise License"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
            />
          </FormField>

          <FormField
            label="Associated Lead"
            name="leadId"
            error={errors.leadId}
            touched={touched.leadId}
            required
          >
            {selectedLead && !showLeadPicker ? (
              <div className="flex items-center justify-between p-3 border border-emerald-200 bg-emerald-50 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{selectedLead.name}</p>
                    <p className="text-xs text-gray-500">{selectedLead.email}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowLeadPicker(true)} 
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 p-1"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lead by name or email..."
                    className="w-full pl-10 pr-4 py-3 text-sm border-b border-gray-100 focus:outline-none bg-gray-50/50"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto bg-white">
                  {loadingLeads ? (
                    <div className="flex flex-col items-center py-6 gap-2">
                       <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-xs text-gray-400">Loading leads...</p>
                    </div>
                  ) : filteredLeads.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-6 italic">No leads found</p>
                  ) : (
                    filteredLeads.map(lead => (
                      <button
                        key={lead.id}
                        type="button"
                        onClick={() => { handleChange('leadId', String(lead.id)); setShowLeadPicker(false); setLeadSearch(''); handleBlur('leadId'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{lead.name}</p>
                          <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Amount (€)"
              name="amount"
              error={errors.amount}
              touched={touched.amount}
              icon={DollarSign}
              required
            >
              <input 
                type="number"
                placeholder="0"
                value={values.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
              />
            </FormField>

            <FormField
              label="Probability (%)"
              name="probability"
              icon={Target}
            >
              <select 
                value={values.probability} 
                onChange={(e) => handleChange('probability', Number(e.target.value))}
                className="appearance-none"
              >
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
                  <option key={p} value={p}>{p}%</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Status"
              name="status"
              icon={GitBranch}
            >
              <select 
                value={values.status} 
                onChange={(e) => handleChange('status', e.target.value)}
                className="appearance-none"
              >
                {(stages.length > 0 ? stages : Object.keys(STATUS_LABELS)).map((s: string) => (
                  <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Expected Close Date"
              name="expectedCloseDate"
              error={errors.expectedCloseDate}
              touched={touched.expectedCloseDate}
              icon={Calendar}
              required
            >
              <input 
                type="date" 
                value={values.expectedCloseDate} 
                onChange={(e) => handleChange('expectedCloseDate', e.target.value)} 
                onBlur={() => handleBlur('expectedCloseDate')}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}