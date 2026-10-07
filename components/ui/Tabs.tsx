"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type TabItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** Opsional: penentu aktif kustom. Default: pathname === href. */
  isActive?: (pathname: string) => boolean;
};

type TabsProps = {
  items: TabItem[];
  /** Elemen tambahan di depan tab, mis. label/divider. */
  leading?: ReactNode;
};

/** Baris tab navigasi dengan indikator aktif (underline). */
export function Tabs({ items, leading }: TabsProps) {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-slate-200">
      {leading}
      {items.map((tab) => {
        const active = tab.isActive
          ? tab.isActive(pathname)
          : pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 pb-3 text-sm font-medium transition-colors ${
              active
                ? "border-[#1E3A8A] text-[#1E3A8A]"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-[#1E3A8A]"
            }`}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
