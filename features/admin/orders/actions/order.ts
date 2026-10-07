"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { orderActionSchema } from "@/lib/validation";

export type OrderActionResult = {
  error?: string;
  success?: boolean;
};

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
