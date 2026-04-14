'use client';
import React from 'react';
import {
  FileText,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Activity,
  DollarSign,
  Target,
  MoreHorizontal,
} from 'lucide-react';

const getIcon = (type: string) => {
  const icons: Record<string, { icon: React.ReactElement; color: string }> = {
    deal_created: { icon: <DollarSign size={16} />, color: 'bg-green-100 text-green-600' },
    deal_won: { icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-600' },
    deal_lost: { icon: <AlertCircle size={16} />, color: 'bg-red-100 text-red-600' },
    lead_status_change: { icon: <Target size={16} />, color: 'bg-blue-100 text-blue-600' },
    note_added: { icon: <FileText size={16} />, color: 'bg-yellow-100 text-yellow-600' },
    email_sent: { icon: <Mail size={16} />, color: 'bg-purple-100 text-blue-600' },
    call_logged: { icon: <Phone size={16} />, color: 'bg-orange-100 text-orange-600' },
    task_completed: { icon: <CheckCircle size={16} />, color: 'bg-green-100 text-green-600' },
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

export default function ActivitiesFeed({ activities, onActivityClick }: any) {
  if (!activities?.length) {
    return (
      <div className="p-12 text-center">
        <Activity size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No activities found</p>
        <p className="text-sm text-gray-400 mt-1">Log your first activity using the button above</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
      {activities.map((a: any) => {
        const { icon, color } = getIcon(a.type);
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
                <h4 className="font-medium text-gray-900 text-sm">{a.title}</h4>
                <span className="text-xs text-gray-400">{formatTime(a.timestamp)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{a.description}</p>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-medium">
                    {a.user?.avatar}
                  </div>
                  <span className="text-gray-500">{a.user?.name}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-gray-500 capitalize">{a.entity}</span>
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

            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg transition">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
}