'use client';
import { useState } from 'react';
import { X, User, Mail, Phone, Briefcase, Users, Globe, Target, Tag } from 'lucide-react';
import { useUserStore } from '@/lib/userStore';

interface EditRepresentativeModalProps {
  representative: any;
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

export default function EditRepresentativeModal({ representative, onClose, onSave }: EditRepresentativeModalProps) {
  const users = useUserStore((state) => state.users);
  const managers = users.filter((u: any) => u.role === 'ADMIN');

  const [formData, setFormData] = useState({
    name: representative.name || '',
    email: representative.email || '',
    role: representative.role || 'REP',
    managerId: representative.managerId || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (dataToSubmit.managerId) {
      (dataToSubmit as any).managerId = parseInt(dataToSubmit.managerId as string);
    } else {
      (dataToSubmit as any).managerId = null;
    }
    onSave(representative.id, dataToSubmit);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Representative</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-3 text-gray-400" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-9 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
              >
                <option value="REP">Representative</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            {formData.role === 'REP' && (
              <div className="relative">
                <Users size={16} className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={formData.managerId}
                  onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                  className="w-full pl-9 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                >
                  <option value="">Assign Manager (Optional)</option>
                  {managers.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}