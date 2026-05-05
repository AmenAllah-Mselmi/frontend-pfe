'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Mail, Phone, CheckCircle, Target, DollarSign, GitBranch, Search } from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';
import { useLeadStore } from '@/lib/leadStore';
import { useContactStore } from '@/lib/contactStore';
import { usePipelineStore } from '@/lib/pipelineStore';
import { useTaskStore } from '@/lib/taskStore';
import { useTicketStore } from '@/lib/ticketStore';
import { useAuthStore } from '@/lib/authStore';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface CreateActivityModalProps {
  onClose: () => void;
  onCreate: (data: any) => void;
  currentUser: string;
}

export default function CreateActivityModal({ onClose, onCreate, currentUser }: CreateActivityModalProps) {
  const { addActivity } = useActivityStore();
  const { leads, loadLeads } = useLeadStore();
  const { contacts, loadContacts } = useContactStore();
  const { pipelines, loadPipelines } = usePipelineStore();
  const { tasks, loadTasks } = useTaskStore();
  const { tickets, loadTickets } = useTicketStore();
  const { user } = useAuthStore();
  const [deals, setDeals] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState('');

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setValues } = useForm({
    initialValues: {
      type: 'note_added',
      title: '',
      description: '',
      entity: 'lead',
      entityId: '',
      metadata: ''
    },
    validationSchema: {
      title: [validators.required, validators.minLength(5)],
      entityId: [validators.required],
      metadata: [(val: string) => {
        if (!val) return null;
        try {
          JSON.parse(val);
          return null;
        } catch (e) {
          return 'Format JSON invalide (ex: {"key": "value"})';
        }
      }]
    },
    onSubmit: async (data) => {
      let metadata = {};
      try {
        if (data.metadata) metadata = JSON.parse(data.metadata);
      } catch {
        metadata = { note: data.metadata };
      }

      const newActivity = {
        ...data,
        id: Date.now(),
        entityId: parseInt(data.entityId) || 0,
        metadata,
        userId: user?.id || 1,
        user: user ? { 
          name: user.name, 
          avatar: user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() 
        } : { name: 'Alex Morgan', avatar: 'AM' },
        timestamp: new Date().toISOString()
      };

      await addActivity(newActivity);
      onClose();
    }
  });

  useEffect(() => {
    loadLeads(1, 1000);
    loadContacts(1, 1000);
    loadPipelines();
    loadTasks();
    loadTickets(1, 1000);

    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/deals`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDeals(data); })
      .catch(() => { });
  }, [loadLeads, loadContacts, loadPipelines, loadTasks, loadTickets]);

  const activityTypes = [
    { value: 'deal_created', label: 'Deal Created', icon: DollarSign },
    { value: 'deal_won', label: 'Deal Won', icon: CheckCircle },
    { value: 'lead_status_change', label: 'Lead Status Change', icon: Target },
    { value: 'note_added', label: 'Note Added', icon: FileText },
    { value: 'email_sent', label: 'Email Sent', icon: Mail },
    { value: 'call_logged', label: 'Call Logged', icon: Phone },
    { value: 'task_completed', label: 'Task Completed', icon: CheckCircle },
    { value: 'pipeline_created', label: 'Pipeline Created', icon: GitBranch },
  ];

  const entities = [
    { value: 'lead', label: 'Lead' },
    { value: 'deal', label: 'Deal' },
    { value: 'contact', label: 'Contact' },
    { value: 'task', label: 'Task' },
    { value: 'pipeline', label: 'Pipeline' },
    { value: 'ticket', label: 'Ticket' }
  ];

  const getFilteredItems = () => {
    const q = searchTerm.toLowerCase();
    switch (values.entity) {
      case 'lead':
        return leads.filter(l => (l.name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q));
      case 'deal':
        return deals.filter(d => (d.name || '').toLowerCase().includes(q));
      case 'contact':
        return contacts.filter(c => (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q));
      case 'task':
        return tasks.filter(t => (t.title || '').toLowerCase().includes(q));
      case 'pipeline':
        return pipelines.filter(p => (p.name || '').toLowerCase().includes(q));
      case 'ticket':
        return tickets.filter(t => (t.title || '').toLowerCase().includes(q) || (t.id.toString()).includes(q));
      default:
        return [];
    }
  };

  const handleSelectItem = (item: any) => {
    const name = item.name || item.title || `ID: ${item.id}`;
    setValues(prev => ({
      ...prev,
      entityId: item.id.toString(),
      title: prev.title || `Activity for ${name}`,
    }));
    setSelectedEntityName(name);
    setShowSelector(false);
    setSearchTerm('');
  };

  const selectedType = activityTypes.find(t => t.value === values.type);
  const Icon = selectedType?.icon || FileText;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Icon size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Log Activity</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Activity Type"
            name="type"
            icon={GitBranch}
          >
            <select
              value={values.type}
              onChange={e => handleChange('type', e.target.value)}
              className="appearance-none"
            >
              {activityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </FormField>

          <FormField
            label="Title"
            name="title"
            error={errors.title}
            touched={touched.title}
            icon={FileText}
            required
          >
            <input
              type="text"
              value={values.title}
              onChange={e => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="e.g., Call with client"
            />
          </FormField>

          <FormField
            label="Description"
            name="description"
            error={errors.description}
            touched={touched.description}
          >
            <textarea
              value={values.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Detailed description of the activity..."
              rows={3}
              className="resize-none"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Related To" name="entity">
              <select
                value={values.entity}
                onChange={e => {
                  handleChange('entity', e.target.value);
                  handleChange('entityId', '');
                  setSelectedEntityName('');
                }}
                className="appearance-none"
              >
                {entities.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label={`Select ${values.entity.charAt(0).toUpperCase() + values.entity.slice(1)}`}
              name="entityId"
              error={errors.entityId}
              touched={touched.entityId}
              icon={Search}
              required
            >
              <div className="relative">
                <div
                  className={`w-full px-4 py-2 bg-gray-50 border rounded-xl cursor-pointer transition-all ${touched.entityId && errors.entityId ? 'border-red-500' : 'border-gray-200'}`}
                  onClick={() => setShowSelector(!showSelector)}
                >
                  <span className={selectedEntityName ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedEntityName || 'Click to select...'}
                  </span>
                </div>
                
                {showSelector && (
                  <div className="absolute top-full left-0 right-0 mt-2 border border-gray-100 rounded-xl shadow-xl bg-white z-20 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full px-3 py-1.5 border border-gray-100 rounded-lg text-sm bg-gray-50 focus:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="py-1">
                      {getFilteredItems().length > 0 ? (
                        getFilteredItems().map((item: any) => (
                          <div
                            key={item.id}
                            onClick={() => handleSelectItem(item)}
                            className="p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                              {(item.name || item.title || '?').charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name || item.title}</p>
                              <p className="text-xs text-gray-500 truncate">{item.email || (item.amount ? `${item.amount}€` : item.type)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400 italic">No items found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FormField>
          </div>

          <FormField
            label="Additional Info"
            name="metadata"
            error={errors.metadata}
            touched={touched.metadata}
            icon={Target}
          >
            <input
              type="text"
              value={values.metadata}
              onChange={e => handleChange('metadata', e.target.value)}
              placeholder="e.g., Duration: 30min, Outcome: Positive"
            />
          </FormField>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
              {currentUser?.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs text-blue-800">
              Activity will be logged as <span className="font-semibold">{currentUser}</span>
            </p>
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
              className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? 'Logging...' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}