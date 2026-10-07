import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prisma Client singleton — mencegah pembuatan koneksi baru tiap hot-reload
// di development (Next.js App Router). Lihat:
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
//
// Prisma 7 mewajibkan driver adapter (tidak ada lagi "built-in engine"
// otomatis dari datasource url di schema).
//
// Memakai adapter libSQL untuk lokal maupun produksi:
//  - Lokal: DATABASE_URL="file:./prisma/dev.db" (tanpa auth token)
//  - Produksi (Turso): DATABASE_URL="libsql://<db>.turso.io"
//    + DATABASE_AUTH_TOKEN="<token>"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
