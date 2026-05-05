'use client';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, DollarSign, Users, Target, BarChart3, Activity, Award, CheckCircle, Ticket, FileText, RefreshCw, Zap, ArrowUpRight, Clock } from 'lucide-react';
import AnalyticsCharts from '@/app/admin/analytics/components/AnalyticsCharts';
import { useAuthStore } from '@/lib/authStore';

export default function RepAnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/analytics/rep/${user.id}`, { credentials: 'include' });
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /><span className="text-gray-400 text-sm">Chargement...</span></div>
    </div>
  );
  if (!data) return null;

  const s = data.stats;
  const obj = data.objectives;
  const progress = (actual: number, target: number) => target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2"><BarChart3 size={24} className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Mes Performances</h1>
              <p className="text-sm text-gray-500">Suivi des objectifs et productivité</p>
            </div>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /><span className="text-sm">Actualiser</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <RepCard icon={Users} label="Leads Assignés" value={s.assignedLeads} color="blue" />
          <RepCard icon={CheckCircle} label="Leads Convertis" value={s.convertedLeads} color="green" sub={`${s.lostLeads} perdus`} />
          <RepCard icon={Award} label="Deals Gagnés" value={s.dealsWon} color="emerald" sub={`/ ${s.dealsTotal} total`} />
          <RepCard icon={DollarSign} label="Revenus" value={`${(s.revenue / 1000).toFixed(1)}K€`} color="green" />
          <RepCard icon={TrendingUp} label="Conversion" value={`${s.conversionRate}%`} color="purple" />
          <RepCard icon={CheckCircle} label="Tâches Complétées" value={s.completedTasks} color="orange" sub={`/ ${s.totalTasks} total`} />
          <RepCard icon={Activity} label="Activités" value={s.totalActivities} color="indigo" />
          <RepCard icon={Zap} label="Pipeline" value={`${(s.pipelineValue / 1000).toFixed(1)}K€`} color="amber" />
        </div>

        {/* Objectifs Mensuels */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Objectifs Mensuels</h3>
          <p className="text-sm text-gray-500 mb-6">Progression du mois en cours</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ObjectiveBar label="Leads" actual={obj.leadsActual} target={obj.leadsTarget} color="blue" />
            <ObjectiveBar label="Tâches" actual={obj.tasksActual} target={obj.tasksTarget} color="green" />
            <ObjectiveBar label="Revenue" actual={obj.revenueActual} target={obj.revenueTarget} color="purple" unit="€" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-1">Historique Productivité</h3>
            <p className="text-sm text-gray-500 mb-4">Activités par mois</p>
            <AnalyticsCharts type="revenue" data={data.monthlyProductivity.map((m: any) => ({ month: m.month, value: m.activities }))} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-1">Mon Pipeline</h3>
            <p className="text-sm text-gray-500 mb-4">Répartition des leads</p>
            <AnalyticsCharts type="funnel" data={data.pipelineStatus} />
          </div>
        </div>

        {/* Performance Personnelle */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Performance Personnelle</h3>
          <p className="text-sm text-gray-500 mb-6">Résumé détaillé</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MiniStat label="Notes créées" value={s.totalNotes} icon={FileText} />
            <MiniStat label="Tickets" value={s.totalTickets} icon={Ticket} />
            <MiniStat label="Tâches en cours" value={s.totalTasks - s.completedTasks} icon={Clock} />
            <MiniStat label="Taux complétion" value={`${s.totalTasks > 0 ? Math.round((s.completedTasks / s.totalTasks) * 100) : 0}%`} icon={Target} />
          </div>
        </div>

        {/* Revenue History */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-1">Historique Revenue</h3>
          <p className="text-sm text-gray-500 mb-4">Évolution mensuelle des revenus</p>
          <AnalyticsCharts type="revenue" data={data.monthlyProductivity.map((m: any) => ({ month: m.month, value: m.revenue }))} />
        </div>
      </div>
    </div>
  );
}

function RepCard({ icon: Icon, label, value, color, sub }: any) {
  const cm: any = { blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-emerald-600', emerald: 'from-emerald-500 to-teal-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-red-500', indigo: 'from-indigo-500 to-indigo-600', amber: 'from-amber-500 to-orange-500' };
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${cm[color] || cm.blue} text-white inline-block mb-3 group-hover:scale-110 transition`}><Icon size={18} /></div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ObjectiveBar({ label, actual, target, color, unit = '' }: any) {
  const pct = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;
  const barColor: any = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500' };
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-500">{pct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${barColor[color] || barColor.blue} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Actuel: {actual}{unit}</span>
        <span>Objectif: {target}{unit}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
      <div className="p-2 bg-white rounded-lg shadow-sm"><Icon size={16} className="text-gray-400" /></div>
      <div><p className="text-lg font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
    </div>
  );
}
