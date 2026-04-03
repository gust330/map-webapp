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
    Projetos: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Aprendizagem: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Saúde: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    Finanças: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Criatividade: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    Pessoal: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    Trabalho: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

const defaultCategoryColor =
    "bg-[#7c3aed]/15 text-[#c4b5fd] border-[#7c3aed]/20";

export function IdeaCard({ idea }: { idea: Idea }) {
    // Truncar conteúdo para preview
    const preview =
        idea.content.length > 200
            ? idea.content.slice(0, 200) + "…"
            : idea.content;

    return (
        <Link href={`/idea/${idea.id}`} className="group block">
            <article className="rounded-xl border border-border/30 bg-[#1a1a1a]/80 p-5 transition-all duration-200 hover:border-[#7c3aed]/30 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-[#7c3aed]/5">
                {/* Conteúdo */}
                <p className="text-[#f5f5f5] leading-relaxed whitespace-pre-wrap">
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
                                className="border-border/30 bg-[#242424] text-[10px] text-[#a1a1aa]"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Footer: data + seta */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-[#a1a1aa]/60">
                        <Clock className="size-3" />
                        {relativeTime(idea.created_at)}
                    </span>
                    <ArrowRight className="size-4 text-[#a1a1aa]/30 transition-all group-hover:translate-x-0.5 group-hover:text-[#7c3aed]" />
                </div>
            </article>
        </Link>
    );
}
