import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/capture");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-12">
      {children}
    </div>
  );
}
