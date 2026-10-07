import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Waves,
  Snowflake,
  Boxes,
  MapPin,
  Handshake,
} from "lucide-react";

const METRICS = [
  {
    value: "±300 MT",
    label: "Total Kapasitas Cold Storage",
    sub: "Leased & Partnership",
    icon: Snowflake,
  },
  {
    value: "5–15 MT / Hari",
    label: "Kapasitas Sourcing Harian",
    sub: "Konsisten & Terukur",
    icon: Boxes,
  },
  {
    value: "4 Hub Utama",
    label: "Jaringan Daerah",
    sub: "Aceh, Natuna, Halmahera, Dobo",
    icon: MapPin,
  },
  {
    value: "B2B Model",
    label: "Supply By Availability",
    sub: "& Customer Order Specification",
    icon: Handshake,
  },
];

export function HeroSection() {
  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden bg-[#0F172A] text-white"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#111c3a] to-[#1E3A8A]" />
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,theme(colors.sky.400),transparent_55%)]" />
        <Waves className="pointer-events-none absolute -bottom-10 right-0 h-80 w-80 text-sky-400/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200">
            <Anchor className="h-3.5 w-3.5" />
            Muara Baru, Jakarta • EST. 2022
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Reliable Supply.{" "}
            <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
              Flexible Sourcing.
            </span>{" "}
            Trusted Partnership.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
            Menghubungkan sumber komoditas perikanan daerah dengan kebutuhan
            pasar domestik dan internasional dari hub utama Muara Baru, Jakarta.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#commodities"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-[#1E3A8A] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-sky-500/25 transition-opacity hover:opacity-90"
            >
              Eksplor Katalog B2B
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Masuk Portal Buyer
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar / key metrics */}
      <section className="relative z-10 mx-auto -mt-12 w-full max-w-7xl px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-white p-6">
              <m.icon className="h-7 w-7 text-[#1E3A8A]" strokeWidth={1.8} />
              <p className="mt-3 text-2xl font-extrabold text-[#0F172A]">
                {m.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {m.label}
              </p>
              <p className="text-xs text-slate-500">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
