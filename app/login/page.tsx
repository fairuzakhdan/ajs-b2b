import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginView } from "@/features/auth/login";

export const metadata: Metadata = {
  title: "Login — AJS B2B Portal",
};

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // Best practice: user yang sudah punya session valid tidak perlu melihat
  // halaman login lagi — arahkan langsung ke area sesuai role-nya.
  const session = await getSession();
  if (session) {
    redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  const { redirectTo } = await searchParams;
  return <LoginView redirectTo={redirectTo} />;
}
