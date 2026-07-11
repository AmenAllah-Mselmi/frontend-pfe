import { create } from "zustand";
import toast from 'react-hot-toast';
import { fetchWithCache as fetch } from './fetchWithCache';

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    OVERDUE = 'OVERDUE'
}

export type Task = {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus | string;
    dueDate: Date | string;
    priority?: string; // added to match frontend
    leadId: number;
    userId: number;
    user?: {
        name: string;
    };
    isBroadcast?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export type TaskState = {
    tasks: Task[];
    loading: boolean;
    loadTasks: () => Promise<void>;
    addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    updateTask: (id: number, updatedTask: Partial<Task>) => Promise<void>;
};

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    loading: false,
    loadTasks: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tasks`, { credentials: "include" });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            set({ tasks: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    addTask: async (task) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tasks`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });
            if (!response.ok) {
                const err = await response.text();
                toast.error(`Task creation failed: ${err}`);
                throw new Error(err);
            }
            const data = await response.json();
            // In case data is nested
            const newTask = data.data || data.task || data;
            set((state) => ({ tasks: [...state.tasks, newTask], loading: false }));
            toast.success('Task successfully created!');
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    deleteTask: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tasks/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            if (!response.ok) {
                toast.error('Failed to delete task');
                throw new Error('Failed to delete task');
            }
            set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id), loading: false }));
            toast.success('Task deleted successfully');
        } catch (error) {
            set({ loading: false });
        }
    },
    updateTask: async (id: number, updatedTask: Partial<Task>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tasks/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const data = await response.json();
            set((state) => ({ tasks: state.tasks.map((t) => t.id === id ? { ...t, ...data } : t), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));