import {
  MapPin,
  Fish,
  Factory,
  Scale,
  Snowflake,
  Truck,
  PackageCheck,
} from "lucide-react";

const REGIONS = [
  {
    name: "Aceh & Natuna",
    desc: "Fresh & Consistent Marine Supply",
    tag: "Barat Indonesia",
  },
  {
    name: "Halmahera & Dobo",
    desc: "High-Value Marine Commodities from Eastern Indonesia",
    tag: "Timur Indonesia",
  },
];

const WORKFLOW = [
  { step: 1, label: "Source", icon: Fish },
  { step: 2, label: "Procure", icon: Factory },
  { step: 3, label: "Sort & Weigh", icon: Scale },
  { step: 4, label: "Store (Cold Chain)", icon: Snowflake },
  { step: 5, label: "Distribute", icon: Truck },
  { step: 6, label: "Supply", icon: PackageCheck },
];

export function SupplyChainSection() {
  return (
    <section id="supply-chain" className="bg-[#0F172A] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-sky-400">
            Rantai Pasok
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Jaringan Sourcing Regional
          </h2>
          <p className="mt-4 text-slate-300">
            Hub sourcing utama di <strong>Muara Baru, Jakarta</strong>, dengan
            akses langsung ke jaringan daerah di seluruh Indonesia.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {REGIONS.map((r) => (
            <div
              key={r.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <MapPin className="h-7 w-7 text-sky-400" />
                <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">
                  {r.tag}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-bold">{r.name}</h3>
              <p className="mt-1 text-sm text-slate-300">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-slate-400">
            Alur Operasional
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {WORKFLOW.map((w) => (
              <div
                key={w.step}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur"
              >
                <span className="absolute right-3 top-3 text-xs font-bold text-sky-400/60">
                  0{w.step}
                </span>
                <w.icon
                  className="mx-auto h-8 w-8 text-sky-400"
                  strokeWidth={1.8}
                />
                <p className="mt-3 text-sm font-semibold">{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
