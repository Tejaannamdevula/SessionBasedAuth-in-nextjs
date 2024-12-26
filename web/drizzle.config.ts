import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db-drizzle/migrations",
  schema: "./src/db-drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL! as string,
  },
  verbose: true,
  strict: true,
});
