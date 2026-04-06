import "dotenv/config";
import { defineConfig } from "prisma/config";
const databaseUrl = process.env["DATABASE_URL"] ?? "file:./prisma/dev.db";

if (!process.env["DATABASE_URL"]) {
  console.warn(
    "DATABASE_URL is not set. Falling back to file:./prisma/dev.db for Prisma generate.",
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
