"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "@/lib/validation";

export type CartActionResult = {
  error?: string;
  success?: boolean;
};

async function requireBuyerSession() {
  const session = await getSession();
  if (!session || session.role !== "BUYER") {
    return null;
  }
  return session;
}

/**
 * Validasi business rule inti: quantity yang diminta tidak boleh kurang
 * dari MOQ dan tidak boleh melebihi available stock produk saat ini.
 * Selalu query ulang data produk terbaru dari DB — tidak percaya nilai
 * dari client.
 */
function validateQuantityAgainstProduct(
  quantity: number,
  product: { moq: number; availableQty: number; stockStatus: string }
): string | null {
  if (product.stockStatus !== "AVAILABLE") {
    return "Produk ini sedang tidak tersedia untuk dipesan.";
  }
  if (quantity < product.moq) {
    return `Quantity minimum (MOQ) untuk produk ini adalah ${product.moq} KG.`;
  }
  if (quantity > product.availableQty) {
    return `Quantity melebihi stok tersedia (${product.availableQty} KG).`;
  }
  return null;
}

export async function addToCart(
  _prevState: CartActionResult,
  formData: FormData
): Promise<CartActionResult> {
  const session = await requireBuyerSession();
  if (!session) {
    return { error: "Anda harus login sebagai buyer untuk menambah cart." };
  }

  const parsed = addToCartSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }
  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { error: "Produk tidak ditemukan." };
  }

  const validationError = validateQuantityAgainstProduct(quantity, product);
  if (validationError) {
    return { error: validationError };
  }

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId: session.userId, productId } },
    update: { quantity },
    create: { userId: session.userId, productId, quantity },
  });

  revalidatePath("/cart");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCartItemQty(
  _prevState: CartActionResult,
  formData: FormData
): Promise<CartActionResult> {
  const session = await requireBuyerSession();
  if (!session) {
    return { error: "Anda harus login sebagai buyer." };
  }

  const parsed = updateCartItemSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }
  const { cartItemId, quantity } = parsed.data;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { product: true },
  });

  if (!cartItem || cartItem.userId !== session.userId) {
    return { error: "Item cart tidak ditemukan." };
  }

  const validationError = validateQuantityAgainstProduct(
    quantity,
    cartItem.product
  );
  if (validationError) {
    return { error: validationError };
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/cart");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function removeFromCart(formData: FormData): Promise<void> {
  const session = await requireBuyerSession();
  if (!session) return;

  const parsed = removeFromCartSchema.safeParse({
    cartItemId: formData.get("cartItemId"),
  });
  if (!parsed.success) return;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parsed.data.cartItemId },
  });
  if (!cartItem || cartItem.userId !== session.userId) return;

  await prisma.cartItem.delete({ where: { id: parsed.data.cartItemId } });

  revalidatePath("/cart");
  revalidatePath("/dashboard");
}
