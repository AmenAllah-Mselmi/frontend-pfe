'use client';
import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  ChevronDown
} from 'lucide-react';

export default function TicketsTable({ tickets, onViewDetails, onEdit, onDelete, onStatusChange }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const statusColors: any = {
    'NEW': 'bg-gray-100 text-gray-700',
    'OPEN': 'bg-blue-100 text-blue-700',
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'RESOLVED': 'bg-green-100 text-green-700',
    'CLOSED': 'bg-red-100 text-red-700'
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      'NEW': 'New',
      'OPEN': 'Open',
      'PENDING': 'Pending',
      'RESOLVED': 'Resolved',
      'CLOSED': 'Closed'
    };
    return labels[status] || status;
  };

  const toggleSelectAll = () => {
    if (selected.length === tickets.length) {
      setSelected([]);
    } else {
      setSelected(tickets.map((t: any) => t.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-blue-700">{selected.length} tickets selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <MessageSquare size={14} className="inline mr-1" /> Update Status
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <User size={14} className="inline mr-1" /> Assign
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
                checked={selected.length === tickets.length && tickets.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            <th className="px-6 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tickets.map((ticket: any) => (
            <tr key={ticket.id} className="hover:bg-gray-50 transition group cursor-pointer" onClick={() => onViewDetails(ticket)}>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.includes(ticket.id)}
                  onChange={() => toggleSelect(ticket.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 font-mono text-sm text-gray-500">#{ticket.id}</td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900 line-clamp-2">{ticket.title}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="relative">
                  <select
                    value={ticket.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      onStatusChange(ticket.id, e.target.value);
                    }}
                    className={`appearance-none px-3 py-1.5 text-xs rounded-full font-medium border-0 cursor-pointer ${statusColors[ticket.status]}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="NEW">New</option>
                    <option value="OPEN">Open</option>
                    <option value="PENDING">Pending</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{ticket.leadName}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{ticket.contactName}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{ticket.createdAt ? formatDate(ticket.createdAt) : '-'}</td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => onEdit(ticket)}
                    className="p-1 hover:bg-blue-50 rounded text-blue-600"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(ticket)}
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