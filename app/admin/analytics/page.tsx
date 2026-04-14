'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Clock,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import AnalyticsStats from './components/AnalyticsStats';
import AnalyticsCharts from './components/AnalyticsCharts';
import AnalyticsFilters from './components/AnalyticsFilters';
import DateRangePicker from './components/DateRangePicker';
import { useLeadStore, Lead } from '@/lib/leadStore';
import { useUserStore } from '@/lib/userStore';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChart, setSelectedChart] = useState('revenue');

  const { leads, loadLeads } = useLeadStore();
  const { users, loadUsers } = useUserStore();

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, [loadLeads, loadUsers]);

  // Normalize leads into a typed array (API may return a wrapper)
  const leadList: Lead[] = Array.isArray(leads)
    ? leads
    : Array.isArray((leads as unknown as { leads?: Lead[] })?.leads)
    ? (leads as unknown as { leads: Lead[] }).leads
    : [];

  // Dynamically compute stats based on leads
  const statsData = useMemo(() => {
    const totalDeals = leadList.length;
    const qualifiedLeads = leadList.filter(l => l.status === 'QUALIFIED');
    const lostLeads = leadList.filter(l => l.status === 'LOST');

    const totalRevenue = qualifiedLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
    const conversion = totalDeals > 0 ? (qualifiedLeads.length / totalDeals) * 100 : 0;
    const avgDeal = qualifiedLeads.length > 0 ? totalRevenue / qualifiedLeads.length : 0;
    const closedCount = qualifiedLeads.length + lostLeads.length;
    const winRate = closedCount > 0 ? (qualifiedLeads.length / closedCount) * 100 : 0;

    return {
      revenue: { value: `${(totalRevenue / 1000000).toFixed(2)}M€`, change: '+0.0%', trend: 'up' },
      deals: { value: totalDeals.toString(), change: '+0', trend: 'up' },
      conversion: { value: `${conversion.toFixed(1)}%`, change: '+0.0%', trend: 'up' },
      avgDeal: { value: `${(avgDeal / 1000).toFixed(1)}K€`, change: '+0.0%', trend: 'up' },
      winRate: { value: `${winRate.toFixed(1)}%`, change: '+0.0%', trend: 'up' },
      velocity: { value: 'N/A', change: '0d', trend: 'up' } // Velocity logic requires extensive historic date tracking
    };
  }, [leadList]);

  // Dynamically map charts based on leads
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

    // Group Revenue by month
    const revenueMap: { [key: string]: number } = {};
    const dealsMap: { [key: string]: { won: number, lost: number, proposal: number } } = {};

    monthNames.forEach(month => {
      revenueMap[month] = 0;
      dealsMap[month] = { won: 0, lost: 0, proposal: 0 };
    });

    leadList.forEach(l => {
      const monthStr = l.createdAt ? monthNames[new Date(l.createdAt).getMonth()] : "Jan";
      if (l.status === 'QUALIFIED') {
        revenueMap[monthStr] += (l.dealValue || 0);
        dealsMap[monthStr].won += 1;
      } else if (l.status === 'LOST') {
        dealsMap[monthStr].lost += 1;
      } else if (l.status === 'CONTACTED') {
        dealsMap[monthStr].proposal += 1;
      }
    });

    const revenue = monthNames.map(month => ({ month, value: revenueMap[month] }));
    const deals = monthNames.map(month => ({ month, ...dealsMap[month] }));

    // Group Pipeline
    const pipelineGroups = [
      { status: 'NEW', stage: 'Nouveau' },
      { status: 'CONTACTED', stage: 'Contacté' },
      { status: 'QUALIFIED', stage: 'Qualifié' },
      { status: 'LOST', stage: 'Perdu' }
    ];

    const pipeline = pipelineGroups.map(group => {
      const gLeads = leadList.filter(l => l.status === group.status);
      return {
        stage: group.stage,
        count: gLeads.length,
        value: gLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0)
      };
    });

    const teamMap: { [userId: number]: { name: string, deals: number, wonDeals: number, revenue: number } } = {};
    (users || []).forEach((u: any) => {
      teamMap[u.id] = { name: u.name, deals: 0, wonDeals: 0, revenue: 0 };
    });

    leadList.forEach(l => {
      if (l.userId && teamMap[l.userId]) {
        teamMap[l.userId].deals += 1;
        if (l.status === 'QUALIFIED') {
          teamMap[l.userId].wonDeals += 1;
          teamMap[l.userId].revenue += (l.dealValue || 0);
        }
      }
    });

    const team = Object.values(teamMap)
      .filter((t: any) => t.deals > 0)
      .map((t: any) => ({
        name: t.name,
        deals: t.deals,
        revenue: t.revenue,
        conversion: Math.round((t.wonDeals / t.deals) * 100)
      }))
      .sort((a: any, b: any) => b.revenue - a.revenue);

    return {
      revenue,
      deals,
      pipeline,
      team
    };
  }, [leads, users]);

  const handleExportPDF = async () => {
    if (leadList.length === 0) return toast.error('No analytics data to generate report');

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const PAGE_W = 210;
    const MARGIN = 14;
    const COL_W = PAGE_W - MARGIN * 2;
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    let y = 0;

    const addPage = () => { doc.addPage(); y = 20; };
    const checkY = (needed: number) => { if (y + needed > 280) addPage(); };

    // ── Cover / Header ───────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, PAGE_W, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Analytics Report', MARGIN, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${today}`, MARGIN, 26);
    doc.text(`Total Leads Analyzed: ${leadList.length}`, MARGIN, 33);
    doc.setTextColor(30, 30, 30);
    y = 52;

    // ── Section Helper ───────────────────────────────────────────────────────
    const sectionTitle = (title: string) => {
      checkY(14);
      doc.setFillColor(239, 246, 255);
      doc.rect(MARGIN, y, COL_W, 9, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(title, MARGIN + 3, y + 6.5);
      doc.setTextColor(30, 30, 30);
      y += 13;
    };

    const tableRow = (cols: string[], widths: number[], isHeader = false, shade = false) => {
      checkY(8);
      if (shade) { doc.setFillColor(248, 250, 252); doc.rect(MARGIN, y, COL_W, 7.5, 'F'); }
      doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
      doc.setFontSize(isHeader ? 9 : 8.5);
      doc.setTextColor(isHeader ? 37 : 50, isHeader ? 99 : 50, isHeader ? 235 : 50);
      let x = MARGIN + 2;
      cols.forEach((col, i) => { doc.text(String(col), x, y + 5.5); x += widths[i]; });
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y + 7.5, MARGIN + COL_W, y + 7.5);
      doc.setTextColor(30, 30, 30);
      y += 7.5;
    };

    // ── 1. KPI Summary ──────────────────────────────────────────────────────
    sectionTitle('Executive Summary — Key Performance Indicators');
    const kpiCols = [80, 50, 52];
    tableRow(['Metric', 'Value', 'Trend'], kpiCols, true);
    const kpis = [
      ['Total Leads in Pipeline', statsData.deals.value, statsData.deals.trend === 'up' ? '▲' : '▼'],
      ['Total Revenue (Qualified)', statsData.revenue.value, '▲'],
      ['Lead Conversion Rate', statsData.conversion.value, statsData.conversion.trend === 'up' ? '▲' : '▼'],
      ['Average Deal Size', statsData.avgDeal.value, '▲'],
      ['Win Rate (Qualified / Closed)', statsData.winRate.value, statsData.winRate.trend === 'up' ? '▲' : '▼'],
    ];
    kpis.forEach((row, i) => tableRow(row, kpiCols, false, i % 2 === 0));
    y += 6;

    // ── 2. Pipeline Breakdown ────────────────────────────────────────────────
    sectionTitle('Pipeline Breakdown by Stage');
    const pipeCols = [60, 30, 52, 40];
    tableRow(['Stage', 'Count', 'Total Value (€)', '% of Leads'], pipeCols, true);
    const totalLeads = leadList.length || 1;
    chartData.pipeline.forEach((p: any, i: number) => {
      const pct = ((p.count / totalLeads) * 100).toFixed(1) + '%';
      tableRow([p.stage, String(p.count), p.value.toLocaleString(), pct], pipeCols, false, i % 2 === 0);
    });
    y += 6;

    // ── 3. Monthly Revenue ───────────────────────────────────────────────────
    sectionTitle('Monthly Revenue Overview');
    const revCols = [50, 50, 82];
    tableRow(['Month', 'Revenue (€)', 'Bar'], revCols, true);
    const maxRev = Math.max(...chartData.revenue.map((r: any) => r.value), 1);
    chartData.revenue.forEach((r: any, i: number) => {
      checkY(8);
      if (i % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(MARGIN, y, COL_W, 7.5, 'F'); }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(50, 50, 50);
      doc.text(r.month, MARGIN + 2, y + 5.5);
      doc.text(r.value.toLocaleString(), MARGIN + 52, y + 5.5);
      // mini bar
      const barW = (r.value / maxRev) * 75;
      if (barW > 0) { doc.setFillColor(37, 99, 235); doc.rect(MARGIN + 102, y + 2, barW, 4, 'F'); }
      doc.setDrawColor(226, 232, 240);
      doc.line(MARGIN, y + 7.5, MARGIN + COL_W, y + 7.5);
      y += 7.5;
    });
    y += 6;

    // ── 4. Team Performance ──────────────────────────────────────────────────
    if (chartData.team.length > 0) {
      sectionTitle('Team Performance');
      const teamCols = [60, 28, 50, 44];
      tableRow(['Representative', 'Deals', 'Revenue (€)', 'Conversion'], teamCols, true);
      chartData.team.forEach((m: any, i: number) =>
        tableRow([m.name, String(m.deals), m.revenue.toLocaleString(), `${m.conversion}%`], teamCols, false, i % 2 === 0)
      );
      y += 6;
    }

    // ── 5. Lead Details ──────────────────────────────────────────────────────
    sectionTitle('Lead Details');
    const ldCols = [48, 44, 28, 26, 36];
    tableRow(['Name', 'Email', 'Status', 'Value (€)', 'Created'], ldCols, true);
    leadList.forEach((lead, i) => {
      const name = (lead.name || '').slice(0, 22);
      const email = (lead.email || '').slice(0, 22);
      const status = lead.status || '';
      const value = (lead.dealValue ?? 0).toLocaleString();
      const created = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : '';
      tableRow([name, email, status, value, created], ldCols, false, i % 2 === 0);
    });

    // ── Footer on each page ──────────────────────────────────────────────────
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFontSize(8); doc.setTextColor(150, 150, 150);
      doc.text(`CRM Analytics Report • ${today} • Page ${p} of ${pageCount}`, MARGIN, 290);
    }

    doc.save(`analytics_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF report downloaded!');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-lg blur opacity-20" />
              <div className="relative bg-blue-600 rounded-lg p-2">
                <BarChart3 size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Activity size={14} /> Performance metrics and insights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border transition-all ${showFilters ? 'bg-blue-600 text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Filter size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>

            <button 
              onClick={handleExportPDF}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="px-6 pt-4">
          <AnalyticsFilters onClose={() => setShowFilters(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stats Cards */}
        <AnalyticsStats stats={statsData} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Monthly revenue trends</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChart('revenue')}
                  className={`p-2 rounded-lg ${selectedChart === 'revenue' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  <LineChart size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <AnalyticsCharts type="revenue" data={chartData.revenue} />
          </div>

          {/* Pipeline Distribution */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pipeline Distribution</h3>
                <p className="text-sm text-gray-500">Deals by stage</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <PieChart size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <AnalyticsCharts type="pipeline" data={chartData.pipeline} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deal Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Deal Activity</h3>
                <p className="text-sm text-gray-500">Won vs Lost vs Proposal</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal size={18} className="text-gray-400" />
              </button>
            </div>
            <AnalyticsCharts type="deals" data={chartData.deals} />
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
                <p className="text-sm text-gray-500">Individual contributions</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Users size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              {chartData.team.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {member.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.deals} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{member.revenue.toLocaleString()}€</p>
                    <p className="text-xs text-green-600">{member.conversion}% conversion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}