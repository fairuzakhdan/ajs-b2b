import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Boxes,
  ArrowRight,
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

const FILTERS: { label: string; value: string }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Requested", value: "REQUESTED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Rejected", value: "REJECTED" },
];

const VALID_STATUSES: OrderStatus[] = ["REQUESTED", "CONFIRMED", "REJECTED"];

export async function AdminOrdersView({ status }: { status?: string }) {
  const activeFilter =
    status && VALID_STATUSES.includes(status as OrderStatus) ? status : "ALL";

  const where: Prisma.OrderWhereInput =
    activeFilter === "ALL" ? {} : { status: activeFilter as OrderStatus };

  const session = await getSession();

  const [
    orders,
    admin,
    requestedCount,
    confirmedCount,
    rejectedCount,
    productCount,
  ] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { items: true, buyer: true },
    }),
    prisma.user.findUnique({ where: { id: session!.userId } }),
    prisma.order.count({ where: { status: "REQUESTED" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.order.count({ where: { status: "REJECTED" } }),
    prisma.product.count(),
  ]);

  const stats = [
    {
      label: "Perlu Review",
      value: requestedCount,
      icon: Clock,
      href: "/admin?status=REQUESTED",
      accent: "text-amber-600",
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CheckCircle2,
      href: "/admin?status=CONFIRMED",
      accent: "text-emerald-600",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      href: "/admin?status=REJECTED",
      accent: "text-red-600",
    },
    {
      label: "Total Produk",
      value: productCount,
      icon: Boxes,
      href: "/admin/products",
      accent: "text-[#1E3A8A]",
    },
  ];

  return (
    <div>
      {/* Welcome header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#111c3a] to-[#1E3A8A] p-7 text-white shadow-lg">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-300/80">
          <ClipboardList className="h-4 w-4" />
          Admin Panel
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          Halo, {admin?.name ?? "Admin AJS"}
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Review dan proses permintaan order dari buyer, serta kelola stok
          komoditas.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.accent}`} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-[#0F172A]">
                {stat.value}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1E3A8A]">
                Lihat{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Orders */}
      <div className="mt-12">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">
            Order Requests
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Klik order untuk melihat detail dan memprosesnya.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            const href =
              filter.value === "ALL"
                ? "/admin"
                : `/admin?status=${filter.value}`;
            return (
              <Link
                key={filter.value}
                href={href}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#1E3A8A] text-white shadow-sm"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
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
                  className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
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
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${orderStatusClass[order.status]}`}
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
    </div>
  );
}
