"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Database, Heart, LayoutDashboard, LogOut, Menu, PlusCircle, Sparkles, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function DashboardChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }

  const links = [
    { href: "/dashboard", label: "Memorials", icon: LayoutDashboard },
    { href: "/dashboard/memorials/new", label: "New memorial", icon: PlusCircle },
    { href: "/dashboard/integrations/supabase", label: "Integrations", icon: Database },
    { href: "/", label: "Marketing site", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-base-200/50 dark:bg-base-300/30">
      <header className="sticky top-0 z-50 border-b border-gold-200/50 bg-white/85 dark:bg-card/90 backdrop-blur-md">
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-display text-base sm:text-lg text-gold-900 dark:text-gold-100 min-w-0"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-100 dark:bg-gold-900/40 border border-gold-200/60">
              <Heart className="h-4 w-4 text-gold-700" />
            </span>
            <span className="truncate hidden min-[400px]:inline">{BRAND.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className={pathname === "/dashboard" ? "bg-gold-100/80 text-gold-900" : "text-muted-foreground"}
              >
                <LayoutDashboard className="h-4 w-4 sm:mr-1" />
                <span className="hidden lg:inline">Memorials</span>
              </Button>
            </Link>
            <Link href="/dashboard/memorials/new">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <PlusCircle className="h-4 w-4 sm:mr-1" />
                <span className="hidden lg:inline">New</span>
              </Button>
            </Link>
            <Link href="/dashboard/integrations/supabase">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Database className="h-4 w-4 sm:mr-1" />
                <span className="hidden lg:inline">Integrations</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Sparkles className="h-4 w-4 sm:mr-1" />
                <span className="hidden lg:inline">Site</span>
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="outline" size="sm" className="border-gold-200" type="button" onClick={() => void logout()}>
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden lg:inline">Sign out</span>
            </Button>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="outline" size="sm" className="border-gold-200 px-2" type="button" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="bg-gold-600 hover:bg-gold-700 px-2" type="button" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="md:hidden fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" role="dialog" aria-modal>
          <button type="button" className="absolute inset-0" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-[min(100%,20rem)] bg-background border-l border-gold-200/50 shadow-2xl p-4 flex flex-col pt-14">
            <button
              type="button"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Menu</p>
            <ul className="space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium hover:bg-gold-50 dark:hover:bg-gold-950/30"
                  >
                    <Icon className="h-4 w-4 text-gold-600" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      <main className="flex-1 w-full min-w-0">{children}</main>
    </div>
  );
}
