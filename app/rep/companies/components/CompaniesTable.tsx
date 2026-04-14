'use client';
import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, MoreHorizontal, Edit, Trash2, Users } from 'lucide-react';

export default function CompaniesTable({ companies = [], onEdit, onDelete }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700',
    'Prospect': 'bg-emerald-100 text-emerald-700',
    'Inactive': 'bg-gray-100 text-gray-700'
  };

  const industryColors: Record<string, string> = {
    'TECHNOLOGY': 'bg-blue-100 text-blue-700',
    'HEALTHCARE': 'bg-blue-100 text-blue-700',
    'FINANCE': 'bg-emerald-100 text-emerald-700',
    'EDUCATION': 'bg-amber-100 text-amber-700',
    'OTHER': 'bg-pink-100 text-pink-700'
  };

  const toggleAll = () => selected.length === companies.length ? setSelected([]) : setSelected(companies.map((c: any) => c.id));
  const toggleOne = (id: number) => setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-emerald-700">{selected.length} companies selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Mail size={14} className="inline mr-1" />Email
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Users size={14} className="inline mr-1" />Assign
            </button>
          </div>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 w-10"><input type="checkbox" checked={selected.length === companies.length && companies.length > 0} onChange={toggleAll} className="rounded" /></th>
            {['Company', 'Industry', 'Size', 'Location', 'Phone', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {companies.map((c: any, idx: number) => (
            <tr key={c.id ?? `company-${idx}`} className="hover:bg-gray-50 group">
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} className="rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">
                    {c.name?.charAt(0) ?? (c.email ? c.email.charAt(0) : '?')}
                  </div>
                  <div>
                    <p className="font-medium">{c.name ?? c.email ?? 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{c.email ?? '-'}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${industryColors[c.companyIndustry || ''] || 'bg-gray-100 text-gray-700'}`}>
                  {c.companyIndustry}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{c.companySize}</td>
              <td className="px-6 py-4 text-sm">{c.location}</td>
              <td className="px-6 py-4 text-sm">{c.phone}</td>
              <td className="px-6 py-4">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEdit(c)}
                    className="p-1 hover:bg-emerald-50 rounded text-emerald-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
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