'use client';
import { useState } from 'react';
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  WON: 'Won',
  LOST: 'Lost',
  CLOSED: 'Closed',
  ON_HOLD: 'On Hold',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-blue-100 text-blue-700',
  WON: 'bg-green-100 text-green-700',
  LOST: 'bg-red-100 text-red-700',
  CLOSED: 'bg-purple-100 text-blue-600',
  ON_HOLD: 'bg-orange-100 text-orange-700',
};

const probabilityColor = (prob: number) => {
  if (prob >= 70) return 'bg-green-100 text-green-700';
  if (prob >= 40) return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-600';
};

interface PipelineListProps {
  deals: any[];
  onEdit: (deal: any) => void;
  onDelete: (deal: any) => void;
}

export default function PipelineList({ deals, onEdit, onDelete }: PipelineListProps) {
  const [sortField, setSortField] = useState<string>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedDeals = [...deals].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button onClick={() => handleSort('name')} className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                  Deal Name <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button onClick={() => handleSort('amount')} className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                  Amount <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button onClick={() => handleSort('probability')} className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                  Probability <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">Close Date</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase">Lead ID</span>
              </th>
              <th className="px-6 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50 transition group">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">{(deal.amount || 0).toLocaleString()}€</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${probabilityColor(deal.probability || 0)}`}>
                      {deal.probability || 0}%
                    </span>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deal.probability || 0}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[deal.status] || 'bg-gray-100 text-gray-700'}`}>
                    {STATUS_LABELS[deal.status] || deal.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '–'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{deal.leadId || '–'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                    <button onClick={() => onEdit(deal)} className="p-1 hover:bg-blue-50 rounded text-blue-600"><Edit size={14} /></button>
                    <button onClick={() => onDelete(deal)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {sortedDeals.map((deal) => (
          <div key={deal.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm active:scale-[0.98] transition">
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{deal.name}</h4>
                <div className={`mt-1 inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${STATUS_COLORS[deal.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_LABELS[deal.status] || deal.status}
                </div>
              </div>
              <p className="text-lg font-bold text-blue-600">
                {(deal.amount || 0).toLocaleString()}€
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-3 mt-3">
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Probability</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${probabilityColor(deal.probability || 0)}`}>
                    {deal.probability || 0}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Close Date</p>
                <p className="text-xs text-gray-600 font-medium">
                  {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '–'}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <span className="text-xs text-gray-400">Lead ID: {deal.leadId || '–'}</span>
              <div className="flex gap-2">
                <button onClick={() => onEdit(deal)} className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(deal)} className="p-2 bg-red-50 rounded-lg text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}