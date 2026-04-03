import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-foreground">
      <DashboardSidebar email={user.email ?? ""} />
      <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
