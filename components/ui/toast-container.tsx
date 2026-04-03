"use client";

import { useAppStore } from "@/lib/stores/appStore";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
};

const styles = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4]",
};

export function ToastContainer() {
    const toasts = useAppStore((s) => s.toasts);
    const removeToast = useAppStore((s) => s.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-xl backdrop-blur-sm animate-in slide-in-from-right-5 fade-in duration-300 ${styles[toast.type]}`}
                    >
                        <Icon className="size-4 shrink-0" />
                        <p className="text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X className="size-3.5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
