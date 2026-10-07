"use client";

import { useState } from "react";
import Link from "next/link";
import { Anchor, MessageCircle, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang Kami", href: "#about" },
  { label: "Rantai Pasok", href: "#supply-chain" },
  { label: "Katalog Komoditas", href: "#commodities" },
  { label: "Keunggulan", href: "#why-us" },
];

const WA_URL =
  "https://wa.me/6285719123000?text=Halo%20AJS%2C%20saya%20tertarik%20dengan%20pasokan%20komoditas%20ikan.";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand */}
        <Link href="#hero" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-[#1E3A8A] text-white shadow-lg shadow-sky-500/20">
            <Anchor className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-white">
              PT ALTISAN JAYA SINERGI
            </span>
            <span className="text-[11px] font-medium text-sky-300/80">
              Fish Commodity Trading &amp; Supply
            </span>
          </span>
        </Link>

        {/* Center nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-sky-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 px-4 py-2 text-sm font-semibold text-sky-200 transition-colors hover:bg-sky-400/10"
          >
            <MessageCircle className="h-4 w-4" />
            Hubungi WA
          </a>
          <Link
            href="/login"
            className="rounded-lg bg-gradient-to-r from-sky-500 to-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-opacity hover:opacity-90"
          >
            Portal Buyer B2B
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-[#0F172A]/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-1 text-sm font-medium text-slate-200 hover:text-sky-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-sky-400/40 px-4 py-2.5 text-sm font-semibold text-sky-200"
            >
              <MessageCircle className="h-4 w-4" />
              Hubungi WA
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-sky-500 to-[#1E3A8A] px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Portal Buyer B2B
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
