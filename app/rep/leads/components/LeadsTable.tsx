import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, FileText, CheckSquare } from 'lucide-react';

export default function LeadsTable({ leads, onLeadClick, onEmail }: any) {
  const [selected, setSelected] = useState<number[]>([]);
  const statusColors: any = {
    'NEW': 'bg-blue-100 text-blue-700',
    'CONTACTED': 'bg-yellow-100 text-yellow-700',
    'QUALIFIED': 'bg-emerald-100 text-emerald-700',
    'NEGOCIATION': 'bg-orange-100 text-orange-700',
    'PROPOSITION': 'bg-purple-100 text-purple-700',
    'LOST': 'bg-red-100 text-red-700'
  };

  const toggleAll = () => selected.length === leads.length ? setSelected([]) : setSelected(leads.map((l: any) => l.id));
  const toggleOne = (id: number) => setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-emerald-700">{selected.length} leads selected</span>
          <div className="flex gap-2">
            <button onClick={() => onEmail && onEmail(selected)} className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50"><Mail size={14} className="inline mr-1" />Email</button>
          </div>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 w-10"><input type="checkbox" checked={selected.length === leads.length && leads.length > 0} onChange={toggleAll} className="rounded" /></th>
            {['Name', 'Email', 'Phone', 'Status', 'AI Score', 'Probability', 'Value', 'Actions', ''].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead: any) => (
            <tr key={lead.id} className="hover:bg-gray-50 group cursor-pointer" onClick={() => onLeadClick(lead)}>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleOne(lead.id)} className="rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm">
                    {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    {lead.company && (
                      <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Building2 size={10} /> {lead.company.name}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4"><span className="text-xs text-gray-500">{lead.email}</span></td>
              <td className="px-6 py-4"><span className="text-xs text-gray-500">{lead.phone}</span></td>
              <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${statusColors[lead.status]}`}>{lead.status}</span></td>
              <td className="px-6 py-4">
                {lead.leadScore ? (
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-indigo-600">{lead.leadScore.score}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${lead.leadScore.temperature === 'Hot' ? 'bg-red-100 text-red-700' : lead.leadScore.temperature === 'Warm' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {lead.leadScore.temperature}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">{lead.probability || 0}%</td>
              <td className="px-6 py-4 font-semibold">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</td>
              <td className="px-6 py-4">
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded">•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}