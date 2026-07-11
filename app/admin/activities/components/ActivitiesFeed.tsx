'use client';
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  DollarSign,
  Target,
  GitBranch,
  MoreHorizontal,
  Activity,
  Star
} from 'lucide-react';

export default function ActivitiesFeed({ activities, onActivityClick, onEdit, onDelete }: any) {
  const [filter, setFilter] = useState('all');

  const getIcon = (type: string) => {
    const icons: Record<string, { icon: React.ReactElement; color: string }> = {
      'deal_created': {
        icon: <DollarSign size={16} />,
        color: 'bg-green-100 text-green-600'
      },
      'deal_won': {
        icon: <CheckCircle size={16} />,
        color: 'bg-green-100 text-green-600'
      },
      'deal_lost': {
        icon: <AlertCircle size={16} />,
        color: 'bg-red-100 text-red-600'
      },
      'lead_status_change': {
        icon: <Target size={16} />,
        color: 'bg-blue-100 text-blue-600'
      },
      'note_added': {
        icon: <FileText size={16} />,
        color: 'bg-yellow-100 text-yellow-600'
      },
      'email_sent': {
        icon: <Mail size={16} />,
        color: 'bg-purple-100 text-blue-600'
      },
      'call_logged': {
        icon: <Phone size={16} />,
        color: 'bg-orange-100 text-orange-600'
      },
      'task_completed': {
        icon: <CheckCircle size={16} />,
        color: 'bg-green-100 text-green-600'
      },
      'pipeline_created': {
        icon: <GitBranch size={16} />,
        color: 'bg-indigo-100 text-indigo-600'
      }
    };
    return icons[type] || { icon: <Activity size={16} />, color: 'bg-gray-100 text-gray-600' };
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString();
  };

  const filtered = filter === 'all'
    ? activities
    : activities.filter((a: any) => a.type === filter);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'deal_created', label: 'Deals' },
    { value: 'email_sent', label: 'Emails' },
    { value: 'call_logged', label: 'Calls' },
    { value: 'note_added', label: 'Notes' }
  ];

  if (!activities?.length) {
    return (
      <div className="p-12 text-center">
        <Activity size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No activities found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${filter === f.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
        {filtered.map((a: any) => {
          const { icon, color } = getIcon(a.type);

          // ✅ CORRECTION: Vérifier que user existe
          const userName = a.user?.name || 'Unknown';
          const userAvatar = a.user?.avatar || '?';

          return (
            <div
              key={a.id}
              onClick={() => onActivityClick(a)}
              className="flex items-start gap-4 p-4 hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm">{a.title || 'Untitled'}</h4>
                  <span className="text-xs text-gray-400">{formatTime(a.timestamp || new Date().toISOString())}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{a.description || 'No description'}</p>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-6000 to-pink-500 flex items-center justify-center text-white text-[10px] font-medium">
                      {userAvatar}
                    </div>
                    <span className="text-gray-500">{userName}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 capitalize">
                    {a.entity || 'unknown'} {a.metadata?.entityName ? `- ${a.metadata.entityName}` : (a.entityId ? `- #${a.entityId}` : '')}
                  </span>
                  {a.metadata?.value && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-green-600 font-medium">
                        {a.metadata.value.toLocaleString()}€
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
                <button onClick={(e) => { e.stopPropagation(); if (onEdit) onEdit(a); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(a); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}