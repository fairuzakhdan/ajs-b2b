import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- 4 produk dummy sesuai brief ---
  const products = [
    {
      name: "Cakalang / Skipjack Tuna",
      slug: "cakalang-skipjack-tuna",
      origin: "Muara Baru",
      grade: "A",
      condition: "Frozen",
      description:
        "Cakalang segar hasil tangkapan nelayan lokal, diproses dan dibekukan di fasilitas Muara Baru untuk menjaga kualitas dan kesegaran.",
      imageUrl: "/products/cakalang.jpg",
      availableQty: 850,
      moq: 100,
    },
    {
      name: "Deho",
      slug: "deho",
      origin: "Muara Baru",
      grade: "A",
      condition: "Frozen",
      description:
        "Ikan Deho grade A, dibekukan segar dari hub Muara Baru. Cocok untuk kebutuhan olahan dan ekspor.",
      imageUrl: "/products/deho.jpeg",
      availableQty: 1200,
      moq: 100,
    },
    {
      name: "Tuna Fillet",
      slug: "tuna-fillet",
      origin: "Partner Supply",
      grade: "Premium",
      condition: "Frozen",
      description:
        "Tuna fillet premium dari jaringan partner supply AJS, dipotong dan dibekukan dengan standar kualitas tinggi.",
      imageUrl: "/products/tuna.jpeg",
      availableQty: 350,
      moq: 50,
    },
    {
      name: "Kerapu / Grouper",
      slug: "kerapu-grouper",
      origin: "Muara Baru",
      grade: "A",
      condition: "Frozen",
      description:
        "Kerapu grade A dari Muara Baru, dibekukan utuh untuk menjaga tekstur dan kesegaran daging.",
      imageUrl: "/products/kerapu.jpg",
      availableQty: 180,
      moq: 25,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  // --- 1 akun buyer + 1 akun admin ---
  const buyerPasswordHash = await bcrypt.hash("buyer123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "buyer@demo.ajs.com" },
    update: {},
    create: {
      email: "buyer@demo.ajs.com",
      passwordHash: buyerPasswordHash,
      name: "Budi Santoso",
      companyName: "PT Mitra Pangan Nusantara",
      role: "BUYER",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@ajs.com" },
    update: {},
    create: {
      email: "admin@ajs.com",
      passwordHash: adminPasswordHash,
      name: "Admin AJS",
      role: "ADMIN",
    },
  });

  console.log("Seed selesai:");
  console.log(`  - ${products.length} produk`);
  console.log("  - 1 akun buyer: buyer@demo.ajs.com / buyer123");
  console.log("  - 1 akun admin: admin@ajs.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
