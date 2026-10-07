import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { OrderActionButtons } from "@/features/admin/orders/components/OrderActionButtons";

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

export async function AdminOrderDetailView({ id }: { id: string }) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, buyer: true },
  });

  if (!order) {
    notFound();
  }

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-slate-500 hover:text-blue-800 transition-colors"
      >
        ← Kembali ke Order Requests
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${orderStatusClass[order.status]}`}
        >
          {orderStatusLabel[order.status]}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Item Order</h2>
          <ul className="divide-y divide-slate-100 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between">
                <span className="text-slate-700">
                  {item.productNameSnapshot}
                </span>
                <span className="font-medium text-slate-900">
                  {item.quantity} KG
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-sm">
            <span className="text-slate-500">Total quantity</span>
            <span className="font-semibold text-slate-900">{totalQty} KG</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Buyer</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-500">Nama</dt>
                <dd className="font-medium text-slate-900">
                  {order.buyer.name}
                </dd>
              </div>
              {order.buyer.companyName && (
                <div>
                  <dt className="text-slate-500">Perusahaan</dt>
                  <dd className="font-medium text-slate-900">
                    {order.buyer.companyName}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-900">
                  {order.buyer.email}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Tanggal request</dt>
                <dd className="font-medium text-slate-900">
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900 mb-3">Aksi</h2>
            {order.status === "REQUESTED" ? (
              <OrderActionButtons orderId={order.id} />
            ) : (
              <p className="text-sm text-slate-500">
                Order ini sudah {orderStatusLabel[order.status].toLowerCase()}{" "}
                dan tidak dapat diproses ulang.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
