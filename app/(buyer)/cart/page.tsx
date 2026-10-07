import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  RemoveButton,
  UpdateQtyForm,
  SubmitOrderButton,
} from "@/features/buyer/cart";

export const metadata: Metadata = {
  title: "Cart — AJS B2B Portal",
};

export default async function CartPage() {
  // Session dijamin ada & role BUYER oleh app/(buyer)/layout.tsx.
  const session = await getSession();
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session!.userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Cart</h1>

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500 mb-4">Cart Anda masih kosong.</p>
          <Link
            href="/commodities"
            className="inline-block rounded-md bg-blue-800 text-white font-semibold px-5 py-2.5 hover:bg-blue-900 transition-colors"
          >
            Lihat Komoditas
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Grade {item.product.grade} · {item.product.origin} ·
                        MOQ {item.product.moq} KG · Stok tersedia{" "}
                        {item.product.availableQty} KG
                      </p>
                    </div>
                    <RemoveButton cartItemId={item.id} />
                  </div>
                  <div className="mt-3">
                    <UpdateQtyForm
                      cartItemId={item.id}
                      initialQty={item.quantity}
                      moq={item.product.moq}
                      availableQty={item.product.availableQty}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 h-fit">
            <h2 className="font-semibold text-slate-900 mb-4">
              Ringkasan Request
            </h2>
            <dl className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <dt className="text-slate-500">Jumlah item</dt>
                <dd className="font-medium text-slate-900">
                  {cartItems.length} produk
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Total quantity</dt>
                <dd className="font-medium text-slate-900">
                  {totalQuantity} KG
                </dd>
              </div>
            </dl>
            <SubmitOrderButton />
            <p className="mt-3 text-xs text-slate-500">
              Request Order belum menjadi transaksi final. Tim AJS akan
              mereview dan mengonfirmasi permintaan Anda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
