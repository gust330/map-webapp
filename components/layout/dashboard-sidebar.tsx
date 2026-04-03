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
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border/60 bg-[#1a1a1a]">
      <div className="flex h-14 items-center border-b border-border/60 px-4">
        <Link href="/capture" className="font-semibold tracking-tight text-foreground">
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
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#7c3aed]/20 text-[#c4b5fd]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <Separator className="bg-border/60" />
      <div className="space-y-2 p-3">
        <p className="truncate px-1 text-xs text-muted-foreground" title={email}>
          {email || "—"}
        </p>
        <SignOutButton />
      </div>
    </aside>
  );
}
