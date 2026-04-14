'use client';
import { useState } from 'react';
import { 
  X, Mail, Phone, Building2, User, Briefcase, Calendar, 
  Edit, Trash2, Check, X as XIcon, History, MapPin, Globe
} from 'lucide-react';
import EmailModalRepresentative from './EmailModalRepresentative';
import EmailHistoryModalRepresentative from './EmailHistoryModalRepresentative';

export default function ContactDetailsModal({ contact, onClose, onUpdate, onDelete, currentUser }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(contact.notes || '');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-gray-100 text-gray-700',
    'Lead': 'bg-emerald-100 text-emerald-700'
  };

  const canEdit = contact.owner === currentUser;

  const handleSaveNotes = () => {
    onUpdate(contact.id, { notes: editedNotes });
    setIsEditing(false);
  };

  const handleSendEmail = (emailData: any) => {
    console.log('Sending email:', emailData);
    alert(`Email sent to ${contact.name}`);
    setShowEmailModal(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
        <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                canEdit ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
              }`}>
                {contact.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{contact.name}</h2>
                <p className="text-sm text-gray-500">{contact.position} • {contact.company}</p>
                {!canEdit && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Team contact • Read only
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status & Source */}
            <div className="flex gap-4">
              <span className={`px-3 py-1 text-sm rounded-full ${statusColors[contact.status]}`}>
                {contact.status}
              </span>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                Source: {contact.source}
              </span>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{contact.position}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Additional Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-gray-400" />
                    <span>Owner: {contact.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Last Contact: {contact.lastContact}</span>
                  </div>
                  {contact.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span>{contact.address}</span>
                    </div>
                  )}
                  {contact.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe size={16} className="text-gray-400" />
                      <span>{contact.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">Notes</h3>
                {canEdit && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Edit size={14} /> Edit
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <textarea 
                    value={editedNotes} 
                    onChange={(e) => setEditedNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Add notes..."
                  />
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                    >
                      <XIcon size={14} /> Cancel
                    </button>
                    <button 
                      onClick={handleSaveNotes} 
                      className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {contact.notes || 'No notes'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-4 flex gap-3">
              <button 
                onClick={() => setShowEmailModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                <Mail size={16} /> Send Email
              </button>
              <button 
                onClick={() => setShowHistoryModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
              >
                <History size={16} /> History
              </button>
              {canEdit && (
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this contact?')) {
                      onDelete(contact.id);
                      onClose();
                    }
                  }} 
                  className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModalRepresentative
          onClose={() => setShowEmailModal(false)}
          onSend={handleSendEmail}
          contact={contact}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <EmailHistoryModalRepresentative
          onClose={() => setShowHistoryModal(false)}
          contact={contact}
          currentUser={currentUser}
        />
      )}
    </>
  );
}