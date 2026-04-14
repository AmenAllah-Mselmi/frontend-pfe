'use client';
import { useState, useEffect } from 'react';
import { X, Mail, Clock, CheckCircle, AlertCircle, Eye, BarChart } from 'lucide-react';
import { useEmailStore } from '@/lib/emailStore';

interface EmailHistoryModalProps {
  onClose: () => void;
  contact: any;
  currentUser: string; // This should be the user ID (number)
}

export default function EmailHistoryModalManager({ onClose, contact, currentUser }: EmailHistoryModalProps) {
  const [filter, setFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  
  const { emails, loading, loadEmails, error } = useEmailStore();

  useEffect(() => {
    if (contact?.id && currentUser) {
      const userId = typeof currentUser === 'string' ? parseInt(currentUser) : currentUser;
      if (!isNaN(userId)) {
        loadEmails(userId, contact.id);
      }
    }
  }, [contact.id, currentUser, loadEmails]);

  const totalEmails = emails.length;
  const openedEmails = emails.filter(e => e.opened).length;
  const responseRate = totalEmails > 0 ? Math.round((openedEmails / totalEmails) * 100) : 0;

  const getStatusIcon = (status: string, opened: boolean) => {
    if (status === 'sent' && opened) return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'sent' && !opened) return <Clock size={14} className="text-yellow-500" />;
    return <AlertCircle size={14} className="text-red-500" />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const filteredEmails = emails.filter(email => {
    if (teamFilter === 'mine') {
      // Compare with currentUser (string or number)
      return email.userId?.toString() === currentUser.toString() || (email.from && email.from.includes(currentUser));
    }
    if (teamFilter === 'team') {
      return email.userId?.toString() !== currentUser.toString() && (!email.from || !email.from.includes(currentUser));
    }
    return true;
  }).filter(email => {
    if (filter === 'opened') return email.opened;
    if (filter === 'unopened') return !email.opened;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email History</h2>
              <p className="text-sm text-gray-500">
                {contact.name} • {contact.email} • {totalEmails} emails
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Statistics */}
        <div className="px-6 py-3 border-b bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div><p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total</p><p className="text-lg font-bold text-blue-700">{totalEmails}</p></div>
            <div><p className="text-xs text-green-600 font-medium uppercase tracking-wider">Opened</p><p className="text-lg font-bold text-green-600">{openedEmails}</p></div>
            <div><p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Open rate</p><p className="text-lg font-bold text-blue-700">{responseRate}%</p></div>
          </div>
          <BarChart size={20} className="text-purple-400 animate-pulse" />
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2">
              {['all', 'mine', 'team'].map(f => (
                <button key={f} onClick={() => setTeamFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${teamFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
                  {f === 'all' ? 'All' : f === 'mine' ? 'My emails' : 'Team emails'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {['all', 'opened', 'unopened'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
                  {f === 'all' ? 'All status' : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-gray-400 text-sm italic">Synchronizing with server...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">
              <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">Error loading history</p>
              <p className="text-sm opacity-80 mt-1">{error}</p>
              <button 
                onClick={() => {
                  const uid = typeof currentUser === 'string' ? parseInt(currentUser) : currentUser;
                  if (!isNaN(uid)) loadEmails(uid, contact.id);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Mail size={48} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">No emails found</p>
              <p className="text-sm mt-1">Communication history for this contact will appear here.</p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div key={email.id} className="p-6 border-b hover:bg-blue-50/30 transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(email.status, !!email.opened)}
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors uppercase text-xs tracking-tight">{email.subject}</h3>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-tighter">
                        <span>To: {email.to}</span>
                        {email.from && <><span>•</span><span>From: {email.from}</span></>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-400 font-mono">{formatDate(email.sentAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 ml-7 mb-2 leading-relaxed">
                  {email.body.replace(/<[^>]*>?/gm, '')}
                </p>
                <div className="ml-7 flex items-center gap-3 mt-2">
                  {email.opened ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                      <Eye size={10} /> Viewed {email.openedAt && `on ${formatDate(email.openedAt)}`}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                      <Clock size={10} /> Pending view
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <span>Showing {filteredEmails.length} of {totalEmails} log entries</span>
          <button onClick={onClose} className="px-6 py-2 text-xs font-bold bg-white border rounded-full hover:bg-gray-100 transition shadow-sm text-gray-700">Close</button>
        </div>
      </div>
    </div>
  );
}