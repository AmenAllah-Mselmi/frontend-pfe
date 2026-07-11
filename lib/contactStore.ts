import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';
import toast from 'react-hot-toast';
enum ContactStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}
export type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string;
    companyId?: number;
    company?: import("./companyStore").Company;
    status?: ContactStatus;
    createdAt?: Date;
    updatedAt?: Date;
};
type ContactState = {
    contacts: Contact[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    loadContacts: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchAllContacts: () => Promise<Contact[]>;
    addContact: (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
    updateContact: (id: number, updatedContact: Partial<Contact>) => Promise<void>;
    deleteContacts: (id: number) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export const useContactStore = create<ContactState>((set) => ({
    contacts: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    loadContacts: async (page = 1, limit = 10, search?: string) => {
        set({ loading: true });
        try {
            const url = search 
                ? `${base}/contacts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
                : `${base}/contacts?page=${page}&limit=${limit}`;
            const response = await fetch(url, { credentials: "include" });
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data)) {
                set({ 
                    contacts: result.data, 
                    totalItems: result.total, 
                    totalPages: result.totalPages,
                    currentPage: result.page,
                    itemsPerPage: result.limit,
                    loading: false 
                });
            } else {
                const parsed = Array.isArray(result) ? result : (result && (Array.isArray(result.data) ? result.data : (Array.isArray(result.contacts) ? result.contacts : [])));
                set({ contacts: parsed, loading: false });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    fetchAllContacts: async () => {
        try {
            const response = await fetch(`${base}/contacts?page=1&limit=10000`, { credentials: "include" });
            const result = await response.json();
            if (result.data && Array.isArray(result.data)) return result.data;
            if (Array.isArray(result)) return result;
            return [];
        } catch (error) {
            console.error("Error fetching all contacts:", error);
            return [];
        }
    },
    addContact: async (contact) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/contacts`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contact),
            });
            if (!response.ok) {
                let msg = 'Failed to create contact';
                try { const body = await response.json(); msg = body?.message || JSON.stringify(body); } catch (e) { try { msg = await response.text(); } catch {} }
                toast.error(msg);
                throw new Error(msg);
            }
            const data = await response.json();
            set((state) => ({ contacts: [...state.contacts, data], loading: false }));
            toast.success('Contact added successfully!');
        } catch (error) {
            set({ loading: false });
            console.error('addContact error:', error);
            throw error;
        }
    },
    deleteContact: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/contacts/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete contact");
            set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
            console.error(error);
        }
    },
    updateContact: async (id: number, updatedContact: Partial<Contact>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/contacts/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedContact),
            });
            if (!response.ok) {
                let msg = 'Failed to update contact';
                try { const body = await response.json(); msg = body?.message || JSON.stringify(body); } catch (e) { try { msg = await response.text(); } catch {} }
                throw new Error(msg);
            }
            const data = await response.json();
            set((state) => ({ contacts: state.contacts.map((c) => c.id === id ? { ...c, ...data } : c), loading: false }));
        } catch (error) {
            set({ loading: false });
            console.error('updateContact error:', error);
            throw error;
        }
    },
    deleteContacts: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/contacts/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const data = await response.json();
            set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));