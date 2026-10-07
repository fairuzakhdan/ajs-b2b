"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  createSession,
  destroySession,
  verifyPassword,
} from "@/lib/session";
import { loginSchema } from "@/features/auth/login/schemas/login.schema";
import type { LoginActionResult } from "@/features/auth/login/types";

export async function login(formData: FormData): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Pesan generik supaya tidak membocorkan apakah email terdaftar atau tidak.
  if (!user) {
    return { error: "Email atau password salah" };
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: "Email atau password salah" };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  // Cegah open-redirect: hanya terima path internal relatif.
  const redirectTo = formData.get("redirectTo");
  if (
    typeof redirectTo === "string" &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    redirect(redirectTo);
  }

  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
