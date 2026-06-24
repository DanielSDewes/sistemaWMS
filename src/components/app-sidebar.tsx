"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Truck,
  MapPin,
  ArrowLeftRight,
  ClipboardCheck,
  TriangleAlert,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "Visão geral",
    items: [{ href: "/", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Operação",
    items: [
      { href: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight },
      { href: "/inventario", label: "Inventário", icon: ClipboardCheck },
      { href: "/alertas", label: "Alertas", icon: TriangleAlert },
    ],
  },
  {
    title: "Cadastros",
    items: [
      { href: "/produtos", label: "Produtos", icon: Package },
      { href: "/fornecedores", label: "Fornecedores", icon: Truck },
      { href: "/localizacao", label: "Localização", icon: MapPin },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Boxes className="size-4" />
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            WMS
          </span>
          <span className="text-[11px] text-sidebar-foreground/50">Armazém</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.title}
            </span>
            {group.items.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-sidebar-primary" />
                  )}
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active
                        ? "text-sidebar-primary"
                        : "text-sidebar-foreground/55 group-hover:text-sidebar-foreground",
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
