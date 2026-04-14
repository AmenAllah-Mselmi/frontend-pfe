'use client';
import { useState } from 'react';
import { X, Send, Paperclip, Bold, Italic, List, Link, Smile, Users, Copy, Clock } from 'lucide-react';

interface EmailModalProps {
  onClose: () => void;
  onSend: (emailData: any) => void;
  contact: any;
  onSchedule?: (emailData: any) => void;
}

export default function EmailModalManager({ onClose, onSend, contact, onSchedule }: EmailModalProps) {
  const [emailData, setEmailData] = useState({
    to: contact.email,
    cc: '',
    bcc: '',
    subject: '',
    message: '',
    attachments: [] as File[],
    template: '',
    scheduledFor: ''
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const templates = [
    { name: 'Introduction', subject: 'Introduction - {company}', body: 'Dear {name},\n\nI hope this email finds you well...' },
    { name: 'Follow up', subject: 'Following up on our conversation', body: 'Dear {name},\n\nI wanted to follow up on...' },
    { name: 'Meeting request', subject: 'Meeting request', body: 'Dear {name},\n\nWould you be available for a meeting...' },
    { name: 'Proposal', subject: 'Proposal for {company}', body: 'Dear {name},\n\nPlease find attached our proposal...' }
  ];

  const handleSend = () => {
    onSend(emailData);
    onClose();
  };

  const handleSchedule = () => {
    if (onSchedule) {
      onSchedule(emailData);
      onClose();
    }
  };

  const applyTemplate = (template: any) => {
    setEmailData({
      ...emailData,
      subject: template.subject.replace('{company}', contact.company).replace('{name}', contact.name),
      message: template.body.replace('{company}', contact.company).replace('{name}', contact.name)
    });
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEmailData({
        ...emailData,
        attachments: [...emailData.attachments, ...Array.from(e.target.files)]
      });
    }
  };

  const removeAttachment = (index: number) => {
    setEmailData({
      ...emailData,
      attachments: emailData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <Send size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Compose Email</h2>
              <p className="text-sm text-gray-500">To: {contact.name} • {contact.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Templates */}
        <div className="px-6 pt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1">
              <Copy size={14} /> Templates
            </p>
            <div className="flex flex-wrap gap-2">
              {templates.map((template) => (
                <button
                  key={template.name}
                  onClick={() => applyTemplate(template)}
                  className="px-3 py-1 bg-white text-blue-700 rounded-lg text-xs hover:bg-blue-100"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Form */}
        <div className="p-6 space-y-4">
          {/* To */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 w-12">To:</span>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({...emailData, to: e.target.value})}
              className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => setShowCc(!showCc)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded"
            >
              Cc
            </button>
            <button
              onClick={() => setShowBcc(!showBcc)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 hover:bg-gray-100 rounded"
            >
              Bcc
            </button>
          </div>

          {/* Cc */}
          {showCc && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 w-12">Cc:</span>
              <input
                type="text"
                placeholder="cc@example.com"
                value={emailData.cc}
                onChange={(e) => setEmailData({...emailData, cc: e.target.value})}
                className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* Bcc */}
          {showBcc && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 w-12">Bcc:</span>
              <input
                type="text"
                placeholder="bcc@example.com"
                value={emailData.bcc}
                onChange={(e) => setEmailData({...emailData, bcc: e.target.value})}
                className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 w-12">Subject:</span>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              placeholder="Enter subject..."
              className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg border">
            <button className="p-1.5 hover:bg-gray-200 rounded"><Bold size={16} /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><Italic size={16} /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><List size={16} /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><Link size={16} /></button>
            <button className="p-1.5 hover:bg-gray-200 rounded"><Smile size={16} /></button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <label className="p-1.5 hover:bg-gray-200 rounded cursor-pointer">
              <Paperclip size={16} />
              <input type="file" multiple className="hidden" onChange={handleAttachment} />
            </label>
          </div>

          {/* Message Body */}
          <textarea
            value={emailData.message}
            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
            placeholder="Write your message here..."
            rows={6}
            className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
          />

          {/* Attachments */}
          {emailData.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">Attachments:</p>
              <div className="flex flex-wrap gap-2">
                {emailData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Paperclip size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-700">{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="ml-1 text-gray-400 hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Option */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <Clock size={14} />
              {showSchedule ? 'Remove schedule' : 'Schedule send'}
            </button>
          </div>

          {showSchedule && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 w-12">Send at:</span>
              <input
                type="datetime-local"
                value={emailData.scheduledFor}
                onChange={(e) => setEmailData({...emailData, scheduledFor: e.target.value})}
                className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center bg-gray-50">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Users size={12} />
            Team email • Templates available
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
            >
              Discard
            </button>
            {showSchedule && emailData.scheduledFor ? (
              <button
                onClick={handleSchedule}
                disabled={!emailData.subject || !emailData.message}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Clock size={16} />
                Schedule
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!emailData.subject || !emailData.message}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={16} />
                Send Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}