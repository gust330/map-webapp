"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Idea } from "@/lib/types";
import { useIdeas } from "@/lib/hooks/useIdeas";
import { useAppStore } from "@/lib/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Archive,
    Trash2,
    Clock,
    Type,
    Mic,
    ImageIcon,
    Loader2,
} from "lucide-react";

const inputMethodLabels: Record<string, { label: string; icon: typeof Type }> = {
    text: { label: "Texto", icon: Type },
    voice: { label: "Voz", icon: Mic },
    image: { label: "Imagem", icon: ImageIcon },
};

// Cores das categorias
const categoryColors: Record<string, string> = {
    Projetos: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Aprendizagem: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Saúde: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Finanças: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Criatividade: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Pessoal: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Trabalho: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const defaultCategoryColor =
    "bg-primary/10 text-primary border-primary/20";

export function IdeaDetailView({ idea }: { idea: Idea }) {
    const router = useRouter();
    const { archiveIdea, deleteIdea, isPending } = useIdeas();
    const addToast = useAppStore((s) => s.addToast);
    const [deleting, setDeleting] = useState(false);
    const [archiving, setArchiving] = useState(false);

    const method = inputMethodLabels[idea.input_method] ?? inputMethodLabels.text;
    const MethodIcon = method.icon;

    const handleArchive = async () => {
        setArchiving(true);
        const result = await archiveIdea(idea.id);
        setArchiving(false);
        if (result) {
            addToast("Ideia arquivada.", "success");
            router.push("/mind");
        } else {
            addToast("Erro ao arquivar.", "error");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tens a certeza que queres eliminar esta ideia?")) return;
        setDeleting(true);
        const success = await deleteIdea(idea.id);
        setDeleting(false);
        if (success) {
            addToast("Ideia eliminada.", "success");
            router.push("/mind");
        } else {
            addToast("Erro ao eliminar.", "error");
        }
    };

    const createdAt = new Date(idea.created_at).toLocaleDateString("pt-PT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="space-y-6">
            {/* Voltar */}
            <Link
                href="/mind"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                Voltar ao feed
            </Link>

            {/* Card principal */}
            <div className="relative rounded-2xl glass-card p-8">
                {/* Meta info */}
                <div className="mb-6 flex items-center gap-4 text-xs text-muted-foreground/80 font-medium border-b border-border/30 pb-4">
                    <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary/70" />
                        {createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MethodIcon className="size-3.5 text-primary/70" />
                        {method.label}
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="prose prose-invert max-w-none">
                    <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
                        {idea.content}
                    </p>
                </div>

                {/* Categorias + Tags */}
                {(idea.categories.length > 0 || idea.tags.length > 0) && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {idea.categories.map((cat) => (
                            <Badge
                                key={cat}
                                variant="outline"
                                className={`text-xs font-medium ${categoryColors[cat] ?? defaultCategoryColor}`}
                            >
                                {cat}
                            </Badge>
                        ))}
                        {idea.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="border-border/30 bg-muted/50 text-xs text-muted-foreground backdrop-blur-sm"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Imagem (se existir) */}
                {idea.image_url && (
                    <div className="mt-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={idea.image_url}
                            alt="Imagem da ideia"
                            className="max-h-96 rounded-lg border border-border/20 object-contain"
                        />
                        {idea.image_analysis && (
                            <p className="mt-2 text-sm text-[#a1a1aa] italic">
                                {idea.image_analysis}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleArchive}
                    disabled={archiving || isPending}
                    className="gap-2 border-border/40 bg-card/40 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all rounded-lg"
                >
                    {archiving ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Archive className="size-4" />
                    )}
                    Arquivar
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting || isPending}
                    className="gap-2 border-border/40 bg-card/40 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all rounded-lg"
                >
                    {deleting ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Trash2 className="size-4" />
                    )}
                    Eliminar
                </Button>
            </div>
        </div>
    );
}
