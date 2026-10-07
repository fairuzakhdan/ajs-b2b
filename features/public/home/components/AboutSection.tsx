import { Ship, Snowflake, Scale, Handshake } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Ship, label: "Direct Sourcing", v: "Hub Muara Baru" },
  { icon: Snowflake, label: "Cold Chain", v: "±300 MT" },
  { icon: Scale, label: "QC Internal", v: "Sort & Weigh" },
  { icon: Handshake, label: "B2B Focus", v: "By Specification" },
];

const TAGS = [
  "Sourcing",
  "Sorting & Weighing",
  "Cold Storage",
  "B2B Distribution",
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-[#1E3A8A]">
            Tentang Kami
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
            Dari Logistik Menuju Mitra Komoditas Perikanan
          </h2>
          <p className="mt-6 leading-relaxed text-slate-600">
            Didirikan pada <strong>2022</strong>, PT Altisan Jaya Sinergi
            berkembang hingga merambah perdagangan komoditas perikanan. Kami
            mengelola sourcing, sorting, penimbangan, dan cold storage —
            menghubungkan supplier lokal secara langsung dengan buyer B2B.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Dengan kehadiran langsung di hub Muara Baru, Jakarta, AJS menjamin
            kontrol kualitas internal serta kontinuitas pasokan yang dapat
            diandalkan untuk kebutuhan bisnis berkelanjutan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HIGHLIGHTS.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <c.icon className="h-8 w-8 text-[#1E3A8A]" strokeWidth={1.8} />
              <p className="mt-4 text-lg font-bold text-[#0F172A]">{c.v}</p>
              <p className="text-sm text-slate-500">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
