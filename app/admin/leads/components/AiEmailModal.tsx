'use client';
import { useState, useEffect } from 'react';
import { X, Copy, Check, Mail, Sparkles } from 'lucide-react';

interface AiEmailModalProps {
  leadId: number;
  onClose: () => void;
}

export default function AiEmailModal({ leadId, onClose }: AiEmailModalProps) {
  const [emailData, setEmailData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateEmail = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${base}/ai-email/generate/${leadId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to generate email');
        }
        const data = await res.json();
        setEmailData(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    generateEmail();
  }, [leadId]);

  const handleCopy = () => {
    if (emailData) {
      navigator.clipboard.writeText(`${emailData.subject}\n\n${emailData.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl border border-indigo-100 animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            <h3 className="font-bold text-lg">AI Generated Strategy Email</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-indigo-600 font-bold tracking-wide animate-pulse">Drafting personalized outreach...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4 font-medium">{error}</p>
              <button onClick={onClose} className="px-6 py-2 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Close</button>
            </div>
          ) : emailData ? (
            <div className="space-y-5">
              <div className="flex gap-2 text-[10px] uppercase font-black tracking-wider flex-wrap">
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 shadow-sm flex items-center gap-1">Tone: {emailData.tone}</span>
                {emailData.reason?.map((r: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 shadow-sm">{r}</span>
                ))}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 relative group shadow-inner">
                <div className="border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-widest">Subject:</span>
                  <span className="font-black text-gray-900">{emailData.subject}</span>
                </div>
                <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                  {emailData.body}
                </div>
                
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  <span className="text-[10px] uppercase font-black">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={onClose} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-bold text-xs uppercase tracking-widest">
                  Cancel
                </button>
                <button
                  onClick={handleCopy}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-black shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 text-xs uppercase tracking-widest"
                >
                  <Mail size={16} /> Copy to Clipboard
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
