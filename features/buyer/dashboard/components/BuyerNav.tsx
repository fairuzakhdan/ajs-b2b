"use client";

import { LayoutDashboard, ShoppingCart, ClipboardList } from "lucide-react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";

const TABS: TabItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (p) => p === "/dashboard",
  },
  {
    href: "/cart",
    label: "Cart",
    icon: ShoppingCart,
    isActive: (p) => p.startsWith("/cart"),
  },
  {
    href: "/orders",
    label: "Order Request",
    icon: ClipboardList,
    isActive: (p) => p.startsWith("/orders"),
  },
];

export function BuyerNav() {
  return <Tabs items={TABS} />;
}
