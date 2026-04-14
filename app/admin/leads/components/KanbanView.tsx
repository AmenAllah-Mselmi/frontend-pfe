'use client';
import { FileText, CheckSquare, Calendar, Edit, Trash2 } from 'lucide-react';

import { Lead } from '@/lib/leadStore';

interface KanbanViewProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange?: (leadId: number, newStatus: string) => void;
}

export default function KanbanView({ leads, onLeadClick, onEdit, onDelete, onStatusChange }: KanbanViewProps) {
  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];

  const statusColors: Record<string, { bg: string; dot: string; text: string }> = {
    'NEW': { bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700' },
    'CONTACTED': { bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-700' },
    'QUALIFIED': { bg: 'bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    'LOST': { bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700' }
  };

  const getLeadsByStatus = (status: string) => leads.filter(lead => lead.status === status);

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData('leadId', leadId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const leadId = parseInt(e.dataTransfer.getData('leadId'));
    if (!isNaN(leadId) && onStatusChange) {
      onStatusChange(leadId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {statuses.map(status => {
        const statusLeads = getLeadsByStatus(status);
        const colors = statusColors[status];

        return (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                <h3 className="font-medium text-gray-700">{status}</h3>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{statusLeads.length}</span>
              </div>
            </div>

            <div
              className={`${colors.bg} rounded-lg p-2 min-h-[400px] space-y-2`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {statusLeads.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="bg-white rounded-lg p-3 border shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group relative"
                  onClick={() => onLeadClick(lead)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{lead.name || 'Unnamed Lead'}</h4>
                    <span className="text-sm font-semibold text-gray-900">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 truncate">{lead.email || 'No email'}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${(lead.probability || 0) >= 70 ? 'bg-green-100 text-green-700' :
                      (lead.probability || 0) >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                      }`}>{lead.probability || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-gray-500"><FileText size={12} /> {lead.notes?.length || 0}</span>
                      <span className="flex items-center gap-1 text-gray-500"><CheckSquare size={12} /> {lead.tasks?.length || 0}</span>
                    </div>
                    <span className="text-gray-400 flex items-center gap-1"><Calendar size={10} />{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>

                  {/* Boutons d'action */}
                  <div className="absolute top-2 right-2 flex gap-1 bg-white/90 backdrop-blur rounded-lg shadow-sm border p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
                      className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(lead); }}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {statusLeads.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-400 text-sm">No leads</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}