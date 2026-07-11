import { create } from 'zustand';
import { fetchWithCache as fetch } from './fetchWithCache';
import io, { Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: number;
  receiverId?: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: number;
    name: string;
    role: string;
  };
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  users: Array<{ id: number; name: string; role: string; company?: string }>;
  messages: ChatMessage[];
  updatedAt: string;
}

interface ChatState {
  socket: Socket | null;
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;

  connect: (userId: number) => void;
  disconnect: () => void;
  fetchUserChats: (userId: number) => Promise<void>;
  joinGlobalChat: (userId: number) => Promise<Chat>;
  createChat: (isGroup: boolean, userIds: number[], name?: string) => Promise<Chat>;
  setActiveChat: (chatId: string) => void;
  joinChat: (chatId: string) => void;
  sendMessage: (senderId: number, chatId: string, content: string, receiverId?: number) => void;
  receiveMessage: (message: ChatMessage) => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,

  connect: (userId: number) => {
    const socket = io(BACKEND_URL);
    socket.on('connect', () => {
      console.log('Socket connected', socket.id);
    });
    
    socket.on('newMessage', (message: ChatMessage) => {
      get().receiveMessage(message);
    });

    set({ socket });
  },

  disconnect: () => {
    get().socket?.disconnect();
    set({ socket: null });
  },

  fetchUserChats: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/chats/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data = await res.json();
      set({ chats: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  joinGlobalChat: async (userId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/chats/global/${userId}`);
      if (!res.ok) throw new Error('Failed to get global chat');
      let chat: Chat = await res.json();
      if (chat.name?.startsWith('Team Chat_')) chat.name = 'Team Chat';
      set(state => {
        const exists = state.chats.find(c => c.id === chat.id);
        return { chats: exists ? state.chats : [chat, ...state.chats] };
      });
      return chat;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  createChat: async (isGroup: boolean, userIds: number[], name?: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isGroup, userIds, name }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create chat');
      }
      const newChat = await res.json();
      set((state) => ({ chats: [newChat, ...state.chats] }));
      return newChat;
    } catch (err: any) {
      console.error('Error in createChat:', err);
      set({ error: err.message });
      throw err;
    }
  },

  setActiveChat: (chatId: string) => {
    set({ activeChatId: chatId });
    get().joinChat(chatId);
  },

  joinChat: (chatId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('joinChat', chatId);
    }
  },

  sendMessage: (senderId: number, chatId: string, content: string, receiverId?: number) => {
    const { socket } = get();
    if (socket) {
      socket.emit('sendMessage', {
        senderId,
        message: { chatId, content, receiverId }
      });
      // Optionally optimistically update the UI:
      /*
      get().receiveMessage({
        id: Date.now().toString(),
        chatId, senderId, receiverId, content, isRead: false, createdAt: new Date().toISOString()
      });
      */
    }
  },

  receiveMessage: (message: ChatMessage) => {
    set((state) => ({
      chats: state.chats.map(chat => {
        if (chat.id === message.chatId) {
          // Prevent duplicates if optimistic
          const exists = chat.messages?.find(m => m.id === message.id);
          if (exists) return chat;
          return {
            ...chat,
            messages: [...(chat.messages || []), message],
            updatedAt: message.createdAt
          };
        }
        return chat;
      })
    }));
  }
}));
