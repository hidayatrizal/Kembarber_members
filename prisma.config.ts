import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js memuat .env.local; pastikan Prisma CLI juga membacanya.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
