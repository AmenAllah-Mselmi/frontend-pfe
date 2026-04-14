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
    contactId?: number;
    leadId?: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
};
type TicketState = {
    tickets: Ticket[];
    loading: boolean;
    loadTickets: () => Promise<void>;
    addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteTicket: (id: number) => Promise<void>;
    updateTicket: (id: number, updatedTicket: Partial<Ticket>) => Promise<void>;
    deleteTickets: (id: number) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';

// Strip any frontend-only computed fields before sending to API
const toApiPayload = (data: Partial<Ticket & Record<string, any>>): Partial<Ticket> => {
    const { priority, tags, assignedTo, leadName, contactName, ...rest } = data;
    return rest;
};

export const useTicketStore = create<TicketState>((set) => ({
    tickets: [],
    loading: false,
    loadTickets: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/tickets`, { credentials: "include" });
            const data = await response.json();
            set({ tickets: data, loading: false });
        } catch (error) {
            set({ loading: false });
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