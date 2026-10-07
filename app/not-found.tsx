import type { Metadata } from "next";
import { Anchor, Compass, ArrowLeft, Boxes } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "404 — Halaman Tidak Ditemukan | AJS B2B Portal",
  description: "Halaman yang Anda cari tidak ditemukan.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-[#1E3A8A] text-white shadow-lg shadow-sky-500/25">
          <Anchor className="h-8 w-8" strokeWidth={2} />
        </span>

        <p className="mt-8 text-7xl font-extrabold tracking-tight text-[#1E3A8A]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0F172A]">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau URL-nya
          salah ketik. Mari kembali ke jalur yang benar.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="solid">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
          <Button href="/commodities" variant="outline">
            <Boxes className="h-4 w-4" />
            Lihat Katalog Komoditas
          </Button>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Compass className="h-4 w-4" />
          PT Altisan Jaya Sinergi — Fish Commodity Trading &amp; Supply
        </p>
      </div>
    </div>
  );
}
