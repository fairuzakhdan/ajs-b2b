import Link from "next/link";
import { Anchor, ShieldCheck, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/features/auth/login/components/LoginForm";

export function LoginView({ redirectTo }: { redirectTo?: string }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="relative hidden overflow-hidden bg-[#0F172A] lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#111c3a] to-[#1E3A8A]" />
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,theme(colors.sky.400),transparent_55%)]" />
        <Anchor className="pointer-events-none absolute -bottom-10 -left-10 h-80 w-80 text-sky-400/10" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-[#1E3A8A]">
              <Anchor className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight">
                PT ALTISAN JAYA SINERGI
              </span>
              <span className="text-[11px] text-sky-300/80">
                Fish Commodity Trading &amp; Supply
              </span>
            </span>
          </Link>

          <div>
            <h2 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">
              Portal Procurement B2B untuk Komoditas Perikanan
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              Akses ketersediaan stok terupdate, kirim Request Order, dan
              pantau status permintaan Anda — langsung dari hub Muara Baru,
              Jakarta.
            </p>
          </div>

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-sky-400" />
            Session aman — httpOnly cookie &amp; password ter-hash.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-[#1E3A8A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Masuk ke Portal B2B
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Masuk untuk mengakses katalog, cart, dan status order request
              Anda.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <LoginForm redirectTo={redirectTo} />
          </div>

          <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs text-[#1E3A8A]">
            <p className="mb-1 font-semibold">Demo akun untuk reviewer:</p>
            <p>Buyer — buyer@demo.ajs.com / buyer123</p>
            <p>Admin — admin@ajs.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
