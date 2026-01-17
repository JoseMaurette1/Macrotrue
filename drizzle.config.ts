import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "drizzle-kit";

// Load .env.local explicitly
config({ path: resolve("./.env.local") });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  introspect: {
    casing: "preserve",
  },
});
