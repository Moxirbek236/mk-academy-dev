import "dotenv/config";
import { defineConfig } from "prisma/config";
const isRenderRuntime = Boolean(process.env["RENDER"]) || process.env["NODE_ENV"] === "production";
const fallbackUrl = isRenderRuntime ? "file:/tmp/mk-academy.db" : "file:./prisma/dev.db";
const databaseUrl = process.env["DATABASE_URL"] ?? fallbackUrl;

if (!process.env["DATABASE_URL"]) {
  console.warn(
    `DATABASE_URL is not set. Falling back to ${fallbackUrl} for Prisma generate.`,
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
