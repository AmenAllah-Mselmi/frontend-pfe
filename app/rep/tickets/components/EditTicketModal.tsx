'use client';
import { useState } from 'react';
import { X, Tag, AlertCircle } from 'lucide-react';

interface EditTicketModalProps {
  ticket: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
  currentUser: string;
  leads?: any[];
  contacts?: any[];
}

export default function EditTicketModal({ ticket, onClose, onSave, currentUser, leads, contacts }: EditTicketModalProps) {
  const [formData, setFormData] = useState({
    title: ticket.title || '',
    description: ticket.description || '',
    leadId: ticket.leadId || '',
    contactId: ticket.contactId || '',
    priority: ticket.priority || 'MEDIUM'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(ticket.id, {
      title: formData.title,
      description: formData.description,
      leadId: Number(formData.leadId),
      contactId: Number(formData.contactId),
      userId: ticket.userId,
      priority: formData.priority
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Vérifier si l'utilisateur peut éditer
  if (ticket.createdBy !== currentUser) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
        <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Permission Denied</h3>
            <p className="text-sm text-gray-600 mb-4">You can only edit tickets that you created.</p>
            <button onClick={onClose} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Ticket #{ticket.id}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Deal/Contact associations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Associated Lead</label>
              <select
                value={formData.leadId}
                onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              >
                <option value="" disabled>Select a lead...</option>
                {leads?.map((lead: any) => (
                  <option key={lead.id} value={lead.id}>{lead.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Associated Contact</label>
              <select
                value={formData.contactId}
                onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              >
                <option value="" disabled>Select a contact...</option>
                {contacts?.map((contact: any) => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}