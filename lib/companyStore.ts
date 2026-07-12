import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';
import toast from 'react-hot-toast';

enum CompanyIndustry {
    TECHNOLOGY = "TECHNOLOGY",
    FINANCE = "FINANCE",
    HEALTHCARE = "HEALTHCARE",
    EDUCATION = "EDUCATION",
    OTHER = "OTHER"
}
enum CompanySize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE'
};
export type Company = {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    companyIndustry: CompanyIndustry;
    companySize: CompanySize;
    revenue?: number;
    createdAt?: Date;
    updatedAt?: Date;
};
type CompanyState = {
    companies: Company[];
    loading: boolean;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    loadCompanies: (page?: number, limit?: number, search?: string) => Promise<void>;
    fetchAllCompanies: () => Promise<Company[]>;
    addCompany: (company: Omit<Company, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deleteCompany: (id: number) => Promise<void>;
    updateCompany: (id: number, updatedCompany: Partial<Company>) => Promise<void>;
    deleteCompanies: (id: number) => Promise<void>;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
export const useCompanyStore = create<CompanyState>((set) => ({
    companies: [],
    loading: false,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    loadCompanies: async (page = 1, limit = 10, search?: string) => {
        set({ loading: true });
        try {
            const url = search 
                ? `${base}/companies?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
                : `${base}/companies?page=${page}&limit=${limit}`;
            const response = await fetch(url, { credentials: "include" });
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data)) {
                set({ 
                    companies: result.data, 
                    totalItems: result.total, 
                    totalPages: result.totalPages,
                    currentPage: result.page,
                    itemsPerPage: result.limit,
                    loading: false 
                });
            } else {
                set({ companies: Array.isArray(result) ? result : [], loading: false });
            }
        } catch (error) {
            set({ loading: false });
        }
    },
    fetchAllCompanies: async () => {
        try {
            const response = await fetch(`${base}/companies?page=1&limit=10000`, { credentials: "include" });
            const result = await response.json();
            if (result.data && Array.isArray(result.data)) return result.data;
            if (Array.isArray(result)) return result;
            return [];
        } catch (error) {
            console.error("Error fetching all companies:", error);
            return [];
        }
    },
    addCompany: async (company) => {
        set({ loading: true });
        try {
            const payload = {
                ...company,
                revenue: Number(company.revenue) || 0,
            };
            const response = await fetch(`${base}/companies`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const err = await response.text();
                toast.error(`Company creation failed: ${err}`);
                throw new Error(err);
            }
            const data = await response.json();
            set((state) => ({ companies: [...state.companies, data], loading: false }));
            toast.success('Company created successfully!');
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    deleteCompany: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/companies/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const data = await response.json();
            set((state) => ({ companies: state.companies.filter((c) => c.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    updateCompany: async (id: number, updatedCompany: Partial<Company>) => {
        set({ loading: true });
        try {
            const payload = {
                ...updatedCompany,
                ...(updatedCompany.revenue !== undefined && { revenue: Number(updatedCompany.revenue) || 0 }),
            };
            const response = await fetch(`${base}/companies/${id}`, {
                credentials: "include",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            set((state) => ({ companies: state.companies.map((c) => c.id === id ? { ...c, ...updatedCompany } : c), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
    deleteCompanies: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/companies/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const data = await response.json();
            set((state) => ({ companies: state.companies.filter((c) => c.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));