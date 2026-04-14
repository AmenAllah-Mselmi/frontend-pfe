'use client';
import { TrendingUp, DollarSign, Users, Target, Clock, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsProps {
  stats: {
    revenue: { value: string; change: string; trend: string };
    deals: { value: string; change: string; trend: string };
    conversion: { value: string; change: string; trend: string };
    avgDeal: { value: string; change: string; trend: string };
    winRate: { value: string; change: string; trend: string };
    velocity: { value: string; change: string; trend: string };
  };
}

export default function AnalyticsStats({ stats }: StatsProps) {
  const cards = [
    { label: 'Revenue', value: stats.revenue.value, change: stats.revenue.change, trend: stats.revenue.trend, icon: DollarSign, color: 'green' },
    { label: 'Total Deals', value: stats.deals.value, change: stats.deals.change, trend: stats.deals.trend, icon: Users, color: 'blue' },
    { label: 'Conversion', value: stats.conversion.value, change: stats.conversion.change, trend: stats.conversion.trend, icon: TrendingUp, color: 'purple' },
    { label: 'Avg Deal', value: stats.avgDeal.value, change: stats.avgDeal.change, trend: stats.avgDeal.trend, icon: Target, color: 'orange' },
    { label: 'Win Rate', value: stats.winRate.value, change: stats.winRate.change, trend: stats.winRate.trend, icon: Award, color: 'pink' },
    { label: 'Velocity', value: stats.velocity.value, change: stats.velocity.change, trend: stats.velocity.trend, icon: Clock, color: 'indigo' }
  ];

  const colorMaps: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const colors = colorMaps[card.color] || { bg: 'bg-gray-50', text: 'text-gray-600' };
        return (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${colors.bg} rounded-lg group-hover:scale-110 transition`}>
                <Icon size={18} className={colors.text} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                card.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-xs text-gray-500">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}