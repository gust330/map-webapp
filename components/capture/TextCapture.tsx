"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIdeas } from "@/lib/hooks/useIdeas";
import { useAppStore } from "@/lib/stores/appStore";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

export function TextCapture() {
    const router = useRouter();
    const { createIdea, isPending } = useIdeas();
    const addToast = useAppStore((s) => s.addToast);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize do textarea
    const adjustHeight = useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
    }, []);

    useEffect(() => {
        adjustHeight();
    }, [content, adjustHeight]);

    // Focus automático ao montar
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const handleSubmit = useCallback(async () => {
        const trimmed = content.trim();
        if (!trimmed || submitting) return;

        setSubmitting(true);
        const idea = await createIdea({ content: trimmed, input_method: "text" });
        setSubmitting(false);

        if (idea) {
            setContent("");
            addToast("Ideia capturada com sucesso!", "success");
            router.push("/mind");
        } else {
            addToast("Erro ao guardar ideia. Tenta de novo.", "error");
        }
    }, [content, submitting, createIdea, addToast, router]);

    // Ctrl+Enter para submeter
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit],
    );

    const isLoading = submitting || isPending;
    const canSubmit = content.trim().length > 0 && !isLoading;

    return (
        <div className="space-y-4">
            <div className="relative">
                <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escreve a tua ideia, pensamento ou tarefa…"
                    className="min-h-[120px] resize-none border-border/40 bg-[#1a1a1a] text-[#f5f5f5] placeholder:text-[#a1a1aa]/60 focus:border-[#7c3aed]/50 focus:ring-[#7c3aed]/20 text-base leading-relaxed transition-all"
                    disabled={isLoading}
                />
            </div>

            <div className="flex items-center justify-between">
                <p className="text-xs text-[#a1a1aa]/60">
                    <kbd className="rounded border border-border/40 bg-[#242424] px-1.5 py-0.5 font-mono text-[10px]">
                        Ctrl
                    </kbd>
                    {" + "}
                    <kbd className="rounded border border-border/40 bg-[#242424] px-1.5 py-0.5 font-mono text-[10px]">
                        Enter
                    </kbd>
                    {" para submeter"}
                </p>

                <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="gap-2 bg-[#7c3aed] text-white hover:bg-[#6d28d9] disabled:opacity-40 transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                    {isLoading ? "A guardar…" : "Capturar"}
                </Button>
            </div>
        </div>
    );
}
