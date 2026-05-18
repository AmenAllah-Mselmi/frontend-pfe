import { useState, useEffect } from 'react';
import { X, Mail, Phone, Building2, User, Briefcase, Calendar, Edit, Trash2, History, Activity, Users, MessageSquare, Target, BarChart3, TrendingUp } from 'lucide-react';
import AnalyticsCharts from '@/app/admin/analytics/components/AnalyticsCharts';
import EmailModalManager from './EmailModalManager';
import EmailHistoryModalManager from './EmailHistoryModalManager';

export default function ContactDetailsModal({ contact, onClose, onEdit, onDelete, currentUser, onSendEmail, onShowEmailHistory }: any) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const contactDataStr = JSON.stringify({
    notes: contact?.notes,
    status: contact?.status,
    lastContact: contact?.lastContact
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/analytics/contact/${contact.id}`, { credentials: 'include' });
        if (res.ok) setAnalytics(await res.json());
      } catch (e) { console.error(e); }
      setLoadingAnalytics(false);
    };
    fetchAnalytics();
  }, [contact?.id, contactDataStr]);

  const statusColors: any = {
    'Active': 'bg-green-100 text-green-700', 'ACTIVE': 'bg-green-100 text-green-700',
    'Inactive': 'bg-gray-100 text-gray-700', 'INACTIVE': 'bg-gray-100 text-gray-700',
    'Lead': 'bg-blue-100 text-blue-700',
  };

  const engagementColors: any = { High: 'bg-green-100 text-green-700', Medium: 'bg-yellow-100 text-yellow-700', Low: 'bg-red-100 text-red-700' };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {contact.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              <p className="text-sm text-gray-500">{contact.position} • {contact.company?.name || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(contact)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit contact"><Edit size={18} /></button>
            <button onClick={() => onDelete(contact)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete contact"><Trash2 size={18} /></button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <span className={`px-3 py-1 text-sm rounded-full ${statusColors[contact.status] || 'bg-gray-100 text-gray-700'}`}>{contact.status}</span>
            {contact.source && <span className="px-3 py-1 text-sm bg-gray-100 rounded-full">Source: {contact.source}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Informations</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-gray-400" /><span>{contact.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-gray-400" /><span>{contact.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-gray-400" /><span>{contact.company?.name || 'N/A'}</span></div>
                <div className="flex items-center gap-2 text-sm"><Briefcase size={16} className="text-gray-400" /><span>{contact.position}</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Détails</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><User size={16} className="text-gray-400" /><span>Owner: {contact.owner}</span></div>
                <div className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-gray-400" /><span>Dernier contact: {contact.lastContact || contact.updatedAt ? new Date(contact.updatedAt).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="border-t pt-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={16} className="text-blue-600" />
              <h3 className="font-semibold text-gray-700">Analyse d'Engagement</h3>
            </div>
            {loadingAnalytics ? (
              <div className="flex justify-center py-6"><div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : analytics ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MiniStat icon={MessageSquare} label="Interactions" value={analytics.totalInteractions} />
                  <MiniStat icon={Mail} label="Emails" value={analytics.totalEmails} />
                  <MiniStat icon={Users} label="Leads associés" value={analytics.associatedLeads} />
                  <MiniStat icon={Target} label="Tickets" value={analytics.totalTickets} />
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Engagement:</span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${engagementColors[analytics.engagementLevel] || 'bg-gray-100'}`}>{analytics.engagementLevel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Dernier échange:</span>
                    <span className="text-xs font-medium text-gray-700">{analytics.lastExchange ? new Date(analytics.lastExchange).toLocaleDateString('fr-FR') : 'Aucun'}</span>
                  </div>
                  </div>
                {analytics.history && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mt-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Intensité de l'Engagement</h4>
                    <div className="w-full">
                      <AnalyticsCharts type="revenue" data={analytics.history} height={180} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Nombre total d'interactions (emails & activités)</p>
                  </div>
                )}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-4">Aucune donnée</p>}
          </div>

          {contact.notes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{contact.notes}</p>
            </div>
          )}

          <div className="border-t pt-4 flex gap-3">
            <button onClick={() => setShowEmailModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"><Mail size={16} /> Envoyer un Email</button>
            <button onClick={() => setShowHistoryModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"><History size={16} /> Historique</button>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <EmailModalManager onClose={() => setShowEmailModal(false)} onSend={async (data: any) => { if (onSendEmail) await onSendEmail(data); setShowEmailModal(false); }} contact={contact} />
      )}
      {showHistoryModal && (
        <EmailHistoryModalManager onClose={() => setShowHistoryModal(false)} contact={contact} currentUser={currentUser} />
      )}
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: any) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
      <div className="p-1.5 bg-white rounded-lg shadow-sm"><Icon size={14} className="text-gray-400" /></div>
      <div><p className="text-sm font-bold text-gray-900">{value}</p><p className="text-[10px] text-gray-500">{label}</p></div>
    </div>
  );
}