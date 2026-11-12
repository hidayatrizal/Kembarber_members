import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function getDb(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum diatur. Salin .env.example menjadi .env.local dan isi koneksi Neon.",
    );
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: url });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
