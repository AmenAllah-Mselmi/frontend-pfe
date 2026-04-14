'use client';
import { useState } from 'react';
import { X, Building2, Users, Mail, Phone, Globe, DollarSign } from 'lucide-react';

export default function EditCompanyModal({ company, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: company.name || '',
    companyIndustry: company.companyIndustry || 'TECHNOLOGY',
    companySize: company.companySize || 'SMALL',
    location: company.location || '',
    email: company.email || '',
    phone: company.phone || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(company.id, formData);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold">Edit Company</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Company Name *"
              required
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.companyIndustry}
              onChange={(e) => setFormData({ ...formData, companyIndustry: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="TECHNOLOGY">Technology</option><option value="HEALTHCARE">Healthcare</option><option value="FINANCE">Finance</option>
              <option value="EDUCATION">Education</option><option value="OTHER">Other</option>
            </select>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="SMALL">Small (1-50)</option><option value="MEDIUM">Medium (51-200)</option><option value="LARGE">Large (200+)</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}