import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { CommodityDetailView } from "@/features/public/commodities";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: "Produk tidak ditemukan — AJS" };
  }

  return {
    title: `${product.name} — AJS Commodity Catalog`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  return <CommodityDetailView slug={slug} />;
}
