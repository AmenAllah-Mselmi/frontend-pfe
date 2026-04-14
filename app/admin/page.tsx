// app/admin/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Lead, useLeadStore } from '@/lib/leadStore';
import { User, useUserStore } from '@/lib/userStore';
import { Ticket, useTicketStore } from '@/lib/ticketStore';

export default function AdminDashboardPage() {
  const { leads, loadLeads } = useLeadStore();
  const { users, loadUsers } = useUserStore();
  const { tickets, loadTickets } = useTicketStore();

  useEffect(() => {
    loadLeads();
    loadUsers();
    loadTickets();
  }, [loadLeads, loadUsers, loadTickets]);

  // runtime-safe arrays — backend may return an object wrapper instead of raw arrays
  const leadList: Lead[] = Array.isArray(leads)
    ? leads
    : Array.isArray((leads as unknown as { leads?: Lead[] })?.leads)
    ? (leads as unknown as { leads: Lead[] }).leads
    : [];

  const userList: User[] = Array.isArray(users)
    ? users
    : Array.isArray((users as unknown as { users?: User[] })?.users)
    ? (users as unknown as { users: User[] }).users
    : [];

  const ticketList: Ticket[] = Array.isArray(tickets)
    ? tickets
    : Array.isArray((tickets as unknown as { tickets?: Ticket[] })?.tickets)
    ? (tickets as unknown as { tickets: Ticket[] }).tickets
    : [];

  const totalLeads = leadList.length;
  const qualifiedLeads = leadList.filter((l: Lead) => l.status === 'QUALIFIED').length;
  const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const totalRevenue = leadList
    .filter((l: Lead) => l.status === 'QUALIFIED')
    .reduce((sum: number, lead: Lead) => sum + (lead.dealValue || 0), 0);
  const stats = [
    {
      label: 'Total Leads',
      value: totalLeads.toString(),
      change: '+12.5%',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Taux Conversion (QUALIFIED)',
      value: `${conversionRate}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'CA Total (QUALIFIED)',
      value: `${(totalRevenue / 1000000).toFixed(2)}M€`,
      change: '+8.2%',
      icon: DollarSign,
      color: 'purple'
    },
    {
      label: 'Total Utilisateurs',
      value: userList.length.toString(),
      change: '+1',
      icon: Target,
      color: 'orange'
    }
  ];

  const getPipelineCount = (status: string) => leadList.filter((l: Lead) => l.status === status).length;
  const getPipelinePercentage = (status: string) => totalLeads > 0 ? (getPipelineCount(status) / totalLeads) * 100 : 0;

  const pipelineStatus = [
    { stage: 'Nouveaux leads (NEW)', count: getPipelineCount('NEW'), percentage: getPipelinePercentage('NEW'), color: 'blue' },
    { stage: 'Contactés (CONTACTED)', count: getPipelineCount('CONTACTED'), percentage: getPipelinePercentage('CONTACTED'), color: 'orange' },
    { stage: 'Qualifiés (QUALIFIED)', count: getPipelineCount('QUALIFIED'), percentage: getPipelinePercentage('QUALIFIED'), color: 'green' },
    { stage: 'Perdus (LOST)', count: getPipelineCount('LOST'), percentage: getPipelinePercentage('LOST'), color: 'red' }
  ];

  const recentActivity = ticketList.slice(0, 5).map((ticket: Ticket) => ({
    action: `Ticket: ${ticket.title}`,
    user: `User ID: ${ticket.userId}`,
    time: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Récemment',
    status: ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'success' : 'warning'
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
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
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pipeline Status */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">Statut du Pipeline</h2>
          <div className="space-y-6">
            {pipelineStatus.map((item, i) => {
              const bgColor = item.color === 'blue' ? 'bg-blue-500' :
                            item.color === 'orange' ? 'bg-orange-500' :
                            item.color === 'green' ? 'bg-green-500' :
                            'bg-red-500';
              return (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">{item.stage}</span>
                    <span className="font-bold text-gray-900">{item.count} leads ({item.percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`${bgColor} h-full rounded-full transition-all duration-500 group-hover:opacity-80`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Importer des leads (CSV)
            </button>
            <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              Générer rapport
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              Ajouter utilisateur
            </button>
            <button className="w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              Configurer pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Activité récente</h2>
          <Activity size={18} className="text-gray-400" />
        </div>
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {activity.status === 'success' ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : activity.status === 'warning' ? (
                    <AlertCircle size={16} className="text-yellow-500" />
                  ) : (
                    <Clock size={16} className="text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">Par {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Le {activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-6 text-center text-gray-500 text-sm">
            Aucune activité récente (ajoutez des tickets pour les voir ici).
          </div>
        )}
      </div>
    </div>
  );
}