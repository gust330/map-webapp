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
                className="inline-flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-[#f5f5f5] transition-colors"
            >
                <ArrowLeft className="size-4" />
                Voltar ao feed
            </Link>

            {/* Card principal */}
            <div className="rounded-2xl border border-border/30 bg-[#1a1a1a]/80 p-6 shadow-xl shadow-[#7c3aed]/5 backdrop-blur-xl">
                {/* Meta info */}
                <div className="mb-4 flex items-center gap-3 text-xs text-[#a1a1aa]/60">
                    <span className="flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {createdAt}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MethodIcon className="size-3" />
                        {method.label}
                    </span>
                </div>

                {/* Conteúdo */}
                <div className="prose prose-invert max-w-none">
                    <p className="text-[#f5f5f5] text-base leading-relaxed whitespace-pre-wrap">
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
                                className="border-border/30 bg-[#242424] text-xs text-[#a1a1aa]"
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
                    className="gap-2 border-border/40 bg-transparent text-[#a1a1aa] hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30"
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
                    className="gap-2 border-border/40 bg-transparent text-[#a1a1aa] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
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
