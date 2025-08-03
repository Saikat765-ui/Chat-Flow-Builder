import { defineConfig } from "drizzle-kit";

let dbUrl = process.env.RENDER_DATABASE_URL;

if (!dbUrl) {
  throw new Error("RENDER_DATABASE_URL must be set. Please ensure the database is provisioned");
}

// Ensure SSL parameters are in the URL
if (!dbUrl.includes('sslmode=')) {
  dbUrl += '?sslmode=require';
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl
  },
  // Don't make any destructive changes
  strict: true,
  verbose: true
});
