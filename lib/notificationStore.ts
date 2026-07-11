import { create } from 'zustand';
import { fetchWithCache as fetch } from './fetchWithCache';

export interface Notification {
  id: number;
  type: string;
  message: string;
  degree: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: (userId: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async (userId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/notifications/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        set({ 
          notifications: data,
          unreadCount: data.filter((n: Notification) => !n.isRead).length
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  },
  markAsRead: async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/notifications/${id}/read`, { method: 'PATCH' });
      set(state => {
        const newNotifs = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
        return {
          notifications: newNotifs,
          unreadCount: newNotifs.filter(n => !n.isRead).length
        };
      });
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  },
  markAllAsRead: async () => {
    const { notifications, markAsRead } = get();
    const unread = notifications.filter(n => !n.isRead);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  }
}));
