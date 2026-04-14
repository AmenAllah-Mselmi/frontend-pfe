'use client';
import { useState } from 'react';
import { X, Building2, Users, Mail, Phone, Globe, DollarSign } from 'lucide-react';

interface EditCompanyModalProps {
  company: any;
  onClose: () => void;
  onSave: (companyId: number, data: any) => void;
}

export default function EditCompanyModal({ company, onClose, onSave }: EditCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: company.name || '',
    companyIndustry: company.companyIndustry || 'TECHNOLOGY',
    companySize: company.companySize || 'SMALL',
    location: company.location || '',
    email: company.email || '',
    phone: company.phone || '',
    revenue: company.revenue || 0,
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
        {/* Header */}
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Company</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Company Name *"
              required
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Industry & Size */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.companyIndustry}
              onChange={(e) => setFormData({ ...formData, companyIndustry: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="TECHNOLOGY">Technology</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="FINANCE">Finance</option>
              <option value="EDUCATION">Education</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="SMALL">Small (1-50)</option>
              <option value="MEDIUM">Medium (51-200)</option>
              <option value="LARGE">Large (200+)</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Location"
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Email & Phone */}
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

          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
              placeholder="Annual Revenue"
              className="w-full pl-9 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Actions */}
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
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}