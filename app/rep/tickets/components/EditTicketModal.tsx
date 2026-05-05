'use client';

import { X, Tag, AlertCircle } from 'lucide-react';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';

interface EditTicketModalProps {
  ticket: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
  currentUser: string;
  leads?: any[];
  contacts?: any[];
}

export default function EditTicketModal({ ticket, onClose, onSave, currentUser, leads, contacts }: EditTicketModalProps) {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      title: ticket.title || '',
      description: ticket.description || '',
      leadId: ticket.leadId || '',
      contactId: ticket.contactId || '',
      priority: ticket.priority || 'MEDIUM'
    },
    validationSchema: {
      title: [validators.required, validators.minLength(5)],
      leadId: [validators.required],
      contactId: [validators.required]
    },
    onSubmit: (data) => {
      onSave(ticket.id, {
        ...data,
        leadId: Number(data.leadId),
        contactId: Number(data.contactId),
        userId: ticket.userId
      });
    }
  });

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Vérifier si l'utilisateur peut éditer
  if (ticket.createdBy !== currentUser) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
        <div className="bg-white rounded-2xl w-full max-w-md mx-auto p-8 shadow-2xl overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Permission Denied</h3>
            <p className="text-gray-600 mb-6">You can only edit tickets that you created or are assigned to you.</p>
            <button 
              onClick={onClose} 
              className="w-full px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-800">Edit Ticket #{ticket.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <FormField
            label="Ticket Title"
            name="title"
            error={errors.title}
            touched={touched.title}
            icon={AlertCircle}
            required
          >
            <input
              placeholder="e.g. Server issues in production"
              value={values.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
            />
          </FormField>

          <FormField
            label="Description"
            name="description"
            error={errors.description}
            touched={touched.description}
          >
            <textarea
              placeholder="Provide more details about the issue..."
              rows={4}
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              className="resize-none"
            />
          </FormField>

          <FormField
            label="Priority"
            name="priority"
            icon={Tag}
          >
            <select
              value={values.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="appearance-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Associated Lead"
              name="leadId"
              error={errors.leadId}
              touched={touched.leadId}
              required
            >
              <select
                value={values.leadId}
                onChange={(e) => handleChange('leadId', e.target.value)}
                onBlur={() => handleBlur('leadId')}
              >
                <option value="">Select a lead...</option>
                {leads?.map((lead: any) => (
                  <option key={lead.id} value={lead.id}>{lead.name}</option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Associated Contact"
              name="contactId"
              error={errors.contactId}
              touched={touched.contactId}
              required
            >
              <select
                value={values.contactId}
                onChange={(e) => handleChange('contactId', e.target.value)}
                onBlur={() => handleBlur('contactId')}
              >
                <option value="">Select a contact...</option>
                {contacts?.map((contact: any) => (
                  <option key={contact.id} value={contact.id}>{contact.name}</option>
                ))}
              </select>
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