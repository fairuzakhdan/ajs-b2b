import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { RequestOrderForm } from "@/features/public/commodities";

const stockStatusLabel: Record<string, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  UNAVAILABLE: "Unavailable",
};

const stockStatusClass: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  RESERVED: "bg-amber-100 text-amber-700",
  UNAVAILABLE: "bg-slate-200 text-slate-600",
};

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

  const [product, session] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    getSession(),
  ]);

  if (!product) {
    notFound();
  }

  const canRequestOrder =
    product.stockStatus === "AVAILABLE" && product.availableQty > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/commodities"
        className="text-sm text-slate-500 hover:text-blue-800 transition-colors"
      >
        ← Kembali ke Commodity Catalog
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${stockStatusClass[product.stockStatus]}`}
          >
            {stockStatusLabel[product.stockStatus]}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-slate-600">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 p-4">
            <div>
              <dt className="text-xs text-slate-500">Grade</dt>
              <dd className="font-semibold text-slate-900">
                {product.grade}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Origin</dt>
              <dd className="font-semibold text-slate-900">
                {product.origin}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Condition</dt>
              <dd className="font-semibold text-slate-900">
                {product.condition}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Available Quantity</dt>
              <dd className="font-semibold text-slate-900">
                {product.availableQty} KG
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-slate-500">Minimum Order Quantity (MOQ)</dt>
              <dd className="font-semibold text-slate-900">
                {product.moq} KG
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3">
            {!canRequestOrder ? (
              <button
                disabled
                className="inline-flex items-center justify-center rounded-md bg-slate-200 text-slate-500 font-semibold px-6 py-3 cursor-not-allowed"
              >
                Stok Tidak Tersedia
              </button>
            ) : !session ? (
              <Link
                href={`/login?redirectTo=/commodities/${product.slug}`}
                className="inline-flex items-center justify-center rounded-md bg-blue-800 text-white font-semibold px-6 py-3 hover:bg-blue-900 transition-colors"
              >
                Login untuk Request Order
              </Link>
            ) : session.role === "BUYER" ? (
              <RequestOrderForm
                productId={product.id}
                moq={product.moq}
                availableQty={product.availableQty}
              />
            ) : (
              <p className="text-sm text-slate-500 rounded-md bg-slate-50 border border-slate-200 px-4 py-3">
                Masuk sebagai admin — Request Order hanya tersedia untuk akun
                buyer.
              </p>
            )}
            <p className="text-xs text-slate-500">
              Request Order akan diproses sebagai permintaan dan masih
              memerlukan konfirmasi dari tim AJS sebelum menjadi pesanan
              final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
