import { create } from "zustand";

interface Toast {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

interface AppState {
    // Sidebar
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;

    // Toasts (feedback visual)
    toasts: Toast[];
    addToast: (message: string, type?: Toast["type"]) => void;
    removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

    // Toasts
    toasts: [],
    addToast: (message, type = "info") => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        // Auto-remove após 4 segundos
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 4000);
    },
    removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
