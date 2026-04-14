'use client';
import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react';

export default function RepresentativesTable({ representatives, onViewDetails, onEdit, onDelete }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const getStatusColor = (status: string) => {
    const colors: any = {
      'Active': 'bg-green-100 text-green-700',
      'Probation': 'bg-yellow-100 text-yellow-700',
      'Inactive': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getQuotaColor = (attainment: number) => {
    if (attainment >= 100) return 'text-green-600';
    if (attainment >= 80) return 'text-blue-600';
    if (attainment >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleSelectAll = () => {
    if (selected.length === representatives.length) {
      setSelected([]);
    } else {
      setSelected(representatives.map((r: any) => r.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-blue-700">{selected.length} representatives selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Mail size={14} className="inline mr-1" /> Email
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <TrendingUp size={14} className="inline mr-1" /> Update Quota
            </button>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 w-10">
              <input
                type="checkbox"
                checked={selected.length === representatives.length && representatives.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Representative</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deals</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quota</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
            <th className="px-6 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {representatives.map((rep: any) => (
            <tr key={rep.id} className="hover:bg-gray-50 transition group cursor-pointer" onClick={() => onViewDetails(rep)}>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.includes(rep.id)}
                  onChange={() => toggleSelect(rep.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {(rep.name || 'U')[0].toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{rep.name}</p>
                    <p className="text-xs text-gray-500">{rep.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {rep.role || 'REP'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor('Active')}`}>
                  Active
                </span>
              </td>
              <td className="px-6 py-4 font-medium">0</td>
              <td className="px-6 py-4 font-semibold">0.0M€</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${getQuotaColor(0)}`}>
                    0%
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-red-500`}
                      style={{ width: `0%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm">0%</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{rep.createdAt ? new Date(rep.createdAt).toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEdit(rep)}
                    className="p-1 hover:bg-blue-50 rounded text-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(rep)}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
                    title="Delete"
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