import type { Metadata } from "next";
import { CommoditiesView } from "@/features/public/commodities";

export const metadata: Metadata = {
  title: "Commodity Catalog — AJS",
  description:
    "Katalog komoditas laut PT Altisan Jaya Sinergi: grade, origin, dan ketersediaan stok terkini.",
};

export default function CommoditiesPage() {
  return <CommoditiesView />;
}
