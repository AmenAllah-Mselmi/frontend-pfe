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
    company?: import("./companyStore").Company;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: any[];
    tasks?: any[];
};

type LeadState = {
    leads: Lead[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    loadLeads: (page?: number, limit?: number) => Promise<void>;
    fetchAllLeads: () => Promise<Lead[]>;
    addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteLead: (id: number) => Promise<void>;
    updateLead: (id: number, updatedLead: Partial<Lead>) => Promise<void>;
};

const base = process.env.NEXT_PUBLIC_API_URL || '';

export const useLeadStore = create<LeadState>((set) => ({
    leads: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,

    loadLeads: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/leads?page=${page}&limit=${limit}`, { credentials: "include" });
            const result = await response.json();
            
            // Handle both old and new response formats for backward compatibility during transition
            if (result.data && Array.isArray(result.data)) {
                set({ 
                    leads: result.data, 
                    totalItems: result.total || result.totalItems || 0, 
                    totalPages: result.totalPages || 0,
                    currentPage: result.page || page,
                    itemsPerPage: result.limit || limit,
                    loading: false 
                });
            } else if (result.leads && Array.isArray(result.leads)) {
                set({ 
                    leads: result.leads, 
                    totalItems: result.total || result.totalItems || 0, 
                    totalPages: result.totalPages || 0,
                    currentPage: result.page || page,
                    itemsPerPage: result.limit || limit,
                    loading: false 
                });
            } else if (Array.isArray(result)) {
                set({ leads: result, totalItems: result.length, loading: false });
            } else {
                set({ leads: [], loading: false });
            }
        } catch (error) {
            set({ loading: false });
        }
    },

    fetchAllLeads: async () => {
        try {
            const response = await fetch(`${base}/leads?page=1&limit=10000`, { credentials: "include" });
            const result = await response.json();
            if (result.data && Array.isArray(result.data)) return result.data;
            if (result.leads && Array.isArray(result.leads)) return result.leads;
            if (Array.isArray(result)) return result;
            return [];
        } catch (error) {
            console.error("Error fetching all leads:", error);
            return [];
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