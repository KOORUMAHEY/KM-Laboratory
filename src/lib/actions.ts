
'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { labExperiments, labCodes, labLinks } from './db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'crypto';

// Helper function to generate a random ID
const generateId = () => randomBytes(8).toString('hex');


// Validation Schemas
const LabDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  status: z.enum(['Not Started', 'In Progress', 'Completed', 'Stuck']),
});

const CodeSnippetSchema = z.object({
  language: z.string().min(1, 'Language is required.'),
  description: z.string().optional(),
  code: z.string().min(1, 'Code cannot be empty.'),
});

const LinkSchema = z.object({
    name: z.string().min(1, 'Link name is required.'),
    url: z.string().url('Must be a valid URL.'),
});


type FormState = {
  success: boolean;
  message: string;
  newId?: string;
};

export async function updateLabDetails(labId: string, formData: FormData): Promise<FormState> {
  const validatedFields = LabDetailsSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0] || "Validation failed.",
    };
  }

  try {
    await db.update(labExperiments)
      .set({
        ...validatedFields.data,
        updatedAt: new Date(),
      })
      .where(eq(labExperiments.id, labId));

    revalidatePath(`/lab/${labId}`);
    return { success: true, message: 'Lab details updated.' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Database Error: Failed to update lab details.' };
  }
}


export async function addCodeSnippet(experimentId: string, formData: FormData): Promise<FormState> {
    const validatedFields = CodeSnippetSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
          success: false,
          message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0] || "Validation failed.",
        };
    }

    const newId = `code-${generateId()}`;
    try {
        await db.insert(labCodes).values({
            id: newId,
            experimentId,
            ...validatedFields.data,
            description: validatedFields.data.description || null,
        });

        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Code snippet added.', newId };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to add snippet.' };
    }
}

export async function updateCodeSnippet(snippetId: string, experimentId: string, formData: FormData): Promise<FormState> {
    const validatedFields = CodeSnippetSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
          success: false,
          message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0] || "Validation failed.",
        };
    }

    try {
        await db.update(labCodes)
            .set({
                ...validatedFields.data,
                description: validatedFields.data.description || null,
            })
            .where(eq(labCodes.id, snippetId));
        
        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Snippet updated.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to update snippet.' };
    }
}


export async function deleteCodeSnippet(snippetId: string, experimentId: string): Promise<FormState> {
    try {
        await db.delete(labCodes).where(eq(labCodes.id, snippetId));
        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Snippet deleted.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to delete snippet.' };
    }
}

export async function addLink(experimentId: string, formData: FormData): Promise<FormState> {
    const validatedFields = LinkSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
          success: false,
          message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0] || "Validation failed.",
        };
    }
     
    const newId = `link-${generateId()}`;
    try {
        await db.insert(labLinks).values({
            id: newId,
            experimentId,
            ...validatedFields.data,
        });
        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Link added.', newId };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to add link.' };
    }
}

export async function updateLink(linkId: string, experimentId: string, formData: FormData): Promise<FormState> {
    const validatedFields = LinkSchema.safeParse(Object.fromEntries(formData.entries()));
     if (!validatedFields.success) {
        return {
          success: false,
          message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0] || "Validation failed.",
        };
    }
    
    try {
        await db.update(labLinks)
            .set(validatedFields.data)
            .where(eq(labLinks.id, linkId));
        
        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Link updated.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to update link.' };
    }
}


export async function deleteLink(linkId: string, experimentId: string): Promise<FormState> {
    try {
        await db.delete(labLinks).where(eq(labLinks.id, linkId));
        revalidatePath(`/lab/${experimentId}`);
        return { success: true, message: 'Link deleted.' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Database Error: Failed to delete link.' };
    }
}
