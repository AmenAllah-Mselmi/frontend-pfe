import { Users, TrendingUp, DollarSign, Target, Clock } from 'lucide-react';

export default function LeadsStats({ leads }: any) {
  const total = leads.length;
  const hot = leads.filter((l: any) => l.status === 'NEW').length;
  const value = leads.reduce((s: number, l: any) => s + (l.dealValue || 0), 0);
  const tasks = leads.reduce((s: number, l: any) => s + (l.tasks?.filter((t: any) => t.status === 'pending').length || 0), 0);

  const stats = [
    { label: 'My Leads', value: total, icon: Users, color: 'blue', change: '+5' },
    { label: 'Hot Leads', value: hot, icon: TrendingUp, color: 'red', change: '+2' },
    { label: 'Pipeline Value', value: `${value.toLocaleString()}€`, icon: DollarSign, color: 'green', change: '+12%' },
    { label: 'Pending Tasks', value: tasks, icon: Target, color: 'orange', change: '3 due' },
    { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'purple', change: '-30m' },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border hover:shadow-md transition">
          <div className="flex justify-between mb-2">
            <div className={`p-2 bg-${s.color}-50 rounded-lg`}><s.icon size={16} className={`text-${s.color}-600`} /></div>
            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{s.change}</span>
          </div>
          <p className="text-xl font-bold">{s.value}</p>
          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}