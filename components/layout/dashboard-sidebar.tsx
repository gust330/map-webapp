"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, CheckSquare, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/capture", label: "Capturar", icon: Mic },
  { href: "/mind", label: "Mente", icon: Brain },
  { href: "/tasks", label: "Tarefas", icon: CheckSquare },
];

export function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-14 items-center border-b border-border/50 px-4">
        <Link href="/capture" className="flex items-center gap-2 font-heading font-semibold tracking-tight text-foreground text-glow text-lg">
          <Brain className="size-5 text-primary" />
          MAP
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-primary/10 text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(124,58,237,0.15)] border border-primary/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent",
              )}
            >
              <div className={cn(
                "flex size-6 items-center justify-center rounded-md transition-all duration-300",
                active ? "bg-primary/20 text-primary" : "bg-transparent text-muted-foreground group-hover:text-foreground"
              )}>
                <Icon className="size-4 shrink-0" aria-hidden />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>
      <Separator className="bg-border/50" />
      <div className="space-y-2 p-3">
        <p className="truncate px-1 text-xs text-muted-foreground" title={email}>
          {email || "—"}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
