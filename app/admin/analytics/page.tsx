'use client';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, DollarSign, Users, Target, Clock, Calendar, Download, Filter, BarChart3, PieChart, LineChart, Activity, Award, ArrowUpRight, ArrowDownRight, MoreHorizontal, Building2, RefreshCw, Briefcase, CheckCircle, Ticket, FileText, Zap } from 'lucide-react';
import AnalyticsCharts from './components/AnalyticsCharts';
import AnalyticsFilters from './components/AnalyticsFilters';
import DateRangePicker from './components/DateRangePicker';
import { useAuthStore } from '@/lib/authStore';
import toast from 'react-hot-toast';

interface DashboardData {
  globalStats: any;
  monthlyGrowth: any[];
  statusAnalysis: any;
  repPerformance: any[];
  pipelineFunnel: any[];
  topCompanies: any[];
  industryAnalysis: any[];
  heatmap: number[][];
  forecast: any;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview'|'performance'|'forecasts'>('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const params = new URLSearchParams();
      if (filters.userId) params.set('userId', filters.userId);
      if (filters.status) params.set('status', filters.status);
      if (filters.companyId) params.set('companyId', filters.companyId);
      
      // Date range logic
      const now = new Date();
      let fromDate: Date | null = null;
      if (dateRange === '7d') fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      else if (dateRange === '30d') fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      else if (dateRange === '90d') fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      else if (dateRange === '12m') fromDate = new Date(now.getFullYear(), 0, 1);
      
      if (fromDate) params.set('from', fromDate.toISOString());
      params.set('to', now.toISOString());

      const res = await fetch(`${base}/analytics/dashboard?${params}`, { credentials: 'include' });
      if (res.ok) setData(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filters, dateRange]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const handleExportPDF = async () => {
    if (!data) return toast.error('No data to export');
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');
    const M = 14, W = 182;
    const today = new Date().toLocaleDateString('fr-FR');
    let y = 0;
    const check = (n: number) => { if (y + n > 280) { doc.addPage(); y = 20; } };
    doc.setFillColor(37, 99, 235); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('Analytics Report', M, 18);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Généré le: ${today}`, M, 28);
    doc.text(`Leads: ${data.globalStats.totalLeads} | Contacts: ${data.globalStats.totalContacts} | Companies: ${data.globalStats.totalCompanies}`, M, 35);
    doc.setTextColor(30, 30, 30); y = 50;

    const section = (t: string) => { check(14); doc.setFillColor(239, 246, 255); doc.rect(M, y, W, 9, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(37, 99, 235); doc.text(t, M + 3, y + 6.5); doc.setTextColor(30, 30, 30); y += 13; };
    const row = (cols: string[], ws: number[], h = false, s = false) => { check(8); if (s) { doc.setFillColor(248, 250, 252); doc.rect(M, y, W, 7.5, 'F'); } doc.setFont('helvetica', h ? 'bold' : 'normal'); doc.setFontSize(h ? 9 : 8.5); let x = M + 2; cols.forEach((c, i) => { doc.text(c, x, y + 5.5); x += ws[i]; }); y += 7.5; };

    section('KPI Summary');
    const kw = [90, 92];
    row(['Metric', 'Value'], kw, true);
    row(['Total Leads', String(data.globalStats.totalLeads)], kw, false, true);
    row(['Total Revenue', `${data.globalStats.totalRevenue.toLocaleString()}€`], kw);
    row(['Conversion Rate', `${data.globalStats.conversionRate}%`], kw, false, true);
    row(['Pipeline Value', `${data.globalStats.pipelineValue.toLocaleString()}€`], kw);
    y += 4;

    if (data.repPerformance.length) {
      section('Team Performance');
      const tw = [55, 30, 50, 47];
      row(['Rep', 'Deals', 'Revenue', 'Conversion'], tw, true);
      data.repPerformance.forEach((r: any, i: number) => row([r.name, String(r.dealsWon), `${r.revenue.toLocaleString()}€`, `${r.conversionRate}%`], tw, false, i % 2 === 0));
    }

    const pc = (doc as any).internal.pages.length - 1;
    for (let p = 1; p <= pc; p++) { doc.setPage(p); doc.setFontSize(8); doc.setTextColor(150); doc.text(`CRM Report • ${today} • Page ${p}/${pc}`, M, 290); }
    doc.save(`analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported!');
  };

  const s = data?.globalStats;
  const tabs = [
    { id: 'overview', label: 'Vue Globale', icon: BarChart3 },
    { id: 'performance', label: 'Performance Équipe', icon: Users },
    { id: 'forecasts', label: 'Prévisions', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-2">
                <BarChart3 size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Centre d'Analyse</h1>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Activity size={14} /> Tableau de bord intelligent</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showFilters ? 'bg-blue-600 text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Filter size={16} /><span className="text-sm font-medium">Filtres</span>
            </button>
            <button onClick={() => fetchDashboard()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /><span className="text-sm">Actualiser</span>
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
              <Download size={16} /><span className="text-sm font-medium">Export PDF</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>
      </div>

      {showFilters && <div className="px-6 pt-4"><AnalyticsFilters onClose={() => setShowFilters(false)} onApply={(f: any) => { setFilters(f); setShowFilters(false); }} /></div>}

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /><span className="text-gray-400 text-sm">Chargement des analyses...</span></div>
        </div>
      ) : data && (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === 'overview' && (<>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <KpiCard icon={Users} label="Total Leads" value={s.totalLeads} color="blue" />
              <KpiCard icon={Target} label="Total Contacts" value={s.totalContacts} color="indigo" />
              <KpiCard icon={Building2} label="Total Companies" value={s.totalCompanies} color="purple" />
              <KpiCard icon={Briefcase} label="Total Deals" value={s.totalDeals} color="violet" />
              <KpiCard icon={CheckCircle} label="Leads Gagnés" value={s.leadsWon} color="green" sub={`${s.leadsLost} perdus`} />
              <KpiCard icon={TrendingUp} label="Taux Conversion" value={`${s.conversionRate}%`} color="emerald" />
              <KpiCard icon={DollarSign} label="Revenus" value={`${(s.totalRevenue/1000).toFixed(1)}K€`} color="green" />
              <KpiCard icon={Zap} label="Pipeline" value={`${(s.pipelineValue/1000).toFixed(1)}K€`} color="amber" />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartCard title="Évolution Mensuelle" sub="Leads & Revenue par mois" span={2}>
                <AnalyticsCharts type="revenue" data={data.monthlyGrowth.map(m => ({ month: m.month, value: m.revenue }))} />
              </ChartCard>
              <ChartCard title="Funnel Pipeline" sub="Entonnoir de conversion">
                <AnalyticsCharts type="funnel" data={data.pipelineFunnel} />
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Répartition par Statut" sub="Leads par statut">
                <AnalyticsCharts type="statusPie" data={Object.entries(data.statusAnalysis.leads).map(([k, v]) => ({ label: k, value: v }))} />
              </ChartCard>
              <ChartCard title="Secteurs d'Activité" sub="Répartition des entreprises">
                <AnalyticsCharts type="statusPie" data={data.industryAnalysis} />
              </ChartCard>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Top Companies" sub="Par revenus générés">
                <div className="space-y-3 mt-2">
                  {data.topCompanies.slice(0, 6).map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        <div><p className="text-sm font-semibold text-gray-900">{c.name}</p><p className="text-xs text-gray-400">{c.leads} leads · {c.deals} deals</p></div>
                      </div>
                      <span className="text-sm font-bold text-green-600">{c.revenue.toLocaleString()}€</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
              <ChartCard title="Heatmap Activités" sub="Jour × Heure">
                <AnalyticsCharts type="heatmap" data={data.heatmap} />
              </ChartCard>
            </div>

            {/* Croissance Mensuelle */}
            <ChartCard title="Croissance Mensuelle" sub="Leads créés par mois">
              <AnalyticsCharts type="pipeline" data={data.monthlyGrowth.map(m => ({ stage: m.month, count: m.leads, value: m.leads }))} />
            </ChartCard>
          </>)}

          {/* ═══ PERFORMANCE TAB ═══ */}
          {activeTab === 'performance' && (<>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={Users} label="Représentants" value={data.repPerformance.length} color="blue" />
              <KpiCard icon={Activity} label="Total Activités" value={s.totalActivities} color="indigo" />
              <KpiCard icon={CheckCircle} label="Tâches Complétées" value={s.completedTasks} color="green" sub={`/ ${s.totalTasks} total`} />
              <KpiCard icon={Ticket} label="Tickets" value={s.totalTickets} color="orange" />
            </div>

            {/* Rep Ranking */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Classement des Commerciaux</h3>
              <p className="text-sm text-gray-500 mb-6">Trié par revenus générés</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Représentant</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Leads</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Deals Gagnés</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Revenue</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Conversion</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Activités</th>
                    <th className="text-center py-3 px-4 text-gray-500 font-medium">Tâches</th>
                  </tr></thead>
                  <tbody>
                    {data.repPerformance.map((rep: any, i: number) => (
                      <tr key={rep.id} className={`border-b border-gray-50 hover:bg-blue-50/50 transition ${i < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}>
                        <td className="py-3 px-4"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</span></td>
                        <td className="py-3 px-4"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{rep.name.split(' ').map((n: string) => n[0]).join('')}</div><div><p className="font-semibold text-gray-900">{rep.name}</p><p className="text-xs text-gray-400">{rep.email}</p></div></div></td>
                        <td className="py-3 px-4 text-center font-medium">{rep.totalLeads}</td>
                        <td className="py-3 px-4 text-center"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">{rep.dealsWon}</span></td>
                        <td className="py-3 px-4 text-center font-bold text-green-600">{rep.revenue.toLocaleString()}€</td>
                        <td className="py-3 px-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(rep.conversionRate, 100)}%` }} /></div><span className="text-xs font-medium">{rep.conversionRate}%</span></div></td>
                        <td className="py-3 px-4 text-center text-gray-600">{rep.activities}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{rep.completedTasks}/{rep.totalTasks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity per user chart */}
            <ChartCard title="Activités par Utilisateur" sub="Volume d'activités">
              <AnalyticsCharts type="pipeline" data={data.repPerformance.map((r: any) => ({ stage: r.name.split(' ')[0], count: r.activities, value: r.activities }))} />
            </ChartCard>
          </>)}

          {/* ═══ FORECASTS TAB ═══ */}
          {activeTab === 'forecasts' && (<>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard icon={TrendingUp} label="Revenue Projeté (12m)" value={`${(data.forecast.projectedRevenue / 1000).toFixed(1)}K€`} color="green" />
              <KpiCard icon={Briefcase} label="Deals Projetés (12m)" value={data.forecast.projectedDeals} color="blue" />
              <KpiCard icon={DollarSign} label="Deal Moyen" value={`${(data.forecast.avgDealSize / 1000).toFixed(1)}K€`} color="purple" />
              <KpiCard icon={Clock} label="Cycle Moyen" value={data.forecast.avgCycleTime} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Prévision Revenue" sub="Projection basée sur les tendances">
                <AnalyticsCharts type="revenue" data={data.monthlyGrowth.map(m => ({ month: m.month, value: m.revenue }))} />
              </ChartCard>
              <ChartCard title="Analyse des Statuts Deals" sub="Distribution actuelle">
                <AnalyticsCharts type="statusPie" data={Object.entries(data.statusAnalysis.deals).map(([k, v]) => ({ label: k, value: v }))} />
              </ChartCard>
            </div>

            <ChartCard title="Statuts des Tâches" sub="Répartition actuelle">
              <AnalyticsCharts type="statusPie" data={Object.entries(data.statusAnalysis.tasks).map(([k, v]) => ({ label: k, value: v }))} />
            </ChartCard>
          </>)}
        </div>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: any; color: string; sub?: string }) {
  const cm: any = { blue: 'from-blue-500 to-blue-600', indigo: 'from-indigo-500 to-indigo-600', purple: 'from-purple-500 to-purple-600', green: 'from-green-500 to-emerald-600', emerald: 'from-emerald-500 to-teal-600', amber: 'from-amber-500 to-orange-500', orange: 'from-orange-500 to-red-500', violet: 'from-violet-500 to-purple-600' };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${cm[color] || cm.blue} text-white group-hover:scale-110 transition`}><Icon size={18} /></div>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, sub, children, span }: { title: string; sub: string; children: React.ReactNode; span?: number }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 ${span === 2 ? 'lg:col-span-2' : ''}`}>
      <div className="mb-4"><h3 className="text-lg font-semibold text-gray-900">{title}</h3><p className="text-sm text-gray-500">{sub}</p></div>
      {children}
    </div>
  );
}