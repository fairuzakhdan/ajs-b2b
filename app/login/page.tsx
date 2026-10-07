import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login — AJS B2B Portal",
};

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Login ke B2B Portal
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Masuk untuk mengakses katalog, cart, dan status order request Anda.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <LoginForm redirectTo={redirectTo} />
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">Demo akun untuk reviewer:</p>
        <p>Buyer — buyer@demo.ajs.com / buyer123</p>
        <p>Admin — admin@ajs.com / admin123</p>
      </div>
    </div>
  );
}
