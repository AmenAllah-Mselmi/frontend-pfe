'use client';
import { TrendingUp, DollarSign, Users, Target, Clock, Award, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react';

interface StatsProps {
  stats: Record<string, { value: string; change: string; trend: string }>;
}

export default function AnalyticsStats({ stats }: StatsProps) {
  const iconMap: Record<string, any> = {
    revenue: DollarSign, deals: Users, contacts: Target, companies: Building2,
    conversion: TrendingUp, avgDeal: Target, winRate: Award, velocity: Clock,
  };
  const colorMap: Record<string, string> = {
    revenue: 'green', deals: 'blue', contacts: 'indigo', companies: 'purple',
    conversion: 'purple', avgDeal: 'orange', winRate: 'pink', velocity: 'indigo',
  };
  const labelMap: Record<string, string> = {
    revenue: 'Revenue', deals: 'Total Leads', contacts: 'Total Contacts', companies: 'Total Companies',
    conversion: 'Conversion', avgDeal: 'Avg Deal', winRate: 'Win Rate', velocity: 'Velocity',
  };
  const colorMaps: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-50', text: 'text-green-600' }, blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' }, orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-600' }, indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  const cards = Object.entries(stats).map(([key, val]) => ({
    label: labelMap[key] || key, value: val.value, change: val.change, trend: val.trend,
    icon: iconMap[key] || Target, color: colorMap[key] || 'blue',
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const colors = colorMaps[card.color] || { bg: 'bg-gray-50', text: 'text-gray-600' };
        return (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 ${colors.bg} rounded-lg group-hover:scale-110 transition`}><Icon size={18} className={colors.text} /></div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${card.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{card.change}
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