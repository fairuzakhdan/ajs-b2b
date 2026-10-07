import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200 mb-4">
            PT Altisan Jaya Sinergi
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Mitra Terpercaya Fish Commodity Trading &amp; Supply dari Muara Baru
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl">
            AJS menghubungkan sourcing hub utama di Muara Baru, Jakarta dengan
            perusahaan pembeli komoditas laut — menghadirkan ketersediaan
            stok yang jelas, spesifikasi produk yang transparan, dan proses
            procurement B2B yang efisien.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/commodities"
              className="rounded-md bg-white text-blue-900 font-semibold px-6 py-3 hover:bg-blue-50 transition-colors"
            >
              Lihat Komoditas
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-white/40 text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors"
            >
              Daftar / Login sebagai Buyer
            </Link>
          </div>
        </div>
      </section>

      {/* Capability summary */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-10 text-center">
          Mengapa AJS?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
              01
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Sourcing Hub Langsung
            </h3>
            <p className="text-sm text-slate-600">
              Hub utama di Muara Baru, Jakarta — pusat sourcing komoditas laut
              dengan jaringan nelayan dan partner supply terpercaya.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
              02
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Spesifikasi &amp; Stok Transparan
            </h3>
            <p className="text-sm text-slate-600">
              Grade, origin, dan ketersediaan stok setiap komoditas ditampilkan
              jelas, memudahkan keputusan procurement perusahaan Anda.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold">
              03
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              Procurement B2B Terstruktur
            </h3>
            <p className="text-sm text-slate-600">
              Ajukan Request Order melalui portal buyer — setiap permintaan
              direview dan dikonfirmasi oleh tim AJS sebelum diproses.
            </p>
          </div>
        </div>
      </section>

      {/* Featured commodities */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Komoditas Utama
            </h2>
            <Link
              href="/commodities"
              className="text-sm font-medium text-blue-800 hover:text-blue-900"
            >
              Lihat semua →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/commodities/${product.slug}`}
                className="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Grade {product.grade} · {product.origin}
                  </p>
                  <span
                    className={`inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full ${
                      product.stockStatus === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : product.stockStatus === "RESERVED"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {product.stockStatus === "AVAILABLE"
                      ? "Available"
                      : product.stockStatus === "RESERVED"
                      ? "Reserved"
                      : "Unavailable"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Siap menjadi mitra procurement AJS?
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-8">
          Daftar sebagai buyer untuk mengakses katalog lengkap, mengirim
          Request Order, dan memantau status permintaan Anda secara langsung.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-blue-800 text-white font-semibold px-8 py-3 hover:bg-blue-900 transition-colors"
        >
          Daftar / Login sebagai Buyer
        </Link>
      </section>
    </div>
  );
}
