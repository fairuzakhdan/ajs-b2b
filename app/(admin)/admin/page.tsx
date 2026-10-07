import type { Metadata } from "next";
import { AdminOrdersView } from "@/features/admin/orders";

export const metadata: Metadata = {
  title: "Order Requests — AJS Admin",
};

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status } = await searchParams;
  return <AdminOrdersView status={status} />;
}
