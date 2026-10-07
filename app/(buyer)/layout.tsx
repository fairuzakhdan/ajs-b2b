import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { BuyerNav } from "@/features/buyer/dashboard";

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
      <BuyerNav />
      {children}
    </div>
  );
}
