import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard kedua di level layout (defense in depth) — middleware sudah
  // menangani redirect di awal request, tapi Server Component tetap
  // memvalidasi ulang sebelum merender data sensitif admin.
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center gap-6 border-b border-slate-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-800">
          Admin
        </span>
        <Link
          href="/admin"
          className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
        >
          Order Requests
        </Link>
        <Link
          href="/admin/products"
          className="text-sm font-medium text-slate-700 hover:text-blue-800 transition-colors"
        >
          Products &amp; Stock
        </Link>
      </div>
      {children}
    </div>
  );
}
