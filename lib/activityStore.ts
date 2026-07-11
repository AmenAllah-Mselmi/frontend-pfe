import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';
import toast from 'react-hot-toast';

export type Activity = {
    id: number;
    type: string;
    title: string;
    description: string;
    entity: string;
    entityId: number;
    metadata?: Record<string, any>;
    user: { name: string; avatar: string };
    timestamp: string;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
};

type ActivityState = {
    activities: Activity[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    filters: any;
    setFilters: (filters: any) => void;
    loadActivities: (page?: number, limit?: number) => Promise<void>;
    addActivity: (activity: Omit<Activity, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteActivity: (id: number) => Promise<void>;
    updateActivity: (id: number, updatedActivity: Partial<Activity>) => Promise<void>;
};

const base = process.env.NEXT_PUBLIC_API_URL || '';

export const useActivityStore = create<ActivityState>((set) => ({
    activities: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    filters: {},
    setFilters: (filters) => set({ filters }),

    loadActivities: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/activities?page=${page}&limit=${limit}`, { credentials: "include" });
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data)) {
                set({ 
                    activities: result.data, 
                    totalItems: result.total, 
                    totalPages: result.totalPages,
                    currentPage: result.page,
                    itemsPerPage: result.limit,
                    loading: false 
                });
            } else {
                set({ activities: Array.isArray(result) ? result : [], loading: false });
            }
        } catch (error) {
            console.error('Failed to load activities:', error);
            set({ loading: false });
        }
    },

    addActivity: async (activity) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/activities`, {
                credentials: "include",
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(activity),
            });
            if (!response.ok) {
                const err = await response.text();
                toast.error(`Failed to add activity: ${err}`);
                throw new Error(err);
            }
            const data = await response.json();
            set((state) => ({
                activities: [data, ...state.activities],
                loading: false,
            }));
            toast.success('Activity added successfully!');
        } catch (error) {
            console.error('Failed to add activity:', error);
            set({ loading: false });
            throw error;
        }
    },

    deleteActivity: async (id: number) => {
        set({ loading: true });
        try {
            await fetch(`${base}/activities/${id}`, {
                credentials: "include", method: "DELETE" });
            set((state) => ({
                activities: state.activities.filter((a) => a.id !== id),
                loading: false,
            }));
        } catch (error) {
            console.error('Failed to delete activity:', error);
            set({ loading: false });
        }
    },

    updateActivity: async (id: number, updatedActivity: Partial<Activity>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/activities/${id}`, {
                credentials: "include",
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedActivity),
            });
            const data = await response.json();
            set((state) => ({
                activities: state.activities.map((a) =>
                    a.id === id ? { ...a, ...data } : a
                ),
                loading: false,
            }));
        } catch (error) {
            console.error('Failed to update activity:', error);
            set({ loading: false });
        }
    },
}));