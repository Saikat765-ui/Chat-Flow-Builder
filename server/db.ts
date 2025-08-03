import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { config } from './config';

if (!config.databaseUrl) {
  throw new Error(
    "Database URL must be set. Please provide RENDER_DATABASE_URL or DATABASE_URL.",
  );
}

// Ensure SSL parameters are in the URL
let connectionUrl = config.databaseUrl;
if (!connectionUrl.includes('sslmode=')) {
  connectionUrl += '?sslmode=require';
}

export const pool = new Pool({ 
  connectionString: connectionUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });