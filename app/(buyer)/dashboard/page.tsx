import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard — AJS B2B Portal",
};

const orderStatusLabel: Record<string, string> = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
};

const orderStatusClass: Record<string, string> = {
  REQUESTED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const session = await getSession();

  const [cartItemCount, availableProductCount, lastOrder, buyer] =
    await Promise.all([
      prisma.cartItem.count({ where: { userId: session!.userId } }),
      prisma.product.count({ where: { stockStatus: "AVAILABLE" } }),
      prisma.order.findFirst({
        where: { buyerId: session!.userId },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.user.findUnique({ where: { id: session!.userId } }),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Selamat datang, {buyer?.name}
      </h1>
      <p className="text-slate-500 mb-8">
        {buyer?.companyName ?? "Buyer AJS B2B Portal"}
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500 mb-1">
            Komoditas Tersedia
          </p>
          <p className="text-3xl font-bold text-slate-900">
            {availableProductCount}
          </p>
          <Link
            href="/commodities"
            className="mt-3 inline-block text-sm font-medium text-blue-800 hover:text-blue-900"
          >
            Lihat katalog →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500 mb-1">Item di Cart</p>
          <p className="text-3xl font-bold text-slate-900">
            {cartItemCount}
          </p>
          <Link
            href="/cart"
            className="mt-3 inline-block text-sm font-medium text-blue-800 hover:text-blue-900"
          >
            Lihat cart →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500 mb-1">
            Status Order Terakhir
          </p>
          {lastOrder ? (
            <>
              <span
                className={`inline-block mt-1 text-sm font-semibold px-2.5 py-1 rounded-full ${orderStatusClass[lastOrder.status]}`}
              >
                {orderStatusLabel[lastOrder.status]}
              </span>
              <p className="mt-2 text-xs text-slate-500">
                {lastOrder.items.length} produk ·{" "}
                {new Date(lastOrder.createdAt).toLocaleDateString("id-ID")}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400 mt-1">Belum ada order</p>
          )}
          <Link
            href="/orders"
            className="mt-3 inline-block text-sm font-medium text-blue-800 hover:text-blue-900"
          >
            Lihat semua order →
          </Link>
        </div>
      </div>
    </div>
  );
}
