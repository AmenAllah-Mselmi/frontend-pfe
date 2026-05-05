'use client';
import { useState, useEffect } from 'react';
import { X, Building2, Users, Mail, Phone, MapPin, Edit, Trash2, DollarSign, TrendingUp, Briefcase, Target, Activity, BarChart3, LineChart } from 'lucide-react';
import { Company } from '@/lib/companyStore';
import AnalyticsCharts from '@/app/admin/analytics/components/AnalyticsCharts';

interface CompanyDetailsModalProps {
  company: Company;
  onClose: () => void;
  onEdit: (company: any) => void;
  onDelete: (company: any) => void;
}

export default function CompanyDetailsModal({ company, onClose, onEdit, onDelete }: CompanyDetailsModalProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/analytics/company/${company.id}`, { credentials: 'include' });
        if (res.ok) setAnalytics(await res.json());
      } catch (e) { console.error(e); }
      setLoadingAnalytics(false);
    };
    fetchAnalytics();
  }, [company.id]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{company.name.charAt(0)}</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                <p className="text-sm text-gray-500">{company.companyIndustry} • {company.companySize}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onEdit(company)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={18} /></button>
              <button onClick={() => onDelete(company)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Informations de Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm"><MapPin size={16} className="text-gray-400" /><span className="text-gray-600">{company.location}</span></div>
              <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400" /><span className="text-gray-600">{company.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gray-400" /><span className="text-gray-600">{company.phone}</span></div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Analyse Commerciale</h3>
            </div>
            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : analytics ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <AnalyticsStat icon={Users} label="Leads liés" value={analytics.totalLeads} color="blue" />
                <AnalyticsStat icon={Target} label="Contacts liés" value={analytics.totalContacts} color="indigo" />
                <AnalyticsStat icon={Briefcase} label="Deals liés" value={analytics.totalDeals} color="purple" />
                <AnalyticsStat icon={DollarSign} label="Revenue" value={`${(analytics.revenue / 1000).toFixed(1)}K€`} color="green" />
                <AnalyticsStat icon={TrendingUp} label="Pipeline" value={`${(analytics.pipelineValue / 1000).toFixed(1)}K€`} color="amber" />
                <AnalyticsStat icon={TrendingUp} label="Conversion" value={`${analytics.conversionRate}%`} color="emerald" />
                <AnalyticsStat icon={Activity} label="Deals Gagnés" value={analytics.dealsWon} color="green" />
                <AnalyticsStat icon={Activity} label="Deals Perdus" value={analytics.dealsLost} color="red" />
                {analytics.history && (
                  <div className="col-span-2 sm:col-span-4 mt-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-500" /> Évolution du Revenu Mensuel</h4>
                    <div className="w-full">
                      <AnalyticsCharts type="revenue" data={analytics.history.map((h: any) => ({ ...h, value: h.revenue }))} height={200} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Aucune donnée analytique disponible</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button onClick={() => onEdit(company)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Modifier</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Ajouter un Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsStat({ icon: Icon, label, value, color }: any) {
  const cm: any = { blue: 'bg-blue-50 text-blue-600', indigo: 'bg-indigo-50 text-indigo-600', purple: 'bg-purple-50 text-purple-600', green: 'bg-green-50 text-green-600', amber: 'bg-amber-50 text-amber-600', emerald: 'bg-emerald-50 text-emerald-600', red: 'bg-red-50 text-red-600' };
  return (
    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
      <div className={`p-1.5 rounded-lg ${cm[color] || cm.blue}`}><Icon size={14} /></div>
      <div><p className="text-sm font-bold text-gray-900">{value}</p><p className="text-[10px] text-gray-500">{label}</p></div>
    </div>
  );
}