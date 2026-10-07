"use client";

import { usePathname } from "next/navigation";

/**
 * Chrome global (header + footer portal) disembunyikan di halaman yang
 * punya layout penuh sendiri:
 * - "/"       → landing punya navbar & footer kaya sendiri (app/page.tsx)
 * - "/login"  → halaman login split-screen full-height sendiri
 */
const HIDE_CHROME_ON = new Set(["/", "/login"]);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDE_CHROME_ON.has(pathname)) return null;
  return <>{children}</>;
}
