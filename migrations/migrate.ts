import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function dropTables(pool: pkg.Pool) {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS flow_nodes CASCADE;
      DROP TABLE IF EXISTS flows CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('Existing tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

async function runMigrations() {
  let dbUrl = process.env.RENDER_DATABASE_URL;

  if (!dbUrl) {
    throw new Error('Database URL not found');
  }

  // Ensure SSL parameters are in the URL
  if (!dbUrl.includes('sslmode=')) {
    dbUrl += '?sslmode=require';
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const db = drizzle(pool, { schema });

  try {
    // Drop existing tables first
    await dropTables(pool);
    
    // Then run migrations
    await migrate(db, {
      migrationsFolder: './migrations',
    });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations().catch(console.error);
