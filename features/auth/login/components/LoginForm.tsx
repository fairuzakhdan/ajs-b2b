"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { login } from "@/features/auth/login/actions/login";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/login/schemas/login.schema";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((data) => {
    setServerError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      if (redirectTo) formData.set("redirectTo", redirectTo);

      const result = await login(formData);
      // Jika sukses, server action me-redirect (tidak kembali ke sini).
      if (result?.error) setServerError(result.error);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="nama@perusahaan.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      {serverError && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
        className="w-full"
      >
        {isPending ? "Memproses..." : "Masuk"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/" className="font-medium text-[#1E3A8A] hover:underline">
          Hubungi tim AJS
        </Link>
      </p>
    </form>
  );
}
