import { Users, TrendingUp, DollarSign, Target, Award, Clock, Star } from 'lucide-react';

interface RepresentativesStatsProps {
  representatives: any[];
}

export default function RepresentativesStats({ representatives }: RepresentativesStatsProps) {
  const totalReps = representatives.length;
  const activeReps = representatives.length;
  const topPerformers = 0;
  const totalRevenue = 0;
  const totalDeals = 0;
  const avgQuota = 0;

  const stats = [
    {
      label: 'Total Representatives',
      value: totalReps,
      icon: Users,
      color: 'blue',
      change: '+2 this month'
    },
    {
      label: 'Active',
      value: activeReps,
      icon: Clock,
      color: 'green',
      change: `${Math.round((activeReps / totalReps) * 100) || 0}% of team`
    },
    {
      label: 'Top Performers',
      value: topPerformers,
      icon: Star,
      color: 'yellow',
      change: `${Math.round((topPerformers / totalReps) * 100) || 0}% of team`
    },
    {
      label: 'Total Revenue',
      value: `${(totalRevenue / 1000000).toFixed(1)}M€`,
      icon: DollarSign,
      color: 'purple',
      change: '+15.3%'
    },
    {
      label: 'Total Deals',
      value: totalDeals,
      icon: Target,
      color: 'orange',
      change: '+24'
    },
    {
      label: 'Avg Quota',
      value: `${Math.round(avgQuota)}%`,
      icon: TrendingUp,
      color: 'pink',
      change: '+5.2%'
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