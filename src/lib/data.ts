
import 'server-only';
import { db } from './db';
import { labCategories as labCategoriesSchema, labExperiments as labExperimentsSchema, labCodes as labCodesSchema, labLinks as labLinksSchema } from './db/schema';
import type { LabCategory, LabExperiment } from '@/data/types';
import { eq } from 'drizzle-orm';
import { labCategories, experiments, codeSnippets, links } from '@/data/labs';


export async function getLabCategories(): Promise<LabCategory[]> {
  if (!db) {
    console.log("DB not configured. Using mock categories.");
    return Promise.resolve(labCategories);
  }
  return db.select().from(labCategoriesSchema);
}

export async function getLabExperiments(categoryId?: string): Promise<LabExperiment[]> {
    if (!db) {
        console.log(`DB not configured. Using mock experiments ${categoryId ? `for category ${categoryId}` : ''}.`);
        const filteredExperiments = categoryId ? experiments.filter(e => e.categoryId === categoryId) : experiments;
        // Return a deep copy to avoid mutation issues outside this scope
        return Promise.resolve(JSON.parse(JSON.stringify(filteredExperiments)));
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
        console.log(`DB not configured. Using mock experiment for id: ${id}`);
        const experiment = experiments.find(e => e.id === id);
        if (!experiment) return undefined;
        
        const codes = codeSnippets.filter(c => c.experimentId === id);
        const associatedLinks = links.filter(l => l.experimentId === id);

        return Promise.resolve(JSON.parse(JSON.stringify({
            ...experiment,
            codes: codes,
            links: associatedLinks,
        })));
    }

    const experimentData = await db.query.labExperiments.findFirst({
        where: eq(labExperimentsSchema.id, id),
        with: {
            codes: true,
            links: true,
        },
    });

    // @ts-ignore
    return experimentData;
}

export async function getLabCategoryById(id: string): Promise<LabCategory | undefined> {
   if (!db) {
       console.log(`DB not configured. Using mock category for id: ${id}`);
       return Promise.resolve(labCategories.find(c => c.id === id));
   }
   
   const data = await db.select().from(labCategoriesSchema).where(eq(labCategoriesSchema.id, id));
   return data[0];
}
