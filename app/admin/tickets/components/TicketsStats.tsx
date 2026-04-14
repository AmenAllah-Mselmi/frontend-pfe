import { Ticket, Clock, AlertCircle, CheckCircle, MessageSquare, TrendingUp } from 'lucide-react';

export default function TicketsStats({ tickets }: any) {
  const total = tickets.length;
  const open = tickets.filter((t: any) => t.status === 'open').length;
  const inProgress = tickets.filter((t: any) => t.status === 'in_progress').length;
  const resolved = tickets.filter((t: any) => t.status === 'resolved').length;
  const critical = tickets.filter((t: any) => t.priority === 'critical').length;
  const high = tickets.filter((t: any) => t.priority === 'high').length;

  const stats = [
    {
      label: 'Total Tickets',
      value: total,
      icon: Ticket,
      color: 'blue',
      change: '+12'
    },
    {
      label: 'Open',
      value: open,
      icon: AlertCircle,
      color: 'red',
      change: '+5'
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Clock,
      color: 'yellow',
      change: '+3'
    },
    {
      label: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      color: 'green',
      change: '+8'
    },
    {
      label: 'Critical',
      value: critical,
      icon: TrendingUp,
      color: 'purple',
      change: '+2'
    },
    {
      label: 'High Priority',
      value: high,
      icon: MessageSquare,
      color: 'orange',
      change: '+4'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-2">
              <div className={`p-2 bg-${stat.color}-50 rounded-lg group-hover:scale-110 transition`}>
                <Icon size={16} className={`text-${stat.color}-600`} />
              </div>
              <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}