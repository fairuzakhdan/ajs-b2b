"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { orderActionSchema } from "@/lib/validation";

export type SubmitOrderResult = {
  error?: string;
};

export type OrderActionResult = {
  error?: string;
  success?: boolean;
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


async function requireAdminSession() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return null;
  }
  return session;
}

/**
 * Admin mengonfirmasi order request. Hanya order berstatus REQUESTED yang
 * bisa dikonfirmasi. Stock tidak diubah di sini — stock sudah dipotong saat
 * buyer mengirim request (model "reserve on request", lihat submitOrderRequest).
 */
export async function confirmOrder(
  _prevState: OrderActionResult,
  formData: FormData
): Promise<OrderActionResult> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Anda harus login sebagai admin." };
  }

  const parsed = orderActionSchema.safeParse({
    orderId: formData.get("orderId"),
  });
  if (!parsed.success) {
    return { error: "Order tidak valid." };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
  });
  if (!order) {
    return { error: "Order tidak ditemukan." };
  }
  if (order.status !== "REQUESTED") {
    return { error: "Hanya order berstatus Requested yang bisa dikonfirmasi." };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "CONFIRMED" },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Admin menolak order request. Hanya order berstatus REQUESTED yang bisa
 * ditolak. Karena stock sudah dipotong saat request dibuat, penolakan
 * mengembalikan availableQty tiap item ke produk terkait (atomic transaction).
 */
export async function rejectOrder(
  _prevState: OrderActionResult,
  formData: FormData
): Promise<OrderActionResult> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "Anda harus login sebagai admin." };
  }

  const parsed = orderActionSchema.safeParse({
    orderId: formData.get("orderId"),
  });
  if (!parsed.success) {
    return { error: "Order tidak valid." };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { items: true },
  });
  if (!order) {
    return { error: "Order tidak ditemukan." };
  }
  if (order.status !== "REQUESTED") {
    return { error: "Hanya order berstatus Requested yang bisa ditolak." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "REJECTED" },
    });

    // Kembalikan stock yang sempat dipotong saat request dibuat.
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { availableQty: { increment: item.quantity } },
      });
    }
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/commodities");
  return { success: true };
}
