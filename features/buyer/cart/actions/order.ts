"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export type SubmitOrderResult = {
  error?: string;
};

/**
 * Mengirim semua item di cart buyer sebagai satu Order Request baru.
 * - Re-validasi tiap item terhadap stock terbaru (bukan percaya cart snapshot).
 * - Mengurangi availableQty produk begitu order dibuat (bukan baru saat
 *   admin confirm) — model "reserve on request" paling sederhana untuk MVP.
 * - Transaksi atomic: jika salah satu item gagal validasi, seluruh request
 *   dibatalkan (tidak ada partial order).
 */
export async function submitOrderRequest(
  _prevState: SubmitOrderResult,
  _formData: FormData
): Promise<SubmitOrderResult> {
  const session = await getSession();
  if (!session || session.role !== "BUYER") {
    return { error: "Anda harus login sebagai buyer." };
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return { error: "Cart Anda masih kosong." };
  }

  for (const item of cartItems) {
    if (item.product.stockStatus !== "AVAILABLE") {
      return {
        error: `${item.product.name} sedang tidak tersedia. Silakan perbarui cart Anda.`,
      };
    }
    if (item.quantity < item.product.moq) {
      return {
        error: `${item.product.name}: quantity di bawah MOQ (${item.product.moq} KG).`,
      };
    }
    if (item.quantity > item.product.availableQty) {
      return {
        error: `${item.product.name}: quantity melebihi stok tersedia (${item.product.availableQty} KG).`,
      };
    }
  }

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        buyerId: session.userId,
        status: "REQUESTED",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            productNameSnapshot: item.product.name,
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { availableQty: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: session.userId } });

    return order;
  });

  revalidatePath("/cart");
  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/commodities");

  redirect("/orders");
}
