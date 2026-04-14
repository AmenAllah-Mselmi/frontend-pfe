'use client';
import { Activity, Mail, Phone, CheckCircle, Target, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useActivityStore } from '@/lib/activityStore';

export default function ActivitiesStats() {
  const { activities } = useActivityStore();

  if (!activities?.length) return null;

  const total = activities.length;
  const emails = activities.filter((a: any) => a.type === 'email_sent').length;
  const calls = activities.filter((a: any) => a.type === 'call_logged').length;
  const tasks = activities.filter((a: any) => a.type === 'task_completed').length;
  const deals = activities.filter((a: any) => a.type?.includes('deal')).length;
  const leads = activities.filter((a: any) => a.type?.includes('lead')).length;

  const stats = [
    { label: 'Total Activities', value: total, icon: Activity, color: 'purple', change: '+12%' },
    { label: 'Emails Sent', value: emails, icon: Mail, color: 'blue', change: '+5' },
    { label: 'Calls Made', value: calls, icon: Phone, color: 'green', change: '+8' },
    { label: 'Tasks Done', value: tasks, icon: CheckCircle, color: 'orange', change: '+15' },
    { label: 'Deals', value: deals, icon: DollarSign, color: 'indigo', change: '+3' },
    { label: 'Leads', value: leads, icon: Target, color: 'pink', change: '+7' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 bg-${s.color}-50 rounded-lg group-hover:scale-110 transition`}>
                <Icon size={16} className={`text-${s.color}-600`} />
              </div>
              {s.change && (
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                  {s.change}
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}