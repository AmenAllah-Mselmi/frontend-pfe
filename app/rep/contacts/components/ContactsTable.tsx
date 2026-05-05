'use client';
import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, MoreHorizontal, User, Briefcase, Edit, Trash2 } from 'lucide-react';

export default function ContactsTable({ contacts = [], onContactClick, onEdit, onDelete, currentUser, onEmail }: any) {
  const [selected, setSelected] = useState<number[]>([]);

  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-gray-100 text-gray-700',
    'Lead': 'bg-emerald-100 text-emerald-700'
  };

  const toggleAll = () => selected.length === contacts.length ? setSelected([]) : setSelected(contacts.map((c: any) => c.id));
  const toggleOne = (id: number) => setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);

  return (
    <div className="overflow-x-auto">
      {selected.length > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex justify-between items-center">
          <span className="text-sm text-emerald-700">{selected.length} contacts selected</span>
          <div className="flex gap-2">
            <button onClick={() => onEmail && onEmail(selected)} className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Mail size={14} className="inline mr-1" />Email
            </button>
            <button className="px-3 py-1 text-sm bg-white text-gray-700 rounded-lg hover:bg-gray-50">
              <Phone size={14} className="inline mr-1" />Call
            </button>
          </div>
        </div>
      )}
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 w-10"><input type="checkbox" checked={selected.length === contacts.length && contacts.length > 0} onChange={toggleAll} className="rounded" /></th>
            {['Name', 'Company', 'Position', 'Contact', 'Status', 'Source', 'Last Contact', 'Owner', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {contacts.map((contact: any, idx: number) => {
            const displayName = contact?.name ?? contact?.email ?? 'Untitled';
            const initials = displayName.split(' ').map((n: string) => n[0]).join('') || (displayName[0] ?? '?');
            return (
            <tr key={contact.id ?? `contact-${idx}`} className="hover:bg-gray-50 group cursor-pointer" onClick={() => onContactClick(contact)}>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={selected.includes(contact.id)} onChange={() => toggleOne(contact.id)} className="rounded" />
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    contact.owner === currentUser ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                  }`}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-gray-500">{contact?.email ?? '-'}</p>
                    {contact.owner !== currentUser && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">Team</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4"><div className="flex items-center gap-1"><Building2 size={14} className="text-gray-400" />{contact.company?.name || 'N/A'}</div></td>
              <td className="px-6 py-4"><div className="flex items-center gap-1"><Briefcase size={14} className="text-gray-400" />{contact.position}</div></td>
              <td className="px-6 py-4"><div className="flex gap-2"><Mail size={14} className="text-gray-400" /><Phone size={14} className="text-gray-400" /></div></td>
              <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${statusColors[contact.status]}`}>{contact.status}</span></td>
              <td className="px-6 py-4 text-sm">{contact.source}</td>
              <td className="px-6 py-4 text-sm flex items-center gap-1"><Calendar size={12} />{contact.lastContact}</td>
              <td className="px-6 py-4"><div className="flex items-center gap-1"><User size={14} className="text-gray-400" />{contact.owner}</div></td>
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                {contact.owner === currentUser && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => onEdit(contact)}
                      className="p-1 hover:bg-emerald-50 rounded text-emerald-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(contact)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>
    </div>
  );
}