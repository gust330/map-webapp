"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Idea, CreateIdeaDTO, UpdateIdeaDTO } from "@/lib/types";

/** Hook client-side para CRUD de ideias via API routes */
export function useIdeas() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const createIdea = useCallback(
        async (dto: CreateIdeaDTO): Promise<Idea | null> => {
            setError(null);
            try {
                const res = await fetch("/api/ideas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto),
                });

                if (!res.ok) {
                    const body = await res.json();
                    setError(body.error ?? "Erro ao criar ideia.");
                    return null;
                }

                const idea: Idea = await res.json();
                // Revalida a página para refletir a nova ideia
                startTransition(() => router.refresh());
                return idea;
            } catch {
                setError("Erro de ligação. Tenta de novo.");
                return null;
            }
        },
        [router, startTransition],
    );

    const updateIdea = useCallback(
        async (id: string, dto: UpdateIdeaDTO): Promise<Idea | null> => {
            setError(null);
            try {
                const res = await fetch(`/api/ideas/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto),
                });

                if (!res.ok) {
                    const body = await res.json();
                    setError(body.error ?? "Erro ao atualizar ideia.");
                    return null;
                }

                const idea: Idea = await res.json();
                startTransition(() => router.refresh());
                return idea;
            } catch {
                setError("Erro de ligação. Tenta de novo.");
                return null;
            }
        },
        [router, startTransition],
    );

    const deleteIdea = useCallback(
        async (id: string): Promise<boolean> => {
            setError(null);
            try {
                const res = await fetch(`/api/ideas/${id}`, { method: "DELETE" });

                if (!res.ok) {
                    const body = await res.json();
                    setError(body.error ?? "Erro ao eliminar ideia.");
                    return false;
                }

                startTransition(() => router.refresh());
                return true;
            } catch {
                setError("Erro de ligação. Tenta de novo.");
                return false;
            }
        },
        [router, startTransition],
    );

    const archiveIdea = useCallback(
        async (id: string): Promise<Idea | null> => {
            return updateIdea(id, { status: "archived" });
        },
        [updateIdea],
    );

    return {
        createIdea,
        updateIdea,
        deleteIdea,
        archiveIdea,
        isPending,
        error,
        clearError: () => setError(null),
    };
}
