import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";

const stockStatusLabel: Record<string, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  UNAVAILABLE: "Unavailable",
};

const stockStatusClass: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-amber-100 text-amber-700",
  UNAVAILABLE: "bg-slate-200 text-slate-600",
};

export async function CommoditiesView() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Commodity Catalog</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Daftar komoditas laut yang tersedia dari sourcing hub AJS. Setiap
          produk mencantumkan grade, origin, dan status ketersediaan stok.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-slate-500">Belum ada komoditas yang tersedia.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
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
                <h2 className="font-semibold text-slate-900 group-hover:text-blue-800 transition-colors">
                  {product.name}
                </h2>
                <dl className="mt-2 space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <dt>Grade</dt>
                    <dd className="font-medium text-slate-800">
                      {product.grade}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Origin</dt>
                    <dd className="font-medium text-slate-800">
                      {product.origin}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Available</dt>
                    <dd className="font-medium text-slate-800">
                      {product.availableQty} KG
                    </dd>
                  </div>
                </dl>
                <span
                  className={`inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full ${stockStatusClass[product.stockStatus]}`}
                >
                  {stockStatusLabel[product.stockStatus]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
