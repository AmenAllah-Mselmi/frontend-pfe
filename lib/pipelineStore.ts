import { create } from "zustand";
import { fetchWithCache as fetch } from './fetchWithCache';
import toast from 'react-hot-toast';

enum PipelineStage {
    QUALIFICATION = 'QUALIFICATION',
    PROPOSAL = 'PROPOSAL',
    NEGOTIATION = 'NEGOTIATION',
    CLOSED = 'CLOSED'
}
export type Pipeline = {
    id: number;
    name: string;
    stage: PipelineStage;
    createdAt?: Date;
    updatedAt?: Date;
};
const base = process.env.NEXT_PUBLIC_API_URL || '';
type PipelineState = {
    pipelines: Pipeline[];
    loading: boolean;
    loadPipelines: () => Promise<void>;
    addPipeline: (pipeline: Omit<Pipeline, "id" | "createdAt" | "updatedAt">) => Promise<void>;
    deletePipeline: (id: number) => Promise<void>;
    updatePipeline: (id: number, updatedPipeline: Partial<Pipeline>) => Promise<void>;
    deletePipelines: (id: number) => Promise<void>;
};
export const usePipelineStore = create<PipelineState>((set) => ({
    pipelines: [],
    loading: false,
    loadPipelines: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/pipelines`, { credentials: "include" });
            const data = await response.json();
            set({ pipelines: data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    addPipeline: async (pipeline) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/pipelines`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pipeline),
            });
            if (!response.ok) {
                const err = await response.text();
                toast.error(`Failed to create pipeline: ${err}`);
                throw new Error(err);
            }
            const data = await response.json();
            set((state) => ({ pipelines: [...state.pipelines, data], loading: false }));
            toast.success('Pipeline added successfully!');
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
    deletePipeline: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/pipelines/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete pipeline");
            set((state) => ({ pipelines: state.pipelines.filter((p) => p.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
            console.error(error);
        }
    },
    updatePipeline: async (id: number, updatedPipeline: Partial<Pipeline>) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/pipelines/${id}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPipeline),
            });
            if (!response.ok) throw new Error("Failed to update pipeline");
            const data = await response.json();
            set((state) => ({ pipelines: state.pipelines.map((p) => p.id === id ? { ...p, ...data } : p), loading: false }));
        } catch (error) {
            set({ loading: false });
            console.error(error);
        }
    },
    deletePipelines: async (id: number) => {
        set({ loading: true });
        try {
            const response = await fetch(`${base}/pipelines/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const data = await response.json();
            set((state) => ({ pipelines: state.pipelines.filter((p) => p.id !== id), loading: false }));
        } catch (error) {
            set({ loading: false });
        }
    },
}));