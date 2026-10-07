import Image from "next/image";
import { prisma } from "@/lib/db";
import { UpdateStockForm } from "@/features/admin/products/components/UpdateStockForm";

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

export async function AdminProductsView() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Products &amp; Stock
      </h1>
      <p className="text-slate-500 mb-6">
        Kelola jumlah stok, MOQ, dan status ketersediaan tiap komoditas.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">
                    {product.name}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockStatusClass[product.stockStatus]}`}
                  >
                    {stockStatusLabel[product.stockStatus]}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Grade {product.grade} · {product.origin}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <UpdateStockForm
                productId={product.id}
                availableQty={product.availableQty}
                moq={product.moq}
                stockStatus={product.stockStatus}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
