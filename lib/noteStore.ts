import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';

export type Note = {
    id: number;
    content: string;
    leadId: number;
    userId: number;
    user?: {
        name: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export type NoteState = {
    notes: Note[];
    loading: boolean;
    loadNotes: () => Promise<void>;
    addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteNote: (id: number) => Promise<void>;
    updateNote: (id: number, updatedNote: Partial<Note>) => Promise<void>;
};

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    loading: false,
    loadNotes: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/notes`, { credentials: "include" });
            const data = await response.json();
            set({ notes: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    addNote: async (note) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/notes`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(note),
            });
            const data = await response.json();
            set((state) => ({ notes: [...state.notes, data], loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    deleteNote: async (id: number) => {
        set({ loading: true });
        try {
            await fetch(`${base}/notes/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            set((state) => ({ notes: state.notes.filter((n) => n.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    updateNote: async (id: number, updatedNote: Partial<Note>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/notes/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedNote),
            });
            const data = await response.json();
            set((state) => ({ notes: state.notes.map((n) => n.id === id ? { ...n, ...data } : n), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));