"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginActionResult } from "@/app/actions/auth";

const initialState: LoginActionResult = {};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, isPending] = useActionState(
    login,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="nama@perusahaan.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-blue-800 text-white font-semibold px-4 py-2.5 hover:bg-blue-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Memproses..." : "Login"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <Link href="/" className="text-blue-800 hover:underline">
          Hubungi tim AJS
        </Link>
      </p>
    </form>
  );
}
