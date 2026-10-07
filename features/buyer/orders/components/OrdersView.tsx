import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

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

export async function OrdersView() {
  const session = await getSession();

  const orders = await prisma.order.findMany({
    where: { buyerId: session!.userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Order Request</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Anda belum pernah mengirim order request.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${orderStatusClass[order.status]}`}
                >
                  {orderStatusLabel[order.status]}
                </span>
              </div>
              <ul className="text-sm text-slate-600 divide-y divide-slate-100">
                {order.items.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>{item.productNameSnapshot}</span>
                    <span className="font-medium text-slate-900">
                      {item.quantity} KG
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
