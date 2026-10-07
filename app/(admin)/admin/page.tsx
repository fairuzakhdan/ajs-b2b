import Link from "next/link";
import type { Metadata } from "next";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Order Requests — AJS Admin",
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

const FILTERS: { label: string; value: string }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Rejected", value: "REJECTED" },
];

const VALID_STATUSES: OrderStatus[] = ["REQUESTED", "CONFIRMED", "REJECTED"];

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const activeFilter =
    status && VALID_STATUSES.includes(status as OrderStatus) ? status : "ALL";

  const where: Prisma.OrderWhereInput =
    activeFilter === "ALL" ? {} : { status: activeFilter as OrderStatus };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: true, buyer: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Order Requests</h1>
      <p className="text-slate-500 mb-6">
        Review dan proses permintaan order dari buyer.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;
          const href =
            filter.value === "ALL" ? "/admin" : `/admin?status=${filter.value}`;
          return (
            <Link
              key={filter.value}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "border border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Tidak ada order request untuk filter ini.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const totalQty = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.buyer.name}
                      {order.buyer.companyName
                        ? ` · ${order.buyer.companyName}`
                        : ""}{" "}
                      · {new Date(order.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${orderStatusClass[order.status]}`}
                  >
                    {orderStatusLabel[order.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {order.items.length} produk · {totalQty} KG total
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
