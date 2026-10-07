"use client";

import { ClipboardList, Boxes, ShieldCheck } from "lucide-react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";

const TABS: TabItem[] = [
  {
    href: "/admin",
    label: "Order Requests",
    icon: ClipboardList,
    isActive: (p) => p === "/admin" || p.startsWith("/admin/orders"),
  },
  {
    href: "/admin/products",
    label: "Products & Stock",
    icon: Boxes,
    isActive: (p) => p.startsWith("/admin/products"),
  },
];

export function AdminNav() {
  return (
    <Tabs
      items={TABS}
      leading={
        <>
          <Badge tone="blue" className="mb-3 mr-1 uppercase tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </Badge>
          <span
            className="mb-3 mr-2 h-5 w-px bg-slate-200"
            aria-hidden="true"
          />
        </>
      }
    />
  );
}
