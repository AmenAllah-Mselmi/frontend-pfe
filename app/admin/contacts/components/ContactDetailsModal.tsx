import { useState } from 'react';
import { X, Mail, Phone, Building2, User, Briefcase, Calendar, Edit, Trash2, History } from 'lucide-react';
import EmailModalManager from './EmailModalManager';
import EmailHistoryModalManager from './EmailHistoryModalManager';

export default function ContactDetailsModal({ contact, onClose, onEdit, onDelete, currentUser, onSendEmail, onShowEmailHistory }: any) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Use onSendEmail from props instead of local placeholder
  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-gray-100 text-gray-700',
    'Lead': 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {contact.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              <p className="text-sm text-gray-500">{contact.position} • {contact.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(contact)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit contact"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(contact)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete contact"
            >
              <Trash2 size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <span className={`px-3 py-1 text-sm rounded-full ${statusColors[contact.status]}`}>{contact.status}</span>
            <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">Source: {contact.source}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-gray-400" /><span>{contact.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-gray-400" /><span>{contact.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-gray-400" /><span>{contact.company}</span></div>
                <div className="flex items-center gap-2 text-sm"><Briefcase size={16} className="text-gray-400" /><span>{contact.position}</span></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Additional Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><User size={16} className="text-gray-400" /><span>Owner: {contact.owner}</span></div>
                <div className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-gray-400" /><span>Last Contact: {contact.lastContact}</span></div>
              </div>
            </div>
          </div>

          {contact.notes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
            </div>
          )}

          <div className="border-t pt-4 flex gap-3">
            <button 
              onClick={() => setShowEmailModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Mail size={16} /> Send Email
            </button>
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              <History size={16} /> History
            </button>
          </div>
        </div>
      </div>
      
      {/* Email Modal */}
      {showEmailModal && (
        <EmailModalManager
          onClose={() => setShowEmailModal(false)}
          onSend={async (data: any) => {
            if (onSendEmail) await onSendEmail(data);
            setShowEmailModal(false);
          }}
          contact={contact}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <EmailHistoryModalManager
          onClose={() => setShowHistoryModal(false)}
          contact={contact}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}