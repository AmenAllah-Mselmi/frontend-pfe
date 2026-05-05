'use client';
import { X, AlertTriangle, User } from 'lucide-react';

export default function DeleteContactModal({ contact, onClose, onConfirm, currentUser }: any) {
  const handleConfirm = () => {
    onConfirm(contact.id);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Vérifier si l'utilisateur peut supprimer
  if (contact.owner !== currentUser) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-md mx-4">
        <div className="p-6 border-b flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Delete Contact</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
              <User size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{contact.name}</p>
              <p className="text-xs text-gray-500">{contact.company?.name || 'N/A'} • {contact.position}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this contact?
          </p>
          
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
            This action cannot be undone.
          </p>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Delete Contact
          </button>
        </div>
      </div>
    </div>
  );
}