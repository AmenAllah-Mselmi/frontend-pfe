import { create } from "zustand";
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
    companyId?: number
    status?: ContactStatus;
    createdAt?: Date;
    updatedAt?: Date;
};
type ContactState = {
    contacts: Contact[];
    loading: boolean;
    loadContacts: () => Promise<void>;
    addContact: (contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteContact: (id: number) => Promise<void>;
    updateContact: (id: number, updatedContact: Partial<Contact>) => Promise<void>;
    deleteContacts: (id: number) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export const useContactStore = create<ContactState>((set) => ({
    contacts: [],
    loading: false,
    loadContacts: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/contacts`, { credentials: "include" });
            const data = await response.json();
            const parsed = Array.isArray(data) ? data : (data && (Array.isArray(data.data) ? data.data : (Array.isArray(data.contacts) ? data.contacts : [])));
            set({ contacts: parsed, loading: false });
        } catch (error) {
            set({ loading: false });
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