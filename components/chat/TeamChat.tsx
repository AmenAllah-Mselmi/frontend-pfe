'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Send, X, MessageSquare, Users, Phone, Video, 
  MoreHorizontal, Check, CheckCheck, Minimize2, Maximize2 
} from 'lucide-react';
import { User } from '@/lib/authStore';
import { useChatStore } from '@/lib/chatStore';

interface TeamChatProps {
  currentUser: User | null;
  teamMembers: Array<User>;
  position?: 'top' | 'bottom';
}

export default function TeamChat({ currentUser, teamMembers, position = 'bottom' }: TeamChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { connect, disconnect, joinGlobalChat, chats, sendMessage, setActiveChat, activeChatId } = useChatStore();

  useEffect(() => {
    if (currentUser && isOpen) {
      connect(currentUser.id);
      // Always join the single global team chat room
      joinGlobalChat(currentUser.id).then((globalChat) => {
        setActiveChat(globalChat.id);
      }).catch(err => console.error('Failed to join global chat:', err));
    }
  }, [currentUser, isOpen, connect, joinGlobalChat, setActiveChat]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  if (!currentUser) {
    return null;
  }

  const getColors = () => {
    if (currentUser.role === 'ADMIN') {
      return {
        primary: 'from-purple-600 to-indigo-600',
        primaryBg: 'bg-purple-600',
        secondary: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-indigo-500',
        badge: 'bg-purple-100 text-purple-700'
      };
    }
    return {
      primary: 'from-blue-600 to-cyan-600',
      primaryBg: 'bg-blue-600',
      secondary: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-100 text-blue-700'
    };
  };

  const colors = getColors();
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  const onlineCount = safeTeamMembers.filter(m => (m as any).online).length;
  const positionClass = position === 'top' ? 'bottom-28' : 'bottom-6';

  const formatTime = (dateStr: string | Date | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = () => {
    if (!input.trim() || isLoading || !currentUser || !activeChatId) return;

    sendMessage(currentUser.id, activeChatId, input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 ${positionClass} z-50 bg-gradient-to-r ${colors.primary} text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group`}
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <Users size={24} className="group-hover:rotate-12 transition-transform" />
        {onlineCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {onlineCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed right-6 ${positionClass} z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-14' : 'w-96 h-[550px]'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r ${colors.primary} rounded-t-2xl`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Users size={18} className="text-white" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
          </div>
          <h3 className="font-semibold text-white">
            {currentUser.role === 'ADMIN' ? 'Équipe Commerciale' : 'Chat Équipe'}
          </h3>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
            {safeTeamMembers.length} membres
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 size={16} className="text-white" /> : <Minimize2 size={16} className="text-white" />}
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              disconnect();
            }}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X size={16} className="text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Membres en ligne */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 overflow-x-auto">
              {safeTeamMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-sm"
                >
                  <div className="relative">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                      member.role === 'ADMIN' ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-cyan-600'
                    } flex items-center justify-center text-white text-xs font-medium`}>
                      {(member as any).avatar || member.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <span className="text-xs font-medium">{member.name}</span>
                  {member.role === 'ADMIN' && (
                    <span className={`text-[10px] ${colors.badge} px-1.5 py-0.5 rounded-full`}>
                      Mgr
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[calc(550px-170px)] bg-gray-50">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const isADMIN = message.sender?.role === 'ADMIN';
              const senderAvatar = message.sender?.name?.charAt(0) || 'U';
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && (
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                      isADMIN ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-cyan-600'
                    } flex items-center justify-center text-white text-xs font-medium mr-2 flex-shrink-0 mt-1`}>
                      {senderAvatar}
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl ${
                      isCurrentUser
                        ? `bg-gradient-to-r ${colors.primary} text-white rounded-br-sm`
                        : isADMIN
                          ? 'bg-purple-50 border border-purple-200 text-gray-800 rounded-bl-sm'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${isADMIN ? 'text-purple-600' : 'text-blue-600'}`}>
                          {message.sender?.name || 'Unknown'}
                        </span>
                        {isADMIN && (
                          <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                            ADMIN
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      isCurrentUser ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      <span className="text-[10px]">{formatTime(message.createdAt)}</span>
                      {isCurrentUser && <CheckCheck size={12} className={message.isRead ? "text-blue-200" : "text-gray-300"} />}
                    </div>
                  </div>
                  {isCurrentUser && (
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-xs font-medium ml-2 flex-shrink-0 mt-1`}>
                      {(currentUser as any).avatar || currentUser.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez un message..."
                rows={1}
                className="flex-1 p-2 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                style={{ minHeight: '40px', maxHeight: '80px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || !activeChatId}
                className={`self-end p-2 bg-gradient-to-r ${colors.primary} text-white rounded-xl hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition`}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {onlineCount} membre{onlineCount > 1 ? 's' : ''} en ligne
              </p>
              <div className="flex gap-2 text-xs">
                <button className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                  <Phone size={12} className="inline mr-1" /> Appel
                </button>
                <button className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200">
                  <Video size={12} className="inline mr-1" /> Visio
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}