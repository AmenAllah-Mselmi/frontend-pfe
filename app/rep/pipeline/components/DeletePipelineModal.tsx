'use client';
import { X, AlertTriangle } from 'lucide-react';

export default function DeletePipelineModal({ pipeline, onClose, onConfirm }: any) {
  const handleConfirm = () => {
    onConfirm(pipeline.id);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-md mx-4">
        <div className="p-6 border-b flex justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold">Delete Pipeline</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this pipeline?
          </p>
          <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-lg mb-4">
            {pipeline.name} • {pipeline.dealsCount} deals
          </p>
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg">
            All deals in this pipeline will also be deleted. This action cannot be undone.
          </p>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Delete Pipeline
          </button>
        </div>
      </div>
    </div>
  );
}