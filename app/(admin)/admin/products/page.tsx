import type { Metadata } from "next";
import { AdminProductsView } from "@/features/admin/products";

export const metadata: Metadata = {
  title: "Products & Stock — AJS Admin",
};

export default function AdminProductsPage() {
  return <AdminProductsView />;
}
