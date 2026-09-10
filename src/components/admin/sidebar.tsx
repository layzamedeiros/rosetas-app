"use client";

import { cn } from "@/lib/utils";
import { ClipboardList, LayoutDashboard, LogOut, Package, PanelLeft, PanelLeftClose } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border bg-primary-foreground flex flex-col transition-all duration-200",
        collapsed ? "w-17" : "w-55"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Image
            src="/logo-rosetas.png"
            width={130}
            height={120}
            alt="Rosetas Personalizados"
          />
        )}

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className="p-2 rounded-xl text-deep hover:bg-secondary/50 transition-colors"
        >
          {collapsed ? (
            <PanelLeft size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                isActive
                  ? "bg-secondary/60 text-deep font-medium"
                  : "text-foreground hover:bg-secondary/50",
                collapsed && "justify-center"
              )}
            >
              <Icon
                size={18}
                className="shrink-0"
              />

              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          type="button"
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-colors w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="shrink-0" />

          {!collapsed && "Sair"}
        </button>
      </div>
    </aside>
  );
}