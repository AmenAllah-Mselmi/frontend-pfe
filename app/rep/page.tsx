// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLeadStore } from '@/lib/leadStore';

export default function DashboardPage() {
  const { leads, loadLeads } = useLeadStore();

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED').length;
  const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0.0';
  const totalRevenue = leads.reduce((sum, lead) => sum + (lead.dealValue || 0), 0);

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);
  const stats = [
    {
      label: 'Leads Totaux',
      value: totalLeads.toString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Taux Conversion (QUALIFIED)',
      value: `${conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'CA Potentiel',
      value: `${(totalRevenue / 1000000).toFixed(2)}M€`,
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    },
    {
      label: 'Objectifs',
      value: '78%',
      change: '-3.1%',
      trend: 'down',
      icon: Target,
      color: 'orange'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">Bienvenue sur votre espace ISSATSO</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';
          const colorClass = stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                           stat.color === 'green' ? 'bg-green-50 text-green-600' :
                           stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                           'bg-orange-50 text-orange-600';

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${colorClass} rounded-lg group-hover:scale-110 transition`}>
                  <Icon size={20} />
                </div>
                <span className={`flex items-center text-xs font-medium ${trendColor} bg-white px-2 py-1 rounded-full shadow-sm`}>
                  {stat.change}
                  <TrendIcon size={14} className="ml-1" />
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Activité récente</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{lead.name || 'Lead Anonyme'}</p>
                    <p className="text-xs text-gray-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Récemment'}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {lead.status}
                </span>
              </div>
            ))
          ) : (
            <div className="px-6 py-6 text-center text-gray-500 text-sm">
              Aucun lead récent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}