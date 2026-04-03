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
                        className="rounded-2xl glass-card p-5 space-y-4"
                    >
                        <Skeleton className="h-4 w-full bg-muted/60" />
                        <Skeleton className="h-4 w-3/4 bg-muted/60" />
                        <Skeleton className="h-4 w-1/2 bg-muted/60" />
                        <div className="flex gap-2 pt-3 border-t border-border/30">
                            <Skeleton className="h-5 w-16 rounded-full bg-muted/60" />
                            <Skeleton className="h-5 w-12 rounded-full bg-muted/60" />
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
                <div className="relative flex size-24 items-center justify-center rounded-3xl bg-primary/10 shadow-[0_0_40px_rgba(124,58,237,0.15)] ring-1 ring-primary/20 group">
                    <div className="absolute inset-0 rounded-3xl animate-pulse bg-primary/20 blur-xl" />
                    <Lightbulb className="size-12 text-primary relative z-10 animate-in zoom-in duration-700 fade-in drop-shadow-[0_0_15px_rgba(124,58,237,0.6)]" />
                </div>
                <div className="text-center space-y-2 max-w-sm">
                    <h3 className="text-xl font-heading font-semibold text-foreground text-glow text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        A tua mente está vazia — por agora
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        Captura a tua primeira ideia e começa a construir o teu segundo cérebro inteligente.
                    </p>
                </div>
                <Link href="/capture">
                    <Button className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] rounded-full px-6 py-5 transition-all duration-300">
                        <Plus className="size-5" />
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
