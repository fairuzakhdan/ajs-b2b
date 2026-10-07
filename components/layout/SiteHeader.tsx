import Link from "next/link";
import { Anchor } from "lucide-react";
import { getSession } from "@/lib/session";
import { SiteHeaderNav } from "@/components/layout/SiteHeaderNav";

/** Header/navbar global portal (tampil di semua halaman kecuali yang
 *  disembunyikan oleh SiteChrome, mis. "/" dan "/login"). */
export async function SiteHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E3A8A] text-white">
            <Anchor className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-[#0F172A]">
              PT ALTISAN JAYA SINERGI
            </span>
            <span className="hidden text-[11px] text-slate-500 sm:inline">
              Fish Commodity Trading &amp; Supply
            </span>
          </span>
        </Link>

        <SiteHeaderNav isLoggedIn={!!session} role={session?.role} />
      </nav>
    </header>
  );
}
