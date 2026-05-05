'use client';
import { Mail, Phone, Building2, User, Briefcase, Calendar, Edit, Trash2 } from 'lucide-react';

export default function ContactsGrid({ contacts, onContactClick, onEdit, onDelete }: any) {
  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700',
    'Inactive': 'bg-gray-100 text-gray-700',
    'Lead': 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {contacts.map((contact: any) => (
        <div key={contact.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition cursor-pointer group relative" onClick={() => onContactClick(contact)}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {contact.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-xs text-gray-500">{contact.position}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[contact.status]}`}>{contact.status}</span>
          </div>
          
          <div className="space-y-2 mb-3 text-sm">
            <p className="text-gray-600 flex items-center gap-1"><Building2 size={14} className="text-gray-400" />{contact.company?.name || 'N/A'}</p>
            <p className="text-gray-600 flex items-center gap-1"><Mail size={14} className="text-gray-400" />{contact.email}</p>
            <p className="text-gray-600 flex items-center gap-1"><Phone size={14} className="text-gray-400" />{contact.phone}</p>
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t text-xs">
            <span className="text-gray-500 flex items-center gap-1"><Calendar size={12} />{contact.lastContact}</span>
            <span className="text-gray-500 flex items-center gap-1"><User size={12} />{contact.owner}</span>
          </div>

          {/* Boutons d'action */}
          <div className="absolute top-2 right-2 hidden group-hover:flex gap-1 bg-white rounded-lg shadow-lg border p-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(contact); }}
              className="p-1 hover:bg-blue-50 rounded text-blue-600"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(contact); }}
              className="p-1 hover:bg-red-50 rounded text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}