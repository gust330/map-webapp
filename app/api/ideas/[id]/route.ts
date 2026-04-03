import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

const updateIdeaSchema = z.object({
    content: z.string().min(1).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["active", "archived"]).optional(),
    is_task: z.boolean().optional(),
});

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET /api/ideas/[id] — obter ideia por ID
export async function GET(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
        }

        const { data, error } = await supabase
            .from("ideas")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Ideia não encontrada." },
                { status: 404 },
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("[GET /api/ideas/[id]]", err);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

// PATCH /api/ideas/[id] — atualizar ideia
export async function PATCH(request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = updateIdeaSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos.", details: parsed.error.issues },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("ideas")
            .update({ ...parsed.data, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: "Erro ao atualizar ideia." },
                { status: 500 },
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("[PATCH /api/ideas/[id]]", err);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

// DELETE /api/ideas/[id] — eliminar ideia
export async function DELETE(_request: NextRequest, context: RouteContext) {
    try {
        const { id } = await context.params;
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
        }

        const { error } = await supabase
            .from("ideas")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            return NextResponse.json(
                { error: "Erro ao eliminar ideia." },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[DELETE /api/ideas/[id]]", err);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}
