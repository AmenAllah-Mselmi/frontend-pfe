'use client';
import { useState } from 'react';
import { X, User, Building2, Mail, Phone, Briefcase } from 'lucide-react';

export default function EditContactModal({ contact, onClose, onSave, companies }: any) {
  const [formData, setFormData] = useState({
    name: contact.name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    companyId: contact.companyId || '',
    position: contact.position || '',
    status: contact.status || 'ACTIVE',
    source: contact.source || 'Website',
    notes: contact.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(contact.id, {
      ...formData,
      companyId: formData.companyId ? Number(formData.companyId) : undefined
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Edit Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name *"
              required
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
                className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none bg-transparent"
              >
                <option value="">Select Company (Optional)</option>
                {companies?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Briefcase size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Position"
                className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option>Website</option>
              <option>Referral</option>
              <option>Event</option>
              <option>LinkedIn</option>
            </select>
          </div>

          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes"
            rows={3}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}