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
                    className="min-h-[140px] resize-none glass-input rounded-xl text-foreground placeholder:text-muted-foreground/60 text-base leading-relaxed p-4"
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
                    className="relative overflow-hidden gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] rounded-full px-6"
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
