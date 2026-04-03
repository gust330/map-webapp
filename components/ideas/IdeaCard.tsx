"use client";

import Link from "next/link";
import type { Idea } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

/** Formata data relativa em português */
function relativeTime(dateStr: string): string {
    const now = Date.now();
    const diff = now - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "agora mesmo";
    if (minutes < 60) return `há ${minutes} min`;
    if (hours < 24) return `há ${hours}h`;
    if (days === 1) return "ontem";
    if (days < 7) return `há ${days} dias`;
    return new Date(dateStr).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "short",
    });
}

// Cores das categorias por padrão
const categoryColors: Record<string, string> = {
    Projetos: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
    Aprendizagem: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
    Saúde: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,113,0.1)]",
    Finanças: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
    Criatividade: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
    Pessoal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
    Trabalho: "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
};

const defaultCategoryColor =
    "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(124,58,237,0.1)]";

export function IdeaCard({ idea }: { idea: Idea }) {
    // Truncar conteúdo para preview
    const preview =
        idea.content.length > 200
            ? idea.content.slice(0, 200) + "…"
            : idea.content;

    return (
        <Link href={`/idea/${idea.id}`} className="group block">
            <article className="relative rounded-2xl glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 focus-within:ring-2 focus-within:ring-primary p-5">
                {/* Decoration gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                {/* Conteúdo */}
                <p className="text-foreground leading-relaxed whitespace-pre-wrap relative z-10">
                    {preview}
                </p>

                {/* Categorias + Tags */}
                {(idea.categories.length > 0 || idea.tags.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {idea.categories.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className={`text-[10px] font-medium ${categoryColors[cat] ?? defaultCategoryColor}`}
                            >
                                {cat}
                            </Badge>
                        ))}
                        {idea.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="border-border/30 bg-muted/50 text-[10px] text-muted-foreground backdrop-blur-sm"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Footer: data + seta */}
                <div className="mt-4 flex items-center justify-between relative z-10 border-t border-border/30 pt-3">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-medium">
                        <Clock className="size-3.5 text-primary/70" />
                        {relativeTime(idea.created_at)}
                    </span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10">
                        <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
                    </div>
                </div>
            </article>
        </Link>
    );
}
