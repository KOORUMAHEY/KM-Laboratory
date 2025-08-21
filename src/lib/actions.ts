// src/lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Validation Schemas remain the same
const LabDetailsSchema = z.object({ /* ... */ });
const CodeSnippetSchema = z.object({ /* ... */ });
const LinkSchema = z.object({ /* ... */ });

type FormState = {
  success: boolean;
  message: string;
  newId?: string;
};

// Helper for making API calls
async function mutateData(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', body?: any): Promise<FormState> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, message: result.message || 'API Error' };
    }
    return { ...result, success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Network Error: Failed to communicate with the API.' };
  }
}

// All functions are now wrappers around `mutateData`
export async function updateLabDetails(labId: string, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries());
    const result = await mutateData(`/experiments/${labId}`, 'POST', data);
    if (result.success) revalidatePath(`/lab/${labId}`);
    return result;
}

export async function addCodeSnippet(experimentId: string, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries());
    const result = await mutateData(`/experiments/${experimentId}/snippets`, 'POST', data);
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}

export async function updateCodeSnippet(snippetId: string, experimentId: string, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries());
    const result = await mutateData(`/snippets/${snippetId}`, 'PUT', data);
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}

export async function deleteCodeSnippet(snippetId: string, experimentId: string): Promise<FormState> {
    const result = await mutateData(`/snippets/${snippetId}`, 'DELETE');
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}

export async function addLink(experimentId: string, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries());
    const result = await mutateData(`/experiments/${experimentId}/links`, 'POST', data);
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}

export async function updateLink(linkId: string, experimentId: string, formData: FormData): Promise<FormState> {
    const data = Object.fromEntries(formData.entries());
    const result = await mutateData(`/links/${linkId}`, 'PUT', data);
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}

export async function deleteLink(linkId: string, experimentId: string): Promise<FormState> {
    const result = await mutateData(`/links/${linkId}`, 'DELETE');
    if (result.success) revalidatePath(`/lab/${experimentId}`);
    return result;
}