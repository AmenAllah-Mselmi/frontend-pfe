'use client';
import { X, AlertTriangle, Ticket } from 'lucide-react';

interface DeleteTicketModalProps {
  ticket: any;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

export default function DeleteTicketModal({ ticket, onClose, onConfirm }: DeleteTicketModalProps) {
  const handleConfirm = () => {
    onConfirm(ticket.id);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Delete Ticket</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <Ticket size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-900">#{ticket.id} - {ticket.title}</p>
              <p className="text-xs text-gray-500">{ticket.status} • {ticket.priority}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this ticket?
          </p>
          
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
            This will permanently remove the ticket and all associated comments. This action cannot be undone.
          </p>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
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
            Delete Ticket
          </button>
        </div>
      </div>
    </div>
  );
}