import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminNav } from "@/features/admin";

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
      <AdminNav />
      {children}
    </div>
  );
}
