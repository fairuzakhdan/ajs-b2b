"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { updateStockSchema } from "@/lib/validation";

export type UpdateStockResult = {
  error?: string;
  success?: boolean;
};

/**
 * Admin mengubah ketersediaan produk: jumlah stock (availableQty), MOQ, dan
 * status stock (Available / Reserved / Unavailable).
 *
 * stockStatus sengaja dipisah dari angka availableQty supaya admin bisa
 * menandai produk Unavailable secara manual walau angka stok masih > 0
 * (sesuai brief: status minimal Available/Reserved atau Available/Unavailable).
 */
export async function updateStock(
  _prevState: UpdateStockResult,
  formData: FormData
): Promise<UpdateStockResult> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { error: "Anda harus login sebagai admin." };
  }

  const parsed = updateStockSchema.safeParse({
    productId: formData.get("productId"),
    availableQty: formData.get("availableQty"),
    moq: formData.get("moq"),
    stockStatus: formData.get("stockStatus"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const { productId, availableQty, moq, stockStatus } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: "Produk tidak ditemukan." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: { availableQty, moq, stockStatus },
  });

  revalidatePath("/admin/products");
  revalidatePath("/commodities");
  revalidatePath(`/commodities/${product.slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}
