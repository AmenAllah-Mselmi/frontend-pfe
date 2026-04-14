'use client';
import { useState, useEffect } from 'react';
import {
  X, FileText, CheckSquare, Plus, Calendar, User,
  Building2, DollarSign, Trash2, CheckCircle,
  Mail, Phone, Edit, History
} from 'lucide-react';

export default function LeadDetailsModal({ lead, onClose, onAddNote, onDeleteNote, onUpdateNote, onAddTask, onUpdateTask, onDeleteTask, onConvertToContact, onConvertToDeal, onShowEmailHistory, onSendEmail, users }: any) {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium', userId: 'all' });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPipelineSelect, setShowPipelineSelect] = useState(false);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | null>(null);

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

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(lead.id, newNote);
      setNewNote('');
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask(lead.id, newTask);
      setNewTask({ title: '', dueDate: '', priority: 'medium', userId: 'all' });
      setShowTaskForm(false);
    }
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
              </>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row min-h-full">
            {/* Left Panel - Lead Info */}
            <div className="w-full lg:w-[320px] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r bg-gray-50/50">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Lead Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={16} className="text-gray-400" />
                    <span>{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{lead.companyId ? `Company ID: ${lead.companyId}` : 'No Company'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl">
                <h3 className="font-semibold mb-3">Deal Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Deal Value</span>
                    <span className="text-lg font-bold text-blue-600">{lead.dealValue ? lead.dealValue.toLocaleString() : 0}€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Probability</span>
                    <span className="text-sm">{lead.probability || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Email Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSendEmail && onSendEmail(lead)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  <Mail size={14} /> Send Email
                </button>
                <button
                  onClick={() => onShowEmailHistory && onShowEmailHistory(lead)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                >
                  <History size={14} /> History
                </button>
              </div>
            </div>
          </div>

            {/* Right Panel - Notes & Tasks */}
            <div className="flex-1 p-4 sm:p-6 bg-white">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'notes' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <FileText size={16} /> Notes ({lead.notes?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
              >
                <CheckSquare size={16} /> Tasks ({lead.tasks?.length || 0})
              </button>
            </div>

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleAddNote}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      <Plus size={14} /> Add Note
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {lead.notes?.map((note: any) => {
                    const authorName = note.user?.name || `User ${note.userId}`;
                    const createdDate = note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Just now';
                    const isEditing = editingNoteId === note.id;
                    return (
                      <div key={note.id} className="bg-white border rounded-xl p-4 group">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                              {authorName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium">{authorName}</span>
                            <span className="text-xs text-gray-400">{createdDate}</span>
                          </div>
                          {!isEditing && (
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditNoteContent(note.content);
                                }}
                                className="p-1 hover:bg-emerald-50 rounded text-emerald-500"
                                title="Edit note"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteNote(lead.id, note.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-500"
                                title="Delete note"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="mt-2">
                            <textarea
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              className="w-full p-2 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
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
                                className="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700">{note.content}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-4">
                {!showTaskForm && (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add New Task
                  </button>
                )}
                {showTaskForm && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title"
                      className="w-full p-3 border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="p-3 border rounded-lg text-sm"
                      />
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="p-3 border rounded-lg text-sm"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                      <select
                        value={newTask.userId}
                        onChange={(e) => setNewTask({ ...newTask, userId: e.target.value })}
                        className="p-3 border rounded-lg text-sm"
                      >
                        <option value="all">Assign To: All Team</option>
                        {users?.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTask}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {lead.tasks?.map((task: any) => {
                    const isCompleted = task.status === 'COMPLETED';
                    const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';
                    const priority = task.priority || 'medium';
                    const isEditingTask = editingTaskId === task.id;

                    return (
                      <div key={task.id} className="bg-white border rounded-xl p-4 group">
                        {isEditingTask ? (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={editTaskData.title}
                              onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                              className="w-full p-2 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <input
                                type="date"
                                value={editTaskData.dueDate}
                                onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value })}
                                className="p-2 border rounded-lg text-sm"
                              />
                              <select
                                value={editTaskData.priority}
                                onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                                className="p-2 border rounded-lg text-sm"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingTaskId(null)}
                                className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
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
                                className="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                onClick={() => onUpdateTask(lead.id, task.id, {
                                  status: isCompleted ? 'PENDING' : 'COMPLETED'
                                })}
                                className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-500'
                                  }`}
                              >
                                {isCompleted && <CheckCircle size={12} />}
                              </button>
                              <div className="flex-1">
                                <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar size={12} /> {dueDateStr}
                                  </span>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[priority]}`}>
                                    {priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingTaskId(task.id);
                                  setEditTaskData({
                                    title: task.title,
                                    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                    priority: task.priority || 'medium'
                                  });
                                }}
                                className="p-1 hover:bg-blue-50 rounded text-blue-500"
                                title="Edit task"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => onDeleteTask(lead.id, task.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-500"
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
    </div>
  );
}