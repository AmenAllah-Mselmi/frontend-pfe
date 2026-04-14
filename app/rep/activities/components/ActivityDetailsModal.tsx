'use client';
import React from 'react';
import {
  X, User, Calendar, Clock, FileText, Mail, Phone,
  CheckCircle, Target, DollarSign, AlertCircle,
  Building2, Tag
} from 'lucide-react';

export default function ActivityDetailsModal({ activity, onClose }: any) {
  const getIcon = (type: string) => {
    const icons: Record<string, { icon: React.ReactElement; color: string }> = {
      'deal_created': { icon: <DollarSign size={20} />, color: 'bg-green-100 text-green-600' },
      'deal_won': { icon: <CheckCircle size={20} />, color: 'bg-green-100 text-green-600' },
      'deal_lost': { icon: <AlertCircle size={20} />, color: 'bg-red-100 text-red-600' },
      'lead_status_change': { icon: <Target size={20} />, color: 'bg-blue-100 text-blue-600' },
      'note_added': { icon: <FileText size={20} />, color: 'bg-yellow-100 text-yellow-600' },
      'email_sent': { icon: <Mail size={20} />, color: 'bg-purple-100 text-blue-600' },
      'call_logged': { icon: <Phone size={20} />, color: 'bg-orange-100 text-orange-600' },
      'task_completed': { icon: <CheckCircle size={20} />, color: 'bg-green-100 text-green-600' }
    };
    return icons[type] || { icon: <FileText size={20} />, color: 'bg-gray-100 text-gray-600' };
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const { icon, color } = getIcon(activity.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
                {icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
                <p className="text-sm text-gray-500">ID: #{activity.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Description */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
            <p className="text-sm text-gray-600">{activity.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">User</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs">
                  {activity.user.avatar}
                </div>
                <span className="text-sm font-medium">Me</span>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar size={12} className="text-gray-400" />
                  <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock size={12} className="text-gray-400" />
                  <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Entity Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Related Entity</p>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-sm font-medium capitalize">{activity.entity}</span>
              <span className="text-xs text-gray-400 ml-auto">ID: #{activity.entityId}</span>
            </div>
          </div>

          {/* Metadata */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Additional Information</p>
              <div className="space-y-2">
                {Object.entries(activity.metadata).map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <Tag size={14} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 capitalize">{k.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-600">{String(v)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              View {activity.entity}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}