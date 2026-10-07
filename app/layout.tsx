import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/app/components/LogoutButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AJS — B2B Fish Commodity Supply Portal",
  description:
    "PT Altisan Jaya Sinergi (AJS) — supplier komoditas laut terpercaya dari hub Muara Baru, Jakarta. Procurement platform untuk perusahaan pembeli komoditas laut.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
          <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 text-white font-bold text-sm">
                AJS
              </span>
              <span className="font-semibold text-slate-900 hidden sm:inline">
                Altisan Jaya Sinergi
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/commodities"
                className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
              >
                Commodities
              </Link>
              {session ? (
                <>
                  <Link
                    href={session.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
                  >
                    {session.role === "ADMIN" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium rounded-md bg-blue-800 text-white px-4 py-2 hover:bg-blue-900 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} PT Altisan Jaya Sinergi. Fish Commodity Trading &amp; Supply — Muara Baru, Jakarta.
          </div>
        </footer>
      </body>
    </html>
  );
}
