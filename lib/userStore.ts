import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';
enum Role {
    MANAGER = "ADMIN",
    REP = "REP"
}
export type User = {
    id: number;
    name: string;
    email: string;
    password?: string;
    role?: Role;
    company?: string;
    createdAt?: string;
    updatedAt?: string;
};
type UserState = {
    users: User[];
    loading: boolean;
    loadUsers: () => Promise<void>;
    addUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    updateUser: (id: number, updated: Partial<User>) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export const useUserStore = create<UserState>((set) => ({
    users: [],
    loading: false,
    loadUsers: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/admin/users`, { credentials: "include" });
            const data = await response.json();
            set({ users: Array.isArray(data) ? data : [], loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    addUser: async (user) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/admin/users`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            // Backend returns { message, user, access_token } on create
            const newUser = data.user ?? data;
            set((state) => ({ users: [...state.users, newUser], loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    deleteUser: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/admin/users/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            set((state) => ({ users: state.users.filter((u) => u.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    updateUser: async (id: number, updated: Partial<User>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/admin/users/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updated),
            });
            const data = await response.json();
            set((state) => ({ users: state.users.map((u) => u.id === id ? { ...u, ...updated } : u), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },

}));