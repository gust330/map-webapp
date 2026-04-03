import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Idea } from "@/lib/types";
import { IdeaDetailView } from "@/components/ideas/IdeaDetailView";

type IdeaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaDetailPage({ params }: IdeaPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    redirect("/mind");
  }

  const idea = data as Idea;

  return (
    <div className="mx-auto max-w-3xl">
      <IdeaDetailView idea={idea} />
    </div>
  );
}
