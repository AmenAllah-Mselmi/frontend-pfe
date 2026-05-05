import { create } from "zustand";
import toast from 'react-hot-toast';

enum TicketStatus {
    NEW = 'NEW',
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}
export type Ticket = {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    contactId?: number;
    leadId: number;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
};
type TicketState = {
    tickets: Ticket[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    loadTickets: (page?: number, limit?: number) => Promise<void>;
    fetchAllTickets: () => Promise<Ticket[]>;
    addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteTicket: (id: number) => Promise<void>;
    updateTicket: (id: number, updatedTicket: Partial<Ticket>) => Promise<void>;
    deleteTickets: (id: number) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';

// Strip any frontend-only computed fields before sending to API
const toApiPayload = (data: Partial<Ticket & Record<string, any>>): Partial<Ticket> => {
    const { tags, assignedTo, leadName, contactName, ...rest } = data;
    return rest;
};

export const useTicketStore = create<TicketState>((set) => ({
    tickets: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    loadTickets: async (page = 1, limit = 10) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tickets?page=${page}&limit=${limit}`, { credentials: "include" });
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data)) {
                set({ 
                    tickets: result.data, 
                    totalItems: result.total, 
                    totalPages: result.totalPages,
                    currentPage: result.page,
                    itemsPerPage: result.limit,
                    loading: false 
                });
            } else {
                set({ tickets: result, loading: false });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    fetchAllTickets: async () => {
        try {
            const response = await fetch(`${base}/tickets?page=1&limit=10000`, { credentials: "include" });
            const result = await response.json();
            if (result.data && Array.isArray(result.data)) return result.data;
            if (Array.isArray(result)) return result;
            return [];
        } catch (error) {
            console.error("Error fetching all tickets:", error);
            return [];
        }
    },
    addTicket: async (ticket) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tickets`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ticket),
            });
            if (!response.ok) {
                const msg = await response.text().catch(() => 'Unknown error');
                toast.error(`Failed to create ticket: ${msg}`);
                throw new Error(`Failed to create ticket: ${msg}`);
            }
            const data = await response.json();
            set((state) => ({ tickets: [...state.tickets, data], loading: false }));
            toast.success('Ticket created successfully!');
        } catch (error) {
            console.error(error);
            set({ loading: false });
            throw error;
        }
    },
    deleteTicket: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tickets/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }
            set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id), loading: false }));
        } catch (error) {
            console.error(error);
            set({ loading: false });
            throw error;
        }
    },
    updateTicket: async (id: number, updatedTicket: Partial<Ticket>) => {
        set({ loading: true });
        // Optimistic update in store
        set((state) => ({
            tickets: state.tickets.map((t) => t.id === id ? { ...t, ...updatedTicket } : t)
        }));
        try {
            const payload = toApiPayload(updatedTicket);
            const response = await fetch(`${base}/tickets/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const msg = await response.text().catch(() => 'Unknown error');
                // Roll back optimistic update
                set((state) => ({
                    tickets: state.tickets.map((t) => t.id === id ? { ...t, ...updatedTicket } : t),
                    loading: false
                }));
                throw new Error(`Failed to update ticket: ${msg}`);
            }
            const data = await response.json();
            set((state) => ({
                tickets: state.tickets.map((t) => t.id === id ? { ...t, ...data } : t),
                loading: false
            }));
        } catch (error) {
            console.error(error);
            set({ loading: false });
            throw error;
        }
    },
    deleteTickets: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tickets/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }
            set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id), loading: false }));
        } catch (error) {
            console.error(error);
            set({ loading: false });
        }
    },
}));