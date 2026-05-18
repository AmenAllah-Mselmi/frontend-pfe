'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare, Bot, User, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

const ALLOWED_TOPICS = [
  'crm', 'lead', 'leads', 'prospect', 'pipeline', 'deal', 'deals',
  'contact', 'ticket', 'support', 'activité', 'rapport', 'statistique',
  'import', 'export', 'email', 'appel', 'vente', 'commercial'
];

export default function SimpleChatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const isTopicAllowed = (text: string) => {
    const lower = text.toLowerCase();
    return ALLOWED_TOPICS.some(topic => lower.includes(topic));
  };

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userQuery = question.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setQuestion('');
    setLoading(true);
    setError('');

    if (!isTopicAllowed(userQuery)) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "❌ Désolé, je suis un assistant CRM. Je ne réponds qu'aux questions sur les leads, pipeline, contacts, tickets, etc." 
      }]);
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: userQuery,
          userId: user?.id,
          role: user?.role
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
    } catch (err: any) {
      const errorMessage = err?.message || '';
      if (errorMessage.includes('503') || errorMessage.includes('high demand')) {
        setMessages(prev => [...prev, { 
          role: 'bot', 
          content: "⏳ Le service d'IA est actuellement surchargé. Merci de réessayer d'ici quelques minutes !" 
        }]);
      } else {
        setError("Désolé, une erreur est survenue.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end font-sans">
      {/* Fenêtre de Chat */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-100" />
              <span className="font-semibold text-sm">Assistant CRM</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 rounded-full p-1 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Zone de Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-xs mt-10 italic">
                Comment puis-je vous aider avec vos leads ou votre pipeline ?
              </p>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                </div>
              </div>
            )}

            {error && <p className="text-center text-[10px] text-red-500 font-medium">{error}</p>}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-transparent focus-within:border-blue-300 transition-all">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Votre question..."
                className="flex-1 bg-transparent px-2 py-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !question.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bouton de Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
