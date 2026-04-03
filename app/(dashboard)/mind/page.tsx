import { createClient } from "@/lib/supabase/server";
import { IdeaFeed } from "@/components/ideas/IdeaFeed";
import type { Idea } from "@/lib/types";

export default async function MindPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let ideas: Idea[] = [];

  if (user) {
    const { data } = await supabase
      .from("ideas")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    ideas = (data as Idea[]) ?? [];
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
            Mente
          </h1>
          <p className="text-sm text-[#a1a1aa]">
            Todas as tuas ideias, organizadas cronologicamente.
          </p>
        </div>
        {ideas.length > 0 && (
          <span className="rounded-full bg-[#7c3aed]/15 px-3 py-1 text-xs font-medium text-[#c4b5fd]">
            {ideas.length} {ideas.length === 1 ? "ideia" : "ideias"}
          </span>
        )}
      </div>
      <IdeaFeed ideas={ideas} />
    </div>
  );
}
