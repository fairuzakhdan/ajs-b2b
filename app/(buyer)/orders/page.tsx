import type { Metadata } from "next";
import { OrdersView } from "@/features/buyer/orders";

export const metadata: Metadata = {
  title: "Order Request — AJS B2B Portal",
};

export default function OrdersPage() {
  return <OrdersView />;
}
