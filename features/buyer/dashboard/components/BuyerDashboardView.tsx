import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  ShoppingCart,
  ClipboardList,
  ArrowRight,
  MapPin,
  Package,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const orderStatusLabel: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
};

const orderStatusClass: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

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

export async function BuyerDashboardView() {
  const session = await getSession();

  const [cartItemCount, availableProductCount, lastOrder, buyer, products] =
    await Promise.all([
      prisma.cartItem.count({ where: { userId: session!.userId } }),
      prisma.product.count({ where: { stockStatus: "AVAILABLE" } }),
      prisma.order.findFirst({
        where: { buyerId: session!.userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.user.findUnique({ where: { id: session!.userId } }),
      prisma.product.findMany({ orderBy: { name: "asc" } }),
    ]);

  return (
    <div>
      {/* Welcome header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#111c3a] to-[#1E3A8A] p-7 text-white shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Selamat datang, {buyer?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {buyer?.companyName ?? "Buyer AJS B2B Portal"}
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Komoditas Tersedia</p>
            <Boxes className="h-5 w-5 text-[#1E3A8A]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">
            {availableProductCount}
          </p>
          <a
            href="#katalog"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1E3A8A] hover:underline"
          >
            Lihat katalog <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Item di Cart</p>
            <ShoppingCart className="h-5 w-5 text-[#1E3A8A]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">
            {cartItemCount}
          </p>
          <Link
            href="/cart"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1E3A8A] hover:underline"
          >
            Lihat cart <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Status Order Terakhir</p>
            <ClipboardList className="h-5 w-5 text-[#1E3A8A]" />
          </div>
          {lastOrder ? (
            <>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-1 text-sm font-semibold ${orderStatusClass[lastOrder.status]}`}
              >
                {orderStatusLabel[lastOrder.status]}
              </span>
              <p className="mt-2 text-xs text-slate-500">
                {lastOrder.items.length} produk ·{" "}
                {new Date(lastOrder.createdAt).toLocaleDateString("id-ID")}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Belum ada order</p>
          )}
          <Link
            href="/orders"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1E3A8A] hover:underline"
          >
            Lihat semua order <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Catalog */}
      <div id="katalog" className="mt-12 scroll-mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">
              Katalog Komoditas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pilih komoditas dan ajukan Request Order langsung dari sini.
            </p>
          </div>
          <Link
            href="/commodities"
            className="hidden text-sm font-medium text-[#1E3A8A] hover:underline sm:inline"
          >
            Halaman katalog →
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-slate-500">Belum ada komoditas yang tersedia.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const canRequest =
                product.stockStatus === "AVAILABLE" && product.availableQty > 0;
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link
                    href={`/commodities/${product.slug}`}
                    className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#1E3A8A] px-2.5 py-1 text-xs font-bold text-white shadow">
                      Grade {product.grade}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${stockStatusClass[product.stockStatus]}`}
                      />
                      {stockStatusLabel[product.stockStatus]}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold text-[#0F172A]">{product.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {product.origin}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Boxes className="h-3 w-3" /> Tersedia
                        </p>
                        <p className="font-semibold text-slate-800">
                          {product.availableQty} KG
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2.5">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Package className="h-3 w-3" /> MOQ
                        </p>
                        <p className="font-semibold text-slate-800">
                          {product.moq} KG
                        </p>
                      </div>
                    </div>

                    {canRequest ? (
                      <Link
                        href={`/commodities/${product.slug}`}
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#162d6b]"
                      >
                        Request Order
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <span className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                        Stok Tidak Tersedia
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
