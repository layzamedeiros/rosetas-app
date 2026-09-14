"use client";

import { logout } from "@/app/login/actions"; // 1. Importe a ação de logout
import { cn } from "@/lib/utils";
import {
  Archive,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  PanelLeftClose,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react"; // 2. Adicione useTransition

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    icon: ClipboardList,
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
  },
  {
    href: "/admin/historico",
    label: "Histórico",
    icon: Archive,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition(); // 3. Crie o estado de transição
  const pathname = usePathname();

  // 4. Função que chama o logout no servidor
  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-primary-foreground transition-all duration-200",
        collapsed ? "w-17" : "w-56"
      )}
    >
      <div
        className={cn(
          "flex h-20 shrink-0 items-center",
          collapsed ? "justify-center px-3" : "justify-between px-3"
        )}
      >
        {!collapsed && (
          <Link
            href="/admin"
            className={cn(
              "flex min-w-0 items-center",
              collapsed ? "h-9 w-9 justify-center overflow-hidden" : "flex-1"
            )}
          >
            <Image
              src="/logo-rosetas.svg"
              width={150}
              height={48}
              alt="Rosetas"
              className={cn("h-auto object-contain w-38")}
              priority
            />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
            collapsed && "hidden"
          )}
        >
          <PanelLeftClose size={17} />
        </button>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Expandir menu"
            aria-label="Expandir menu"
            className="absolute ml-0 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <PanelLeft size={17} />
          </button>
        )}
      </div>

      <nav
        className={cn(
          "flex-1",
          collapsed ? "px-2" : "px-3"
        )}
      >
        {!collapsed && (
          <p className="mb-2 mt-4 px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Principal
          </p>
        )}

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-sm text-sm transition-colors",
                  collapsed
                    ? "h-10 justify-center px-2"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-secondary text-deep"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        className={cn(
          "shrink-0 border-t border-border",
          collapsed ? "p-2" : "p-3"
        )}
      >
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "flex w-full items-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
            collapsed ? "h-10 justify-center px-2" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut size={18} strokeWidth={1.8} />
          {!collapsed && <span>{isPending ? "Saindo..." : "Sair"}</span>}
        </button>
      </div>
    </aside>
  );
}