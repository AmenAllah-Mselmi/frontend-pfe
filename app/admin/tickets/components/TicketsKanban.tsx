'use client';
import { useState } from 'react';
import {
  Clock,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

export default function TicketsKanban({ tickets, onViewDetails, onStatusChange }: any) {
  const [draggedTicket, setDraggedTicket] = useState<any>(null);

  const columns = [
    { id: 'NEW', title: 'New', icon: '🔵', color: 'gray' },
    { id: 'OPEN', title: 'Open', icon: '🟢', color: 'blue' },
    { id: 'PENDING', title: 'Pending', icon: '🟡', color: 'yellow' },
    { id: 'RESOLVED', title: 'Resolved', icon: '✅', color: 'green' },
    { id: 'CLOSED', title: 'Closed', icon: '⚫', color: 'gray' }
  ];

  const columnColors: any = {
    'NEW': { bg: 'bg-gray-50', dot: 'bg-gray-500', border: 'border-gray-200' },
    'OPEN': { bg: 'bg-blue-50', dot: 'bg-blue-500', border: 'border-blue-200' },
    'PENDING': { bg: 'bg-yellow-50', dot: 'bg-yellow-500', border: 'border-yellow-200' },
    'RESOLVED': { bg: 'bg-green-50', dot: 'bg-green-500', border: 'border-green-200' },
    'CLOSED': { bg: 'bg-gray-50', dot: 'bg-gray-500', border: 'border-gray-200' }
  };

  const handleDragStart = (e: React.DragEvent, ticket: any) => {
    setDraggedTicket(ticket);
    e.dataTransfer.setData('text/plain', JSON.stringify(ticket));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTicket && draggedTicket.status !== status) {
      onStatusChange(draggedTicket.id, status);
    }
    setDraggedTicket(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 overflow-x-auto">
      {columns.map((column) => {
        const columnTickets = tickets.filter((t: any) => t.status === column.id);
        const colors = columnColors[column.id];

        return (
          <div
            key={column.id}
            className="flex-1 min-w-[250px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-3 p-2 bg-white rounded-lg border ${colors.border}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{column.icon}</span>
                <h3 className="font-semibold text-gray-700">{column.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} text-gray-600`}>
                  {columnTickets.length}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={14} />
              </button>
            </div>

            {/* Tickets Container */}
            <div className={`${colors.bg} rounded-xl p-3 min-h-[500px] space-y-3`}>
              {columnTickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-lg p-3 border shadow-sm hover:shadow-md cursor-pointer transition-all group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket)}
                  onClick={() => onViewDetails(ticket)}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
                  </div>

                  {/* Title */}
                  <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                    {ticket.title}
                  </h4>
                  {ticket.leadName && ticket.leadName !== '-' && (
                    <p className="text-xs text-blue-600 mb-2 font-medium">{ticket.leadName}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">#{ticket.id}</span>
                    <span className="text-xs text-gray-400">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {columnTickets.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-400">No tickets</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}