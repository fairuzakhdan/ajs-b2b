"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { buttonClass } from "@/components/ui/Button";

type HeaderNavProps = {
  isLoggedIn: boolean;
  role?: "BUYER" | "ADMIN";
};

/**
 * Menu navigasi header global. Dipisah sebagai Client Component agar bisa
 * menampilkan menu hamburger yang bisa di-toggle di layar mobile. Data
 * session tetap dibaca di server (SiteHeader) lalu diteruskan sebagai prop.
 */
export function SiteHeaderNav({ isLoggedIn, role }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Tutup menu mobile tiap kali pindah halaman.
  const close = () => setOpen(false);

  const dashboardHref = role === "ADMIN" ? "/admin" : "/dashboard";
  const dashboardLabel = role === "ADMIN" ? "Admin Panel" : "Dashboard";

  const links = (
    <>
      <Link
        href="/commodities"
        onClick={close}
        aria-current={pathname === "/commodities" ? "page" : undefined}
        className="text-sm font-medium text-slate-700 transition-colors hover:text-[#1E3A8A]"
      >
        Katalog
      </Link>
      {isLoggedIn ? (
        <>
          <Link
            href={dashboardHref}
            onClick={close}
            className="text-sm font-medium text-slate-700 transition-colors hover:text-[#1E3A8A]"
          >
            {dashboardLabel}
          </Link>
          <LogoutButton />
        </>
      ) : (
        <Link
          href="/login"
          onClick={close}
          className={buttonClass({ variant: "solid", size: "sm" })}
        >
          Portal Buyer B2B
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* Desktop menu */}
      <div className="hidden items-center gap-6 md:flex">{links}</div>

      {/* Mobile hamburger toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
        aria-label="Buka menu"
        aria-expanded={open}
        aria-controls="site-mobile-menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile dropdown panel */}
      {open && (
        <div
          id="site-mobile-menu"
          className="absolute left-0 right-0 top-full border-b border-slate-200 bg-white px-6 py-4 shadow-sm md:hidden"
        >
          <div className="flex flex-col items-start gap-4">{links}</div>
        </div>
      )}
    </>
  );
}
