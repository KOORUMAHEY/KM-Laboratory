
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { labCategories, experiments, codeSnippets, links } from '@/data/labs';

const placeholderDbUrl = 'postgresql://user:password@host:port/db?sslmode=require';

// Explicitly type db to allow it to be null
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let isSeeded = false;

// Helper function to seed data if necessary
async function seedDatabaseIfEmpty() {
    if (!db || isSeeded) return;

    try {
        const existingCategories = await db.select({ id: schema.labCategories.id }).from(schema.labCategories).limit(1);
        if (existingCategories.length === 0) {
            console.log("Seeding database with initial data...");
            await db.insert(schema.labCategories).values(labCategories);
            // @ts-ignore
            await db.insert(schema.labExperiments).values(experiments);
            if (codeSnippets.length > 0) {
                await db.insert(schema.labCodes).values(codeSnippets).onConflictDoNothing();
            }
            if (links.length > 0) {
                await db.insert(schema.labLinks).values(links).onConflictDoNothing();
            }
            console.log("Database seeding complete.");
        }
        isSeeded = true;
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
}


if (process.env.DATABASE_URL && process.env.DATABASE_URL !== placeholderDbUrl) {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        db = drizzle(sql, { schema });
        // Asynchronously seed the database without blocking the initialization
        seedDatabaseIfEmpty().catch(err => console.error("Async seeding failed:", err));

    } catch (error) {
        console.error("Failed to initialize database connection:", error);
        db = null; // Ensure db is null if connection fails
    }
} else {
    console.warn("DATABASE_URL is not set or is set to the placeholder value. Using mock data.");
}

export { db };
