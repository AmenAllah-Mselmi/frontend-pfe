'use client';
import { useState, useEffect } from 'react';
import { X, FileText, Mail, Phone, CheckCircle, Target, DollarSign } from 'lucide-react';
import { useLeadStore } from '@/lib/leadStore';
import { useContactStore } from '@/lib/contactStore';
import { usePipelineStore } from '@/lib/pipelineStore';
import { useTaskStore } from '@/lib/taskStore';

interface CreateActivityModalProps {
  onClose: () => void;
  onCreate: (data: any) => void;
  currentUser: string;
}

export default function CreateActivityModal({ onClose, onCreate, currentUser }: CreateActivityModalProps) {
  const { leads, loadLeads } = useLeadStore();
  const { contacts, loadContacts } = useContactStore();
  const { pipelines, loadPipelines } = usePipelineStore();
  const { tasks, loadTasks } = useTaskStore();

  const [formData, setFormData] = useState({
    type: 'note_added',
    title: '',
    description: '',
    entity: 'lead',
    entityId: '',
    metadata: ''
  });

  useEffect(() => {
    loadLeads();
    loadContacts();
    loadPipelines();
    loadTasks();
  }, []);

  // Reset entityId when entity type changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, entityId: '' }));
  }, [formData.entity]);

  const activityTypes = [
    { value: 'note_added', label: 'Note Added', icon: FileText },
    { value: 'email_sent', label: 'Email Sent', icon: Mail },
    { value: 'call_logged', label: 'Call Logged', icon: Phone },
    { value: 'task_completed', label: 'Task Completed', icon: CheckCircle },
    { value: 'lead_status_change', label: 'Lead Status Change', icon: Target },
    { value: 'deal_created', label: 'Deal Created', icon: DollarSign },
    { value: 'deal_won', label: 'Deal Won', icon: CheckCircle },
  ];

  const entityOptions: Record<string, { id: number; label: string }[]> = {
    lead: leads.map(l => ({ id: l.id, label: l.name })),
    contact: contacts.map(c => ({ id: c.id, label: c.name })),
    pipeline: pipelines.map(p => ({ id: p.id, label: p.name })),
    task: tasks.map(t => ({ id: t.id, label: t.title })),
  };

  const entities = ['lead', 'contact', 'pipeline', 'task'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let metadata = {};
    try {
      if (formData.metadata) metadata = { note: formData.metadata };
    } catch {
      metadata = { note: formData.metadata };
    }
    onCreate({ ...formData, entityId: parseInt(formData.entityId) || 0, metadata });
  };

  const selectedType = activityTypes.find(t => t.value === formData.type);
  const Icon = selectedType?.icon || FileText;
  const currentOptions = entityOptions[formData.entity] || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Log Activity</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {activityTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Call with client"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the activity"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Related To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related To</label>
            <select
              value={formData.entity}
              onChange={e => setFormData({ ...formData, entity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-2"
            >
              {entities.map(e => (
                <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
              ))}
            </select>

            {/* Dynamic entity picker — name shown, ID as value */}
            <select
              value={formData.entityId}
              onChange={e => setFormData({ ...formData, entityId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            >
              <option value="">Select a {formData.entity}...</option>
              {currentOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            {currentOptions.length === 0 && (
              <p className="text-xs text-gray-400 mt-1">No {formData.entity}s found.</p>
            )}
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Info <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.metadata}
              onChange={e => setFormData({ ...formData, metadata: e.target.value })}
              placeholder="e.g., Duration: 30min, Outcome: Positive"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Logged as */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">Activity will be logged as <span className="font-semibold">{currentUser}</span></p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Log Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}