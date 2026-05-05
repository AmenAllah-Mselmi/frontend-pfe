'use client';
import { useState } from 'react';
import { Building2, User, Calendar, Clock, Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface Deal {
  id: number;
  name: string;
  company: string;
  value: number;
  probability: number;
  stage: string;
  status: string;
  contact: { name: string };
  owner: { name: string; initial: string };
  lastContact: string;
}

export default function PipelineList({ deals = [], onEdit, onDelete }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const getStageColor = (stage: string) => ({
    'Discovery': 'bg-blue-100 text-blue-700',
    'Qualified': 'bg-indigo-100 text-indigo-700',
    'Proposal': 'bg-purple-100 text-blue-600',
    'Negotiation': 'bg-orange-100 text-orange-700',
    'Closed Won': 'bg-green-100 text-green-700',
    'Closed Lost': 'bg-red-100 text-red-700'
  })[stage] || 'bg-gray-100 text-gray-700';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>{['Deal', 'Company', 'Value', 'Stage', 'Probability', 'Owner', 'Last Contact', ''].map(h => (
            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y">
          {deals.map((deal: Deal) => (
            <tr key={deal.id ?? `deal-${Math.random()}`} className="hover:bg-gray-50 group">
              <td className="px-6 py-4">
                <p className="font-medium">{deal.name ?? 'Untitled'}</p>
                <p className="text-xs text-gray-500">{deal.contact?.name ?? '-'}</p>
              </td>
              <td className="px-6 py-4 text-sm">{deal.company || 'N/A'}</td>
              <td className="px-6 py-4 font-semibold">{(deal.value != null && !isNaN(Number(deal.value)) ? Number(deal.value).toLocaleString() : '0')}€</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(deal.stage)}`}>
                  {deal.stage}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${deal.probability}%` }} />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    {deal.owner?.initial ?? (deal.owner?.name ? String(deal.owner.name).split(' ').map((n: string) => n[0]).join('').slice(0, 2) : '?')}
                  </div>
                  <span className="text-sm">{deal.owner?.name ?? 'Unassigned'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm flex items-center gap-1">
                <Clock size={12} />{deal.lastContact}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEdit(deal)}
                    className="p-1 hover:bg-emerald-50 rounded text-emerald-600"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(deal)}
                    className="p-1 hover:bg-red-50 rounded text-red-600"
                  >
                    <Trash2 size={14} />
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