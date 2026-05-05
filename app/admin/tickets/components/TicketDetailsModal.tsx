'use client';
import { useState } from 'react';
import {
  X, User, Calendar,
  Clock, AlertCircle, CheckCircle, Edit, Trash2,
  ChevronDown
} from 'lucide-react';

export default function TicketDetailsModal({ ticket, onClose, onEdit, onStatusChange }: any) {

  const statusColors: any = {
    'NEW': 'bg-gray-100 text-gray-700',
    'OPEN': 'bg-blue-100 text-blue-700',
    'PENDING': 'bg-yellow-100 text-yellow-700',
    'RESOLVED': 'bg-green-100 text-green-700',
    'CLOSED': 'bg-red-100 text-red-700'
  };

  const priorityColors: any = {
    'CRITICAL': 'bg-red-100 text-red-700',
    'HIGH': 'bg-orange-100 text-orange-700',
    'MEDIUM': 'bg-yellow-100 text-yellow-700',
    'LOW': 'bg-green-100 text-green-700'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                #{ticket.id}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
                <p className="text-sm text-gray-500">Created {formatDate(ticket.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(ticket)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit size={18} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={ticket.status}
                onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                className={`appearance-none px-4 py-2 pr-8 text-sm rounded-lg font-medium border-0 cursor-pointer ${statusColors[ticket.status]}`}
              >
                <option value="NEW">New</option>
                <option value="OPEN">Open</option>
                <option value="PENDING">Pending</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className={`px-3 py-1 text-sm rounded-lg font-medium ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
              {ticket.category}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              {ticket.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xs text-gray-500 mb-3">Assignment</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Created by: {ticket.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Assigned to: {ticket.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xs text-gray-500 mb-3">Dates</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Created: {formatDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Due: {ticket.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}