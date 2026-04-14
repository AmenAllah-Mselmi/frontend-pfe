'use client';
import { X, Building2, Users, Mail, Phone, Calendar, Globe, MapPin, Edit, Trash2 } from 'lucide-react';
import { Company } from '@/lib/companyStore';

interface CompanyDetailsModalProps {
  company: Company;
  onClose: () => void;
  onEdit: (company: any) => void;
  onDelete: (company: any) => void;
}

export default function CompanyDetailsModal({ company, onClose, onEdit, onDelete }: CompanyDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {company.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                <p className="text-sm text-gray-500">{company.companyIndustry} • {company.companySize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(company)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                title="Edit company"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(company)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete company"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-600">{company.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-600">{company.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-600">{company.phone}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onEdit(company)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Edit Company
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              Add Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}