'use client';
import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, MoreHorizontal, FileText, CheckSquare, Edit, Trash2 } from 'lucide-react';

import { Lead } from '@/lib/leadStore';

interface LeadTableProps {
  data: Lead[];
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  onLeadClick: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onEmail?: (selectedIds: number[]) => void;
}

export default function LeadTable({ data, selectedRows, setSelectedRows, onLeadClick, onEdit, onDelete, onEmail }: LeadTableProps) {
  const [sortField, setSortField] = useState<keyof Lead>('dealValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleAll = () => setSelectedRows(selectedRows.length === data.length ? [] : data.map(d => d.id));
  const toggleRow = (id: number) => setSelectedRows(selectedRows.includes(id) ? selectedRows.filter(r => r !== id) : [...selectedRows, id]);

  const statusColors: Record<string, string> = {
    'NEW': 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
    'CONTACTED': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
    'QUALIFIED': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    'LOST': 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
  };

  // Trier les données
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-blue-700">{selectedRows.length} leads selected</span>
          <div className="flex gap-2">
            <button onClick={() => onEmail && onEmail(selectedRows)} className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Mail size={14} className="inline mr-1" />Email
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Phone size={14} className="inline mr-1" />Call
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block">
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
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => setSortField('name')}>
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Auth
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => setSortField('dealValue')}>
                Value {sortField === 'dealValue' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => setSortField('probability')}>
                AI Score
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((lead) => (
              <tr
                key={lead.id}
                className={`hover:bg-gray-50/50 transition cursor-pointer group ${selectedRows.includes(lead.id) ? 'bg-blue-50/50' : ''
                  }`}
                onClick={() => onLeadClick(lead)}
              >
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(lead.id)}
                    onChange={() => toggleRow(lead.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      {lead.company && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={10} /> {lead.company.name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">{lead.email}</span>
                    <span className="text-xs text-gray-500">{lead.phone}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-semibold text-gray-900">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-4">
                  {(lead as any).leadScore ? (
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-indigo-600">{(lead as any).leadScore.score}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${(lead as any).leadScore.temperature === 'Hot' ? 'bg-red-100 text-red-700' : (lead as any).leadScore.temperature === 'Warm' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {(lead as any).leadScore.temperature}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </td>
                <td className="p-4">
                  <span className="text-sm font-semibold">{lead.probability || 0}%</span>
                </td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEdit(lead)}
                      className="p-1 hover:bg-blue-50 rounded text-blue-600"
                      title="Edit lead"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                      title="Delete lead"
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedData.map((lead) => (
          <div
            key={lead.id}
            className={`bg-white rounded-xl border p-4 shadow-sm active:scale-[0.98] transition ${selectedRows.includes(lead.id) ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
              }`}
            onClick={() => onLeadClick(lead)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div onClick={(e) => { e.stopPropagation(); toggleRow(lead.id); }} className="relative z-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(lead.id)}
                    readOnly
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-colors pointer-events-none"
                  />
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{lead.name}</h4>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[lead.status]}`}>
                    {lead.status}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {lead.dealValue ? lead.dealValue.toLocaleString() : 0}€
                </p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Value</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 border-t pt-3 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-gray-400" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-gray-400" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Probabilité:</span>
                <span className="text-sm font-bold">{(lead.probability || 0)}%</span>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEdit(lead)}
                  className="p-2 bg-blue-50 rounded-lg text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(lead)}
                  className="p-2 bg-red-50 rounded-lg text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found</p>
        </div>
      )}
    </div>
  );
}