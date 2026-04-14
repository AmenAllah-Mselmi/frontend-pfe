'use client';
import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';
import { Company } from '@/lib/companyStore';



interface CompaniesTableProps {
  data: Company[];
  onCompanyClick: (id: number) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export default function CompaniesTable({ data, onCompanyClick, onEdit, onDelete }: CompaniesTableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700 ring-1 ring-green-600/20',
    'Inactive': 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20',
    'Prospect': 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20'
  };

  const industryColors: Record<string, string> = {
    'TECHNOLOGY': 'bg-blue-100 text-blue-700',
    'HEALTHCARE': 'bg-blue-100 text-blue-700',
    'FINANCE': 'bg-emerald-100 text-emerald-700',
    'EDUCATION': 'bg-amber-100 text-amber-700',
    'OTHER': 'bg-pink-100 text-pink-700'
  };

  const toggleRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map(d => d.id));
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-700">{selectedRows.length} companies selected</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Mail size={14} className="inline mr-1" /> Email
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Users size={14} className="inline mr-1" /> Assign
            </button>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            <th className="p-4 w-10">
              <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={toggleAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((company) => (
            <tr
              key={company.id}
              className="hover:bg-gray-50/50 transition cursor-pointer group"
              onClick={() => onCompanyClick(company.id)}
            >
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(company.id)}
                  onChange={() => toggleRow(company.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {company.name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${industryColors[company.companyIndustry || ''] || 'bg-gray-100 text-gray-700'}`}>
                  {company.companyIndustry}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-600">{company.companySize}</td>
              <td className="p-4 text-sm text-gray-600">{company.location}</td>
              <td className="p-4 text-sm text-gray-600">{company.phone}</td>
              <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEdit(company)}
                    className="p-1 hover:bg-blue-50 rounded text-blue-600"
                    title="Edit company"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(company)}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
                    title="Delete company"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}