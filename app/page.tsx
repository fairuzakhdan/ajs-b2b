import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Waves,
  Snowflake,
  Boxes,
  MapPin,
  ShieldCheck,
  Fish,
  Scale,
  Package,
} from "lucide-react";
import {
  LandingNavbar,
  LandingFooter,
  HeroSection,
  AboutSection,
  SupplyChainSection,
} from "@/features/public/home";
import { prisma } from "@/lib/db";

const WHY_US = [
  {
    title: "Flexible Sourcing",
    desc: "Procurement berdasarkan custom order & spesifikasi kebutuhan buyer.",
    icon: Waves,
  },
  {
    title: "Multi-Commodity Capability",
    desc: "Rentang spesies luas, dengan custom sizing & bentuk produk.",
    icon: Fish,
  },
  {
    title: "Muara Baru Hub",
    desc: "Kehadiran langsung di pusat perdagangan perikanan utama Jakarta.",
    icon: MapPin,
  },
  {
    title: "Guarded Cold-Chain",
    desc: "Suhu terkontrol dari sumber hingga distribusi.",
    icon: Snowflake,
  },
  {
    title: "Hands-on Operations",
    desc: "Quality control, sorting, & weighing internal secara langsung.",
    icon: Scale,
  },
  {
    title: "Long-term Partnership",
    desc: "Membangun kontinuitas pasokan yang andal untuk bisnis Anda.",
    icon: ShieldCheck,
  },
];

const stockStatusLabel: Record<string, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  UNAVAILABLE: "Unavailable",
};

const stockStatusClass: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  RESERVED: "bg-amber-500",
  UNAVAILABLE: "bg-slate-400",
};

export default async function Home() {
  // Realtime dari database — bukan data statis. Katalog publik di landing
  // mencerminkan stok & ketersediaan terkini yang dikelola admin.
  const commodities = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col bg-slate-50">
      <LandingNavbar />

      <HeroSection />

      <AboutSection />

      <SupplyChainSection />

      {/* 6. PRIORITY COMMODITIES */}
      <section id="commodities" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">
            Katalog Komoditas
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
            Komoditas Prioritas
          </h2>
          <p className="mt-4 text-slate-600">
            Ketersediaan stok terupdate — ajukan Request Order melalui Portal
            Buyer B2B.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {commodities.map((c) => {
            const isAvailable =
              c.stockStatus === "AVAILABLE" && c.availableQty > 0;
            return (
              <div
                key={c.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <Link
                  href={`/commodities/${c.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.imageUrl}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#1E3A8A] px-2.5 py-1 text-xs font-bold text-white shadow">
                    Grade {c.grade}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${stockStatusClass[c.stockStatus]}`}
                    />
                    {stockStatusLabel[c.stockStatus]}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-bold text-[#0F172A]">{c.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {c.origin}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Snowflake className="h-3 w-3" /> Kondisi
                      </p>
                      <p className="font-semibold text-slate-800">
                        {c.condition}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2.5">
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <Package className="h-3 w-3" /> MOQ
                      </p>
                      <p className="font-semibold text-slate-800">
                        {c.moq.toLocaleString("id-ID")} KG
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-emerald-50 p-2.5">
                    <p className="flex items-center gap-1 text-xs text-emerald-700">
                      <Boxes className="h-3 w-3" /> Ketersediaan Stok
                    </p>
                    <p className="font-bold text-emerald-700">
                      {c.availableQty.toLocaleString("id-ID")} KG
                    </p>
                  </div>

                  <Link
                    href={`/commodities/${c.slug}`}
                    className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isAvailable
                        ? "bg-[#1E3A8A] text-white hover:bg-[#162d6b]"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {isAvailable ? "Request Order" : "Lihat Detail"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. WHY CHOOSE AJS */}
      <section id="why-us" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">
              Keunggulan
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
              Mengapa Memilih AJS
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition-colors hover:border-sky-300 hover:bg-white hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-[#1E3A8A] text-white shadow-lg shadow-sky-500/20">
                  <w.icon className="h-6 w-6" strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 text-lg font-bold text-[#0F172A]">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A8A] via-[#162d6b] to-[#0F172A] px-8 py-16 text-center shadow-2xl md:px-16">
          <Waves className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-sky-400/10" />
          <Anchor className="pointer-events-none absolute -bottom-8 -left-8 h-48 w-48 text-sky-400/10" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Siap Memenuhi Kebutuhan Pasokan Komoditas Ikan Anda?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Dapatkan akses ketersediaan stok terupdate dan pengajuan order
              request cepat melalui B2B Portal AJS.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[#1E3A8A] shadow-lg transition-transform hover:scale-105"
            >
              Masuk ke Portal Buyer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
