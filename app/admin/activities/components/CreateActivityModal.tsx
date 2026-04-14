'use client';
import { useState, useEffect } from 'react';
import { X, FileText, Mail, Phone, CheckCircle, Target, DollarSign, GitBranch, Search } from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';
import { useLeadStore, Lead } from '@/lib/leadStore'; // Assurez-vous d'avoir ce store
import { useAuthStore } from '@/lib/authStore';

export default function CreateActivityModal({ onClose }: any) {
  const { addActivity } = useActivityStore();
  const { leads, loadLeads } = useLeadStore(); // Store pour récupérer les leads
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    type: 'note_added',
    title: '',
    description: '',
    entity: 'lead',
    entityId: '',
    metadata: '',
    user: { name: 'Alex Morgan', avatar: 'AM' },
    timestamp: new Date().toISOString()
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showLeadSelector, setShowLeadSelector] = useState(false);
  const [selectedLeadName, setSelectedLeadName] = useState('');

  // Charger les leads au montage
  useEffect(() => {
    loadLeads();
  }, []);

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
    { value: 'pipeline', label: 'Pipeline' }
  ];

  // Normalize leads into typed array and filter
  const leadList: Lead[] = Array.isArray(leads)
    ? leads
    : Array.isArray((leads as unknown as { leads?: Lead[] })?.leads)
      ? (leads as unknown as { leads: Lead[] }).leads
      : [];

  // Filtrer les leads selon la recherche
  const filteredLeads = leadList.filter((lead: Lead) =>
    (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.companyId?.toString() || '').includes(searchTerm.toLowerCase()) ||
    (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLead = (lead: any) => {
    setFormData({
      ...formData,
      entityId: lead.id.toString(),
      title: formData.title || `Activity for ${lead.name}`,
    });
    setSelectedLeadName(lead.name);
    setShowLeadSelector(false);
    setSearchTerm('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let metadata = {};
    try {
      if (formData.metadata) metadata = JSON.parse(formData.metadata);
    } catch {
      metadata = { note: formData.metadata };
    }

    const newActivity = {
      ...formData,
      id: Date.now(),
      entityId: parseInt(formData.entityId) || 0,
      metadata,
      userId: user?.id || 1, // Fallback to 1 if no user is found for admin
      user: user ? { name: user.name, avatar: user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() } : formData.user
    };

    await addActivity(newActivity);
    onClose();
  };

  const selectedType = activityTypes.find(t => t.value === formData.type);
  const Icon = selectedType?.icon || FileText;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20"
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
              placeholder="e.g., New deal created"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20"
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20 resize-none"
            />
          </div>

          {/* Entity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related To</label>
            <select
              value={formData.entity}
              onChange={e => {
                setFormData({ ...formData, entity: e.target.value, entityId: '' });
                setSelectedLeadName('');
              }}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20"
            >
              {entities.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Lead Selector - uniquement si entity = lead */}
          {formData.entity === 'lead' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Lead</label>

              {/* Champ de recherche/affichage */}
              <div
                className="relative cursor-pointer"
                onClick={() => setShowLeadSelector(!showLeadSelector)}
              >
                <input
                  type="text"
                  value={selectedLeadName || (formData.entityId ? `Lead ID: ${formData.entityId}` : '')}
                  placeholder="Click to select a lead..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20 cursor-pointer"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>

              {/* Sélecteur de leads */}
              {showLeadSelector && (
                <div className="mt-2 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                  {/* Barre de recherche dans le sélecteur */}
                  <div className="p-2 border-b sticky top-0 bg-white">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search leads..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Liste des leads */}
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead: Lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleSelectLead(lead)}
                        className="p-3 hover:bg-blue-600 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-6000 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                            {lead.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{lead.name}</p>
                            <p className="text-xs text-gray-500">{lead.companyId ? `Company #${lead.companyId}` : ''} • {lead.email}</p>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">ID: {lead.id}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No leads found
                    </div>
                  )}
                </div>
              )}

              {/* Affichage de l'ID sélectionné */}
              {formData.entityId && (
                <p className="text-xs text-blue-600 mt-1">
                  Selected Lead ID: {formData.entityId}
                </p>
              )}
            </div>
          )}

          {/* Pour les autres entités, input simple */}
          {formData.entity !== 'lead' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entity ID</label>
              <input
                type="number"
                value={formData.entityId}
                onChange={e => setFormData({ ...formData, entityId: e.target.value })}
                placeholder={`Enter ${formData.entity} ID`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20"
                required
              />
            </div>
          )}

          {/* Metadata */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Data <span className="text-xs text-gray-400">(JSON, optional)</span>
            </label>
            <textarea
              value={formData.metadata}
              onChange={e => setFormData({ ...formData, metadata: e.target.value })}
              placeholder='{"value": 250000, "stage": "Negotiation"}'
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6000/20 font-mono text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-600">
              Log Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}