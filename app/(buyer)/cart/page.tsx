import type { Metadata } from "next";
import { CartView } from "@/features/buyer/cart";

export const metadata: Metadata = {
  title: "Cart — AJS B2B Portal",
};

export default function CartPage() {
  return <CartView />;
}
