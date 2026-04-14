'use client';
import { useState } from 'react';
import { X, Mail, Clock, User, CheckCircle, AlertCircle, Send, Download, Eye, Archive, Star } from 'lucide-react';

interface EmailHistoryModalProps {
  onClose: () => void;
  contact: any;
  currentUser: string;
}

export default function EmailHistoryModalRepresentative({ onClose, contact, currentUser }: EmailHistoryModalProps) {
  const [filter, setFilter] = useState('all');

  // Mock data - seulement les emails du représentant
  const emailHistory = [
    {
      id: 1,
      to: contact.email,
      subject: 'Introduction to our services',
      message: 'Dear Tony, I hope this email finds you well...',
      sentAt: '2024-01-15T10:30:00',
      status: 'sent',
      opened: true,
      openedAt: '2024-01-15T14:20:00',
      attachments: 2,
      sender: 'Alex M.',
      thread: [
        { id: 101, from: contact.email, to: 'alex@company.com', content: 'Thanks for reaching out!', sentAt: '2024-01-15T15:00:00' }
      ]
    },
    {
      id: 2,
      to: contact.email,
      subject: 'Follow up on our conversation',
      message: 'Following up on our discussion about...',
      sentAt: '2024-01-10T09:15:00',
      status: 'sent',
      opened: true,
      openedAt: '2024-01-10T11:30:00',
      attachments: 1,
      sender: 'Alex M.'
    },
    {
      id: 3,
      to: contact.email,
      subject: 'Meeting scheduled',
      message: 'I would like to schedule a meeting...',
      sentAt: '2024-01-05T14:00:00',
      status: 'sent',
      opened: false,
      attachments: 0,
      sender: 'Alex M.'
    }
  ];

  // Filtrer pour ne voir que ses emails
  const myEmails = emailHistory.filter(email => email.sender === currentUser);

  const getStatusIcon = (status: string, opened: boolean) => {
    if (status === 'sent' && opened) return <CheckCircle size={14} className="text-green-500" />;
    if (status === 'sent' && !opened) return <Clock size={14} className="text-yellow-500" />;
    return <AlertCircle size={14} className="text-red-500" />;
  };

  const formatDate = (dateString: string) => {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">My Email History</h2>
              <p className="text-sm text-gray-500">
                {contact.name} • {contact.email} • {myEmails.length} emails
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b bg-gray-50 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg ${
              filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('sent')}
            className={`px-3 py-1.5 text-xs rounded-lg ${
              filter === 'sent' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sent
          </button>
          <button
            onClick={() => setFilter('opened')}
            className={`px-3 py-1.5 text-xs rounded-lg ${
              filter === 'opened' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Opened
          </button>
          <button
            onClick={() => setFilter('unopened')}
            className={`px-3 py-1.5 text-xs rounded-lg ${
              filter === 'unopened' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unopened
          </button>
        </div>

        {/* Email List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {myEmails
            .filter(email => {
              if (filter === 'sent') return true;
              if (filter === 'opened') return email.opened;
              if (filter === 'unopened') return !email.opened;
              return true;
            })
            .map((email) => (
              <div key={email.id} className="p-6 border-b hover:bg-gray-50 transition cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(email.status, email.opened)}
                    <div>
                      <h3 className="font-medium text-gray-900">{email.subject}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>To: {email.to}</span>
                        <span>•</span>
                        <span>By: {email.sender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">{formatDate(email.sentAt)}</span>
                    {email.attachments > 0 && (
                      <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        <Download size={10} /> {email.attachments}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 ml-7 mb-2">{email.message}</p>
                
                {/* Email thread preview */}
                {email.thread && (
                  <div className="ml-7 mt-2 p-2 bg-gray-50 rounded-lg text-xs text-gray-500">
                    <span className="font-medium">Thread:</span> {email.thread.length} replies
                  </div>
                )}

                {/* Status indicators */}
                <div className="ml-7 flex items-center gap-3 mt-2">
                  {email.opened ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <Eye size={12} /> Opened {email.openedAt && `on ${formatDate(email.openedAt)}`}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                      <Clock size={12} /> Not opened yet
                    </span>
                  )}
                </div>

                {/* Quick actions */}
                <div className="ml-7 flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye size={14} className="text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Archive size={14} className="text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded ml-auto text-xs text-emerald-600">
                    View thread
                  </button>
                </div>
              </div>
            ))}

          {myEmails.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <Mail size={48} className="mx-auto mb-3 opacity-30" />
              <p>No email history found</p>
              <p className="text-sm mt-1">You haven't sent any emails to this contact yet</p>
            </div>
          )}
        </div>

        {/* Footer with summary */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>My emails: {myEmails.length}</span>
            <span>•</span>
            <span>Opened: {myEmails.filter(e => e.opened).length}</span>
            <span>•</span>
            <span>Attachments: {myEmails.reduce((acc, e) => acc + (e.attachments || 0), 0)}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}