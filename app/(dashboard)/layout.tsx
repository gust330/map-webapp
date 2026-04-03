import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ToastContainer } from "@/components/ui/toast-container";

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
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>
      <div className="z-10 flex w-full relative h-screen">
        <DashboardSidebar email={user.email ?? ""} />
        <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8 relative z-20">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
