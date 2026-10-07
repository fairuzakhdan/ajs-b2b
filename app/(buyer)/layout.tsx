import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard kedua di level layout (defense in depth) — middleware sudah
  // menangani redirect di awal request, tapi Server Component tetap
  // memvalidasi ulang sebelum merender data sensitif buyer.
  const session = await getSession();
  if (!session || session.role !== "BUYER") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center gap-6 border-b border-slate-200 pb-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/cart"
          className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
        >
          Cart
        </Link>
        <Link
          href="/orders"
          className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
        >
          Order Request
        </Link>
      </div>
      {children}
    </div>
  );
}
