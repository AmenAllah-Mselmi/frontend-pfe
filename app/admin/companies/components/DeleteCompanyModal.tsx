'use client';
import { X, AlertTriangle, Building2 } from 'lucide-react';

interface DeleteCompanyModalProps {
  company: any;
  onClose: () => void;
  onConfirm: (companyId: number) => void;
}

export default function DeleteCompanyModal({ company, onClose, onConfirm }: DeleteCompanyModalProps) {
  const handleConfirm = () => {
    onConfirm(company.id);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Company</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <Building2 size={18} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{company.name}</p>
              <p className="text-xs text-gray-500">
                {company.companyIndustry} • {company.companySize} • {company.location}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this company?
          </p>

          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
            This will also delete all associated leads and deals. This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
            type="button"
          >
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
}