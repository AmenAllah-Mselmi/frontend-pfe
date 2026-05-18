'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  X, FileText, CheckSquare, Plus, Calendar, User,
  Building2, DollarSign, Trash2, CheckCircle,
  Mail, Phone, Edit, History,
  Brain, Sparkles, Flame, Thermometer, Snowflake, ChevronRight,
  AlertCircle, Clock, BarChart3, Ticket, Activity, TrendingUp
} from 'lucide-react';
import AnalyticsCharts from '@/app/admin/analytics/components/AnalyticsCharts';
import { useForm } from '@/lib/hooks/useForm';
import { validators } from '@/lib/utils/validation';
import FormField from '@/components/Form/FormField';
import AiEmailModal from './AiEmailModal';

export default function LeadDetailsModal({ lead, onClose, onAddNote, onDeleteNote, onUpdateNote, onAddTask, onUpdateTask, onDeleteTask, onConvertToContact, onConvertToDeal, onShowEmailHistory, onSendEmail, users, currentUser }: any) {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  const [scoreData, setScoreData] = useState<any>(lead.leadScore || null);
  const [isScoring, setIsScoring] = useState(false);
  const [leadAnalytics, setLeadAnalytics] = useState<any>(null);

  // Form for adding a new note
  const noteForm = useForm({
    initialValues: { content: '' },
    validationSchema: { content: [validators.required, validators.minLength(3)] },
    onSubmit: (data) => {
      onAddNote(lead.id, data.content);
      noteForm.resetForm();
    }
  });

  // Form for adding a new task
  const taskForm = useForm({
    initialValues: { title: '', dueDate: '', priority: 'medium', userId: '' },
    validationSchema: { 
      title: [validators.required, validators.minLength(3)],
      dueDate: [validators.required],
      userId: [validators.required]
    },
    onSubmit: (data) => {
      onAddTask(lead.id, data);
      taskForm.resetForm();
      setShowTaskForm(false);
    }
  });

  useEffect(() => {
    if (currentUser && !taskForm.values.userId) {
      taskForm.setValues((prev: any) => ({ ...prev, userId: currentUser }));
    }
  }, [currentUser, taskForm]);

  useEffect(() => {
    const fetchScore = async () => {
      setIsScoring(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/lead-scoring/${lead.id}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setScoreData(data);
        }
      } catch (err) {
        console.error('Failed to fetch lead score', err);
      }
      setIsScoring(false);
    };
    if (lead?.id && !lead.leadScore) {
      fetchScore();
    } else {
      setScoreData(lead.leadScore);
    }
  }, [lead]);

  const leadDataStr = JSON.stringify({
    notes: lead?.notes?.length,
    tasks: lead?.tasks?.map((t:any) => t.status),
    emails: lead?.emails?.length
  });

  useEffect(() => {
    const fetchLeadAnalytics = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/analytics/lead/${lead.id}`, { credentials: 'include' });
        if (res.ok) setLeadAnalytics(await res.json());
      } catch (e) { console.error(e); }
    };
    if (lead?.id) fetchLeadAnalytics();
  }, [lead?.id, leadDataStr]);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPipelineSelect, setShowPipelineSelect] = useState(false);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | null>(null);
  const [showAiEmailModal, setShowAiEmailModal] = useState(false);

  const handleConvertToDealClick = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${base}/pipelines`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPipelines(data);
        if (data.length > 0) setSelectedPipelineId(data[0].id);
        setShowPipelineSelect(true);
      } else {
        onConvertToDeal && onConvertToDeal(lead);
      }
    } catch {
      onConvertToDeal && onConvertToDeal(lead);
    }
  };

  const statusColors: any = {
    'NEW': 'bg-blue-100 text-blue-700',
    'CONTACTED': 'bg-yellow-100 text-yellow-700',
    'QUALIFIED': 'bg-emerald-100 text-emerald-700',
    'LOST': 'bg-red-100 text-red-700'
  };

  const priorityColors: any = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {lead.name ? lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold">{lead.name}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Building2 size={14} />{lead.companyId ? `Company ID: ${lead.companyId}` : 'No Company'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showPipelineSelect ? (
              <div className="flex items-center gap-2 mr-2 border border-emerald-200 p-1.5 rounded-lg bg-emerald-50">
                <select 
                  value={selectedPipelineId || ''} 
                  onChange={(e) => setSelectedPipelineId(Number(e.target.value))}
                  className="border rounded px-2 py-1 text-sm bg-white"
                >
                  {pipelines.length === 0 && <option value="">No Pipelines found</option>}
                  {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button 
                  onClick={() => {
                    onConvertToDeal && onConvertToDeal(lead, selectedPipelineId);
                    setShowPipelineSelect(false);
                  }} 
                  className="px-3 py-1 bg-emerald-500 text-white rounded text-xs font-bold"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setShowPipelineSelect(false)} 
                  className="px-2 py-1 text-gray-500 hover:bg-gray-200 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => onConvertToContact && onConvertToContact(lead)} className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition whitespace-nowrap">
                  Convert to Contact
                </button>
                <button onClick={handleConvertToDealClick} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition whitespace-nowrap">
                  Convert to Deal
                </button>
                <button onClick={() => setShowAiEmailModal(true)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={14} /> Generate AI Email
                </button>
              </>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row min-h-full">
            {/* Left Panel - Lead Info */}
            <div className="w-full lg:w-[340px] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r bg-gray-50/50">
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={16} className="text-blue-500" /> Lead Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <User size={14} className="text-gray-400" />
                      </div>
                      <span>{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Mail size={14} className="text-gray-400" />
                      </div>
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Phone size={14} className="text-gray-400" />
                      </div>
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <Building2 size={14} className="text-gray-400" />
                      </div>
                      <span>{lead.companyId ? `Company ID: ${lead.companyId}` : 'No Company'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-500" /> Deal Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Status</span>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Deal Value</span>
                      <span className="text-xl font-black text-blue-600">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Probability</span>
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${lead.probability || 0}%` }}></div>
                         </div>
                         <span className="font-bold text-gray-700">{lead.probability || 0}%</span>
                      </div>
                    </div>
                    {/* Time in Pipeline & Analytics */}
                    <div className="border-t border-gray-100 pt-3 mt-2 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium flex items-center gap-1"><Clock size={12} /> Temps dans le pipeline</span>
                        <span className="font-bold text-gray-700">{leadAnalytics?.timeInPipeline ?? (lead.createdAt ? Math.floor((new Date().getTime() - new Date(lead.createdAt).getTime()) / (1000*60*60*24)) : 0)} jours</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium flex items-center gap-1"><Activity size={12} /> Dernière activité</span>
                        <span className="font-bold text-gray-700 text-xs">{leadAnalytics?.lastActivity ? new Date(leadAnalytics.lastActivity).toLocaleDateString('fr-FR') : (lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('fr-FR') : 'N/A')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Analytics Card */}
                {leadAnalytics && (
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-blue-500" /> Analyse de Progression</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 bg-blue-50 rounded-xl text-center"><p className="text-lg font-bold text-blue-700">{leadAnalytics.notesCount}</p><p className="text-[9px] text-blue-500 font-medium">Notes</p></div>
                      <div className="p-2.5 bg-green-50 rounded-xl text-center"><p className="text-lg font-bold text-green-700">{leadAnalytics.completedTasks}/{leadAnalytics.tasksCount}</p><p className="text-[9px] text-green-500 font-medium">Tâches</p></div>
                      <div className="p-2.5 bg-orange-50 rounded-xl text-center"><p className="text-lg font-bold text-orange-700">{leadAnalytics.ticketsCount}</p><p className="text-[9px] text-orange-500 font-medium">Tickets</p></div>
                      <div className="p-2.5 bg-purple-50 rounded-xl text-center"><p className="text-lg font-bold text-purple-700">{leadAnalytics.emailsCount}</p><p className="text-[9px] text-purple-500 font-medium">Emails</p></div>
                    </div>
                    {/* Progression bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Score AI</span><span>{leadAnalytics.score}/100</span></div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${Math.min(leadAnalytics.score, 100)}%` }} /></div>
                    </div>
                  </div>
                )}

                {/* AI Insights Card */}
                {isScoring ? (
                  <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden group border border-indigo-500/30 flex items-center justify-center min-h-[250px]">
                     <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-3 shadow-[0_0_15px_rgba(129,140,248,0.5)]"></div>
                        <span className="text-indigo-200 text-sm font-semibold animate-pulse tracking-wide">AI ANALYSIS IN PROGRESS...</span>
                     </div>
                  </div>
                ) : scoreData ? (
                  <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden group border border-indigo-500/30">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                      <Brain size={140} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={20} className="text-yellow-400 animate-pulse" />
                        <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">AI Lead Intelligence</h3>
                      </div>
                      
                      <div className="flex items-end gap-3 mb-5">
                        <div>
                          <span className="text-[10px] text-indigo-200 font-bold tracking-widest uppercase">Win Probability</span>
                          <div className="text-4xl font-extrabold flex items-baseline gap-1 mt-1 drop-shadow-md">
                            {scoreData.probability ? Math.round(scoreData.probability * 100) : 0}<span className="text-xl text-indigo-300">%</span>
                          </div>
                        </div>
                        <div className="mb-1.5 ml-auto">
                          {scoreData.temperature === 'Hot' ? (
                            <span className="px-3 py-1.5 bg-red-500/30 text-red-200 border border-red-500/40 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.4)] tracking-wider"><Flame size={12}/> HOT LEAD</span>
                          ) : scoreData.temperature === 'Warm' ? (
                            <span className="px-3 py-1.5 bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wider"><Thermometer size={12}/> WARM LEAD</span>
                          ) : (
                            <span className="px-3 py-1.5 bg-blue-500/30 text-blue-200 border border-blue-500/40 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(59,130,246,0.4)] tracking-wider"><Snowflake size={12}/> COLD LEAD</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <span className="text-[10px] uppercase tracking-widest text-indigo-300/80 font-bold">Strategic Insights</span>
                        <ul className="space-y-2">
                          {scoreData.reasons && (typeof scoreData.reasons === 'string' ? JSON.parse(scoreData.reasons) : scoreData.reasons).map((reason: string, idx: number) => {
                            const isAction = reason.startsWith('Action:');
                            if(isAction) return null;
                            return (
                              <li key={idx} className="flex items-start gap-2 text-[11px] text-indigo-50 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-sm hover:bg-white/10 transition-colors">
                                <ChevronRight size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed font-medium">{reason}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 flex flex-col gap-2 backdrop-blur-xl group/action">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-black">AI Recommended Play</span>
                        </div>
                        <span className="font-extrabold text-white text-xs leading-tight">
                          {scoreData.reasons && (typeof scoreData.reasons === 'string' ? JSON.parse(scoreData.reasons) : scoreData.reasons).find((r: string) => r.startsWith('Action:'))?.replace('Action: ', '') || 'Follow up to evaluate needs'}
                        </span>
                        <button 
                          onClick={() => {
                            const actionReason = scoreData.reasons && (typeof scoreData.reasons === 'string' ? JSON.parse(scoreData.reasons) : scoreData.reasons).find((r: string) => r.startsWith('Action:'))?.replace('Action: ', '');
                            if (actionReason?.includes('Call')) toast.success('Initiating priority dialer...');
                            else if (actionReason?.includes('email')) onSendEmail && onSendEmail(lead);
                            else toast.success('Opening strategic scheduler...');
                          }}
                          className="mt-2 w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] uppercase tracking-widest font-black rounded-lg transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/50 group-hover/action:scale-[1.02]">
                          Execute AI Recommendation
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-medium text-gray-400 py-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">AI Intelligence engine is standby.</div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => onSendEmail && onSendEmail(lead)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                  >
                    <Mail size={14} /> Send Email
                  </button>
                  <button
                    onClick={() => onShowEmailHistory && onShowEmailHistory(lead)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition shadow-sm"
                  >
                    <History size={14} /> History
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Notes & Tasks */}
            <div className="flex-1 p-4 sm:p-8 bg-white overflow-y-auto">
              {/* Lead History Charts (Own Curves) */}
              {leadAnalytics?.history && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Intensité de l'Engagement</h4>
                  <div className="w-full">
                    <AnalyticsCharts type="revenue" data={leadAnalytics.history.map((h: any) => ({ month: h.month, value: h.activities + h.emails }))} height={200} />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 mb-8 border-b border-gray-50 pb-4">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-2 pb-4 px-1 text-sm font-bold transition relative ${activeTab === 'notes' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <FileText size={16} /> Notes 
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] ml-1">{lead.notes?.length || 0}</span>
                  {activeTab === 'notes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in slide-in-from-left-2 grow"></div>}
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`flex items-center gap-2 pb-4 px-1 text-sm font-bold transition relative ${activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <CheckSquare size={16} /> Tasks
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-[10px] ml-1">{lead.tasks?.length || 0}</span>
                  {activeTab === 'tasks' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in slide-in-from-left-2 grow"></div>}
                </button>
              </div>

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <form onSubmit={noteForm.handleSubmit} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80 shadow-sm transition-all focus-within:shadow-md focus-within:border-blue-100">
                    <FormField
                      label="New Strategic Note"
                      name="content"
                      error={noteForm.errors.content}
                      touched={noteForm.touched.content}
                    >
                      <textarea
                        value={noteForm.values.content}
                        onChange={(e) => noteForm.handleChange('content', e.target.value)}
                        onBlur={() => noteForm.handleBlur('content')}
                        placeholder="Log meeting takeaways, strategic updates, or next steps..."
                        rows={3}
                        className="w-full bg-white transition-all resize-none shadow-sm"
                      />
                    </FormField>
                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        disabled={noteForm.isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
                      >
                        <Plus size={14} /> Add Note
                      </button>
                    </div>
                  </form>
                  
                  <div className="space-y-4">
                    {lead.notes?.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <FileText size={40} className="mx-auto opacity-10 mb-3" />
                        <p className="text-sm">No notes logged for this lead yet.</p>
                      </div>
                    )}
                    {lead.notes?.map((note: any) => {
                      const authorName = note.user?.name || `User ${note.userId}`;
                      const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Just now';
                      const isEditing = editingNoteId === note.id;
                      return (
                        <div key={note.id} className="bg-white border border-gray-100 rounded-2xl p-5 group hover:shadow-md transition-shadow relative">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-600 text-[10px] font-bold shadow-inner">
                                {authorName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-800 leading-none">{authorName}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{createdDate}</p>
                              </div>
                            </div>
                            {!isEditing && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingNoteId(note.id);
                                    setEditNoteContent(note.content);
                                  }}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                  title="Edit note"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => onDeleteNote(lead.id, note.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                  title="Delete note"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="mt-2 animate-in fade-in duration-200">
                              <textarea
                                value={editNoteContent}
                                onChange={(e) => setEditNoteContent(e.target.value)}
                                className="w-full p-3 border border-blue-200 rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none shadow-inner bg-blue-50/10"
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingNoteId(null)}
                                  className="px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    if (editNoteContent.trim() && onUpdateNote) {
                                      onUpdateNote(lead.id, note.id, editNoteContent);
                                      setEditingNoteId(null);
                                    }
                                  }}
                                  className="px-4 py-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 transition-all"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  {!showTaskForm ? (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="w-full p-5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-3 font-bold text-sm group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Plus size={18} />
                      </div> 
                      Initialize New Action Item
                    </button>
                  ) : (
                    <form onSubmit={taskForm.handleSubmit} className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 shadow-lg animate-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <CheckSquare size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-800">Add Strategic Task</h4>
                            <p className="text-xs text-gray-500">Assign responsibilities and deadlines.</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                        <FormField
                          label="Task Definition"
                          name="title"
                          error={taskForm.errors.title}
                          touched={taskForm.touched.title}
                          required
                        >
                          <input
                            type="text"
                            value={taskForm.values.title}
                            onChange={(e) => taskForm.handleChange('title', e.target.value)}
                            onBlur={() => taskForm.handleBlur('title')}
                            placeholder="e.g. Schedule value proposition review meeting"
                            className="w-full bg-white shadow-sm"
                          />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <FormField
                            label="Target Date"
                            name="dueDate"
                            error={taskForm.errors.dueDate}
                            touched={taskForm.touched.dueDate}
                            icon={Calendar}
                            required
                          >
                            <input
                              type="date"
                              value={taskForm.values.dueDate}
                              onChange={(e) => taskForm.handleChange('dueDate', e.target.value)}
                              onBlur={() => taskForm.handleBlur('dueDate')}
                              className="w-full bg-white shadow-sm pr-2"
                            />
                          </FormField>
                          <FormField
                            label="Priority"
                            name="priority"
                            icon={AlertCircle}
                          >
                            <select
                              value={taskForm.values.priority}
                              onChange={(e) => taskForm.handleChange('priority', e.target.value)}
                              className="w-full bg-white shadow-sm appearance-none"
                            >
                              <option value="high">Critical</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low Priority</option>
                            </select>
                          </FormField>
                          <FormField
                            label="Assignee"
                            name="userId"
                            icon={User}
                          >
                            <select
                              value={taskForm.values.userId}
                              onChange={(e) => taskForm.handleChange('userId', e.target.value)}
                              className="w-full bg-white shadow-sm appearance-none"
                            >
                              <option value="all">Everyone</option>
                              {users?.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          </FormField>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setShowTaskForm(false)}
                            className="px-6 py-2.5 text-gray-500 hover:bg-white hover:shadow-sm rounded-xl text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={taskForm.isSubmitting}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                          >
                            {taskForm.isSubmitting ? 'Creating...' : 'Create Action Item'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {lead.tasks?.length === 0 && !showTaskForm && (
                        <div className="text-center py-12 text-gray-400">
                          <CheckCircle size={40} className="mx-auto opacity-10 mb-3" />
                          <p className="text-sm">No pending actions for this lead.</p>
                        </div>
                      )}
                    {lead.tasks?.map((task: any) => {
                      const isCompleted = task.status === 'COMPLETED';
                      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                      const dueDateStr = dueDate ? dueDate.toLocaleDateString() : 'No date';
                      const isOverdue = dueDate && !isCompleted && dueDate < new Date(new Date().setHours(0,0,0,0));
                      const priority = task.priority || 'medium';
                      const isEditingTask = editingTaskId === task.id;
                      const assigneeName = task.user?.name || `User ${task.userId}`;

                      return (
                        <div key={task.id} className={`bg-white border rounded-2xl p-5 group hover:shadow-lg transition-all relative ${isCompleted ? 'bg-gray-50/50 border-gray-100' : 'border-gray-100 shadow-sm'}`}>
                          {isEditingTask ? (
                            <div className="mt-2 animate-in slide-in-from-top-2 duration-300">
                              <input
                                type="text"
                                value={editTaskData.title}
                                onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                                className="w-full p-3 border border-blue-200 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                              />
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                  type="date"
                                  value={editTaskData.dueDate}
                                  onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value })}
                                  className="p-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
                                />
                                <select
                                  value={editTaskData.priority}
                                  onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                                  className="p-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
                                >
                                  <option value="high">Critical</option>
                                  <option value="medium">Medium</option>
                                  <option value="low">Low</option>
                                </select>
                              </div>
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingTaskId(null)}
                                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    if (editTaskData.title.trim() && onUpdateTask) {
                                      onUpdateTask(lead.id, task.id, editTaskData);
                                      setEditingTaskId(null);
                                    }
                                  }}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                                >
                                  Save Shifts
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <button
                                  onClick={() => onUpdateTask(lead.id, task.id, {
                                    status: isCompleted ? 'PENDING' : 'COMPLETED'
                                  })}
                                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isCompleted
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
                                    }`}
                                >
                                  {isCompleted && <CheckCircle size={14} />}
                                </button>
                                <div className="flex-1">
                                  <p className={`font-bold text-sm ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-4 mt-3">
                                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                                      <Clock size={12} className={isOverdue ? 'animate-pulse' : ''} /> {isOverdue && 'OVERDUE: '}{dueDateStr}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                      <User size={12} className="text-blue-500" />
                                      <span>Assigned to: <span className="text-gray-900 font-bold">{assigneeName}</span></span>
                                    </div>
                                    <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full ${priorityColors[priority]}`}>
                                      {priority === 'high' ? 'Priority Case' : priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingTaskId(task.id);
                                    setEditTaskData({
                                      title: task.title,
                                      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                      priority: task.priority || 'medium'
                                    });
                                  }}
                                  className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                  title="Adjust task"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => onDeleteTask(lead.id, task.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                  title="Delete task"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showAiEmailModal && (
        <AiEmailModal
          leadId={lead.id}
          onClose={() => setShowAiEmailModal(false)}
        />
      )}
    </div>
  );
}