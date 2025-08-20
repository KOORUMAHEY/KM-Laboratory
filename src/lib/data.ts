
import 'server-only';
import { db } from './db';
import { labCategories as labCategoriesSchema, labExperiments as labExperimentsSchema, labCodes as labCodesSchema, labLinks as labLinksSchema } from './db/schema';
import type { LabCategory, LabExperiment } from '@/data/types';
import { eq } from 'drizzle-orm';
import { labCategories, experiments, codeSnippets, links } from '@/data/labs';

// These functions will now prioritize fetching from the DB if it's available.

export async function getLabCategories(): Promise<LabCategory[]> {
  if (!db) {
    console.log("Database not configured. Using mock lab categories.");
    return Promise.resolve(labCategories);
  }
  
  const data = await db.select().from(labCategoriesSchema);
  // If the database is empty, seed it with initial data.
  if (!data.length) {
    console.log("Seeding lab categories in the database.");
    await db.insert(labCategoriesSchema).values(labCategories);
    return db.select().from(labCategoriesSchema);
  }
  return data;
}

export async function getLabExperiments(categoryId?: string): Promise<LabExperiment[]> {
  if (!db) {
      console.log("Database not configured. Using mock lab experiments.");
      const filteredExperiments = categoryId ? experiments.filter(e => e.categoryId === categoryId) : experiments;
      return Promise.resolve(filteredExperiments.map(e => ({...e} as LabExperiment)));
  }

  // Seed experiments if the table is empty
  const existingExperiments = await db.select({ id: labExperimentsSchema.id }).from(labExperimentsSchema).limit(1);
  if (existingExperiments.length === 0) {
      console.log("Seeding lab experiments in the database.");
      // @ts-ignore
      await db.insert(labExperimentsSchema).values(experiments);
      // Also seed snippets and links
      if (codeSnippets.length > 0) {
        await db.insert(labCodesSchema).values(codeSnippets).onConflictDoNothing();
      }
      if (links.length > 0) {
        await db.insert(labLinksSchema).values(links).onConflictDoNothing();
      }
  }
  
  if (categoryId) {
      // @ts-ignore
      return db.select().from(labExperimentsSchema).where(eq(labExperimentsSchema.categoryId, categoryId));
  }
  
  // @ts-ignore
  return db.select().from(labExperimentsSchema);
}


export async function getLabExperimentById(id: string): Promise<LabExperiment | undefined> {
    if (!db) {
        console.log(`Database not configured. Using mock lab experiment for id: ${id}`);
        const experiment = experiments.find(e => e.id === id);
        if (!experiment) return undefined;
        
        const codes = codeSnippets.filter(c => c.experimentId === id);
        const associatedLinks = links.filter(l => l.experimentId === id);

        return Promise.resolve({
            ...experiment,
            codes: codes,
            links: associatedLinks,
        } as LabExperiment);
    }

    const experimentData = await db.select().from(labExperimentsSchema).where(eq(labExperimentsSchema.id, id));
    if (!experimentData.length) {
      return undefined;
    }
    const experiment = experimentData[0];
    const codesData = await db.select().from(labCodesSchema).where(eq(labCodesSchema.experimentId, id));
    const linksData = await db.select().from(labLinksSchema).where(eq(labLinksSchema.experimentId, id));

    return Promise.resolve({
      ...experiment,
      codes: codesData,
      links: linksData,
    } as LabExperiment);
}

export async function getLabCategoryById(id: string): Promise<LabCategory | undefined> {
   if (!db) {
       console.log(`Database not configured. Using mock lab category for id: ${id}`);
       return Promise.resolve(labCategories.find(c => c.id === id));
   }
   
   const data = await db.select().from(labCategoriesSchema).where(eq(labCategoriesSchema.id, id));
   return data[0];
}
