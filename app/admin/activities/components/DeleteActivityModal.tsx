'use client';
import { X, AlertTriangle } from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';
import { useState } from 'react';

export default function DeleteActivityModal({ activity, onClose }: any) {
  const { deleteActivity } = useActivityStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteActivity(activity.id);
      onClose();
    } catch (e) {
      console.error(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Activity</h2>
          <p className="text-center text-gray-500 mb-6">
            Are you sure you want to delete this activity? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
