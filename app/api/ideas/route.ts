import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

// Validação do body para POST
const createIdeaSchema = z.object({
    content: z.string().min(1, "O conteúdo não pode estar vazio."),
    input_method: z.enum(["text", "voice", "image"]).default("text"),
    image_url: z.string().url().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
});

// GET /api/ideas — listar ideias do utilizador autenticado
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
        }

        const { searchParams } = request.nextUrl;
        const status = searchParams.get("status") ?? "active";

        const { data, error } = await supabase
            .from("ideas")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", status)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("[GET /api/ideas]", error);
            return NextResponse.json(
                { error: "Erro ao carregar ideias." },
                { status: 500 },
            );
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error("[GET /api/ideas] unexpected", err);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}

// POST /api/ideas — criar nova ideia
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
        }

        const body = await request.json();
        const parsed = createIdeaSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Dados inválidos.", details: parsed.error.issues },
                { status: 400 },
            );
        }

        const { content, input_method, image_url, categories, tags } = parsed.data;

        const { data, error } = await supabase
            .from("ideas")
            .insert({
                user_id: user.id,
                content,
                input_method,
                image_url: image_url ?? null,
                categories,
                tags,
            })
            .select()
            .single();

        if (error) {
            console.error("[POST /api/ideas]", error);
            return NextResponse.json(
                { error: "Erro ao criar ideia." },
                { status: 500 },
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error("[POST /api/ideas] unexpected", err);
        return NextResponse.json({ error: "Erro interno." }, { status: 500 });
    }
}
