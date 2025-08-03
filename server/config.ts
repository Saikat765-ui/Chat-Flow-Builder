import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

export const config = {
  port: process.env.PORT || 5000,
  host: process.env.HOST || '0.0.0.0',
  databaseUrl: process.env.RENDER_DATABASE_URL || process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development'
};
