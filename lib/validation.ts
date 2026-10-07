import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity harus lebih dari 0"),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity harus lebih dari 0"),
});

export const removeFromCartSchema = z.object({
  cartItemId: z.string().min(1),
});

// --- Admin actions ---

export const orderActionSchema = z.object({
  orderId: z.string().min(1),
});

export const updateStockSchema = z.object({
  productId: z.string().min(1),
  availableQty: z.coerce
    .number()
    .min(0, "Available quantity tidak boleh negatif"),
  moq: z.coerce.number().positive("MOQ harus lebih dari 0"),
  stockStatus: z.enum(["AVAILABLE", "RESERVED", "UNAVAILABLE"]),
});
