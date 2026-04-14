import { create } from "zustand";
import toast from 'react-hot-toast';

enum Status {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    QUALIFIED = "QUALIFIED",
    LOST = "LOST",
}

export type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: Status;
    probability?: number;
    expectedCloseDate?: Date;
    dealValue?: number;
    currency?: string;
    companyId?: number;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: any[];
    tasks?: any[];
};

type LeadState = {
    leads: Lead[];
    loading: boolean;
    loadLeads: () => Promise<void>;
    addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteLead: (id: number) => Promise<void>;
    updateLead: (id: number, updatedLead: Partial<Lead>) => Promise<void>;
};

const base = process.env.NEXT_PUBLIC_API_URL || '';

export const useLeadStore = create<LeadState>((set) => ({
    leads: [],
    loading: false,

    loadLeads: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/leads`, { credentials: "include" });
            const data = await response.json();
            set({ leads: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    addLead: async (lead) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/leads`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(lead),
            });
            if (!response.ok) {
                const err = await response.text();
                toast.error(`Error: ${err}`);
                throw new Error(err);
            }
            const data = await response.json();
            set((state) => ({ leads: [...state.leads, data], loading: false }));
            toast.success('Lead successfully created!');
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    deleteLead: async (id: number) => {
        set({ loading: true });
        try {
            await fetch(`${base}/leads/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            set((state) => ({ leads: state.leads.filter((l) => l.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },

    updateLead: async (id: number, updatedLead: Partial<Lead>) => {
        set({ loading: true });
        try {
            await fetch(`${base}/leads/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedLead),
            });
            set((state) => ({ leads: state.leads.map((l) => l.id === id ? { ...l, ...updatedLead } : l), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },

    deleteLeads: async (id: number) => {
        set({ loading: true });
        try {
            await fetch(`${base}/leads/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            set((state) => ({ leads: state.leads.filter((l) => l.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));