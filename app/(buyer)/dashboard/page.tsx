import type { Metadata } from "next";
import { BuyerDashboardView } from "@/features/buyer/dashboard";

export const metadata: Metadata = {
  title: "Dashboard — AJS B2B Portal",
};

export default function DashboardPage() {
  return <BuyerDashboardView />;
}
