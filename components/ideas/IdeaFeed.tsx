"use client";

import Link from "next/link";
import type { Idea } from "@/lib/types";
import { IdeaCard } from "@/components/ideas/IdeaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus } from "lucide-react";

interface IdeaFeedProps {
    ideas: Idea[];
    loading?: boolean;
}

export function IdeaFeed({ ideas, loading = false }: IdeaFeedProps) {
    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border/30 bg-[#1a1a1a]/80 p-5 space-y-3"
                    >
                        <Skeleton className="h-4 w-full bg-[#242424]" />
                        <Skeleton className="h-4 w-3/4 bg-[#242424]" />
                        <Skeleton className="h-4 w-1/2 bg-[#242424]" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-5 w-16 rounded-full bg-[#242424]" />
                            <Skeleton className="h-5 w-12 rounded-full bg-[#242424]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Estado vazio
    if (ideas.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 py-20">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-[#7c3aed]/10">
                    <Lightbulb className="size-10 text-[#7c3aed]" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-[#f5f5f5]">
                        A tua mente está vazia — por agora
                    </h3>
                    <p className="max-w-sm text-sm text-[#a1a1aa]">
                        Captura a tua primeira ideia e começa a construir o teu segundo
                        cérebro.
                    </p>
                </div>
                <Link href="/capture">
                    <Button className="gap-2 bg-[#7c3aed] text-white hover:bg-[#6d28d9]">
                        <Plus className="size-4" />
                        Capturar primeira ideia
                    </Button>
                </Link>
            </div>
        );
    }

    // Feed de ideias
    return (
        <div className="space-y-3">
            {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
            ))}
        </div>
    );
}
