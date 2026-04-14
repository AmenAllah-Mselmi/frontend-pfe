import { DollarSign, TrendingUp, Target, Clock, Award } from 'lucide-react';

export default function PipelineStats({ deals }: any) {
  const total = deals.reduce((s: number, d: any) => s + (d.amount || 0), 0);
  const avg = deals.length ? total / deals.length : 0;
  const won = deals.filter((d: any) => d.status === 'WON').length;
  const rate = deals.length ? (won / deals.length) * 100 : 0;

  const stats = [
    { label: 'Total Value', value: `${total.toLocaleString()}€`, icon: DollarSign, color: 'blue', change: '+12%' },
    { label: 'Avg Deal', value: `${Math.round(avg).toLocaleString()}€`, icon: Target, color: 'purple', change: '+5%' },
    { label: 'Win Rate', value: `${rate.toFixed(1)}%`, icon: Award, color: 'green', change: '+3%' },
    { label: 'Active Deals', value: deals.length, icon: TrendingUp, color: 'orange', change: '+8' },
    { label: 'Velocity', value: '12.4j', icon: Clock, color: 'pink', change: '-2j' }
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