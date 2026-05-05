import { DollarSign, TrendingUp, Target, Clock, Award } from 'lucide-react';

export default function PipelineStats({ deals }: any) {
  const activeDeals = deals.filter((d: any) => !['WON', 'LOST', 'CLOSED'].includes(d.status)).length;
  const totalValue = deals.reduce((acc: number, d: any) => acc + (d.amount || 0), 0);
  const avgValue = deals.length > 0 ? Math.round(totalValue / deals.length) : 0;
  const wonDeals = deals.filter((d: any) => d.status === 'WON').length;
  const conversionRate = deals.length > 0 ? Math.round((wonDeals / deals.length) * 100) : 0;

  const stats = [
    { 
      label: 'Pipeline Value', 
      value: `${(totalValue / 1000000).toFixed(1)}M`, 
      subValue: `${totalValue.toLocaleString()}€`,
      icon: '💰', 
      color: 'blue', 
      trend: '+12.3%', 
      trendUp: true 
    },
    { 
      label: 'Conversion Rate', 
      value: `${conversionRate}%`, 
      icon: '📈', 
      color: 'emerald', 
      trend: '+5.2%', 
      trendUp: true 
    },
    { 
      label: 'Active Deals', 
      value: activeDeals, 
      icon: '👥', 
      color: 'purple', 
      trend: `+${Math.floor(activeDeals * 0.1)}`, 
      trendUp: true 
    },
    { 
      label: 'Avg. Deal Size', 
      value: `${(avgValue / 1000).toFixed(1)}K`, 
      subValue: `${avgValue.toLocaleString()}€`,
      icon: '📊', 
      color: 'blue', 
      trend: '-2.1%', 
      trendUp: false 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-4xl">{stat.icon}</span>
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
              {stat.subValue && <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>}
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
              {stat.trend}
            </span>
            <span className="text-[10px] text-gray-400 font-medium italic">from last month</span>
          </div>
          
          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 w-0 group-hover:w-full ${
            stat.color === 'blue' ? 'from-blue-400 to-blue-600' :
            stat.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
            'from-purple-400 to-purple-600'
          }`} />
        </div>
      ))}
    </div>
  );
}