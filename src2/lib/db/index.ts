
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const placeholderDbUrl = 'postgresql://user:password@host:port/db?sslmode=require';

let db: ReturnType<typeof drizzle<typeof schema>>;

if (process.env.DATABASE_URL && process.env.DATABASE_URL !== placeholderDbUrl) {
    const sql = neon(process.env.DATABASE_URL!);
    db = drizzle(sql, { schema });
} else {
    console.warn("DATABASE_URL is not set or is set to the placeholder value. Using mock data.");
}

export { db };
