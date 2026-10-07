import type { Metadata } from "next";
import { AdminOrderDetailView } from "@/features/admin/orders";

export const metadata: Metadata = {
  title: "Order Detail — AJS Admin",
};

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  return <AdminOrderDetailView id={id} />;
}
