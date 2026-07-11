'use client';
import { FileText, CheckSquare, Calendar } from 'lucide-react';

export default function LeadsKanban({ leads, onLeadClick, onStatusChange }: any) {
  const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'NEGOCIATION', 'PROPOSITION', 'LOST'];
  const colors: any = { 'NEW': 'bg-blue-50', 'CONTACTED': 'bg-yellow-50', 'QUALIFIED': 'bg-emerald-50', 'NEGOCIATION': 'bg-orange-50', 'PROPOSITION': 'bg-purple-50', 'LOST': 'bg-red-50' };
  const dots: any = { 'NEW': 'bg-blue-500', 'CONTACTED': 'bg-yellow-500', 'QUALIFIED': 'bg-emerald-500', 'NEGOCIATION': 'bg-orange-500', 'PROPOSITION': 'bg-purple-500', 'LOST': 'bg-red-500' };

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
    <div className="grid grid-cols-3 gap-4 p-4">
      {statuses.map(status => (
        <div key={status} className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dots[status]}`} />
              <h3 className="font-medium">{status}</h3>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {leads.filter((l: any) => l.status === status).length}
              </span>
            </div>
          </div>
          <div
            className={`${colors[status]} rounded-lg p-2 min-h-[400px] space-y-2`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            {leads.filter((l: any) => l.status === status).map((lead: any) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => handleDragStart(e, lead.id)}
                className="bg-white rounded-lg p-3 border shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
                onClick={() => onLeadClick(lead)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium truncate">{lead.name || 'Unnamed'}</h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">{lead.email || 'No email'}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-emerald-600">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</span>
                  <span className="text-xs text-gray-500">{lead.probability ? `${lead.probability}%` : ''}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 flex items-center gap-1"><Calendar size={10} />{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}