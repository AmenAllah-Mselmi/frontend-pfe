'use client';
import { useState } from 'react';
import {
  X, FileText, CheckSquare, Plus, Calendar, User,
  Building2, DollarSign, Trash2, CheckCircle,
  Mail, Phone, Edit, AlertCircle
} from 'lucide-react';
import EditLeadModal from './EditLeadModal';
import DeleteLeadModal from './DeleteLeadModal';

export default function LeadDetailsModal({
  lead, onClose, onAddNote, onDeleteNote, onUpdateNote, onAddTask,
  onUpdateTask, onDeleteTask, onUpdateLead, onDeleteLead, currentUser,
  onConvertToContact, onConvertToDeal
}: any) {
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  const [newTask, setNewTask] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTaskData, setEditTaskData] = useState({ title: '', dueDate: '', priority: 'medium' });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    'Hot': 'bg-red-100 text-red-700',
    'Warm': 'bg-yellow-100 text-yellow-700',
    'Cold': 'bg-emerald-100 text-emerald-700'
  };

  const priorityColors: any = {
    'high': 'bg-red-100 text-red-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'low': 'bg-green-100 text-green-700'
  };

  const canModify = lead.owner === currentUser;
  const canModifyNote = (note: any) => true; // note.author is not in prisma
  const canModifyTask = (task: any) => true; // task.createdBy is not in prisma

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(lead.id, newNote);
      setNewNote('');
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask(lead.id, newTask);
      setNewTask({ title: '', dueDate: '', priority: 'medium' });
      setShowTaskForm(false);
    }
  };

  const handleUpdateLead = (leadId: number, data: any) => {
    onUpdateLead(leadId, data);
    setShowEditModal(false);
    onClose(); // Fermer le modal de détails après édition
  };

  const handleDeleteLead = (leadId: number) => {
    onDeleteLead(leadId);
    setShowDeleteModal(false);
    onClose(); // Fermer le modal de détails après suppression
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
          {/* Header avec boutons d'action */}
          <div className="p-6 border-b flex justify-between items-start sticky top-0 bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${canModify ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                {lead.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{lead.name}</h2>
                <p className="text-sm text-gray-500">{lead.company}</p>
                {!canModify && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Team lead • Read only
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canModify && (
                <>
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
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                    title="Edit lead"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete lead"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Reste du contenu inchangé... */}
          <div className="flex h-full">
            {/* Left Panel - Lead Info */}
            <div className="w-1/3 p-6 border-r bg-gray-50">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold mb-3">Lead Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm"><User size={16} className="text-gray-400" /><span>{lead.name}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Mail size={16} className="text-gray-400" /><span>{lead.email}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Phone size={16} className="text-gray-400" /><span>{lead.phone}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-gray-400" /><span>{lead.company}</span></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl">
                  <h3 className="font-semibold mb-3">Deal Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[lead.status]}`}>{lead.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Source</span>
                      <span className="text-sm font-medium">{lead.source}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Value</span>
                      <span className="text-lg font-bold text-emerald-600">{(lead.dealValue || lead.value || 0).toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Owner</span>
                      <span className="text-sm">{lead.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Notes & Tasks */}
            <div className="w-2/3 p-6 overflow-y-auto">
              <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('notes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'notes' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                  <FileText size={16} /> Notes ({lead.notes?.length || 0})
                </button>
                <button onClick={() => setActiveTab('tasks')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'tasks' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                  <CheckSquare size={16} /> Tasks ({lead.tasks?.length || 0})
                </button>
              </div>

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Add Note */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      rows={3}
                      className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddNote}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
                      >
                        <Plus size={14} /> Add Note
                      </button>
                    </div>
                  </div>

                  {/* Notes List */}
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
                              {authorName !== currentUser && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Team</span>
                              )}
                            </div>
                            {!isEditing && canModifyNote(note) && (
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
                                className="w-full p-2 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                                  className="px-3 py-1 text-xs bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
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
                  {/* Add Task Button */}
                  {!showTaskForm && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition flex items-center justify-center gap-2"
                    >
                      <Plus size={18} /> Add New Task
                    </button>
                  )}

                  {/* Task Form */}
                  {showTaskForm && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task title"
                        className="w-full p-3 border rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                      <div className="grid grid-cols-2 gap-3 mb-3">
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
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
                        >
                          Add Task
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tasks List */}
                  <div className="space-y-3">
                    {lead.tasks?.map((task: any) => {
                      const isCompleted = task.status === 'COMPLETED';
                      const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';
                      const priority = task.priority || 'medium';
                      const creatorStr = task.user?.name || `user ID: ${task.userId}`;
                      const isEditingTask = editingTaskId === task.id;

                      return (
                        <div key={task.id} className="bg-white border rounded-xl p-4 group">
                          {isEditingTask ? (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={editTaskData.title}
                                onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                                className="w-full p-2 border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
                                  className="px-3 py-1 text-xs bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <button
                                  onClick={() => canModifyTask(task) && onUpdateTask(lead.id, task.id, {
                                    status: isCompleted ? 'PENDING' : 'COMPLETED'
                                  })}
                                  className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${!canModifyTask(task) ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${isCompleted
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-green-500'
                                    }`}
                                  disabled={!canModifyTask(task)}
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
                                    {creatorStr !== currentUser && (
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                        by {creatorStr}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {canModifyTask(task) && (
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
                                    className="p-1 hover:bg-emerald-50 rounded text-emerald-500"
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
                              )}
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

      {/* Modals */}
      {showEditModal && (
        <EditLeadModal
          lead={lead}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateLead}
        />
      )}

      {showDeleteModal && (
        <DeleteLeadModal
          lead={lead}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteLead}
        />
      )}
    </>
  );
}