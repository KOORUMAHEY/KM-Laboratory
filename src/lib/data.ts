// src/lib/data.ts
import 'server-only';
import type { LabCategory, LabExperiment } from '@/data/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    // Revalidate data every 60 seconds
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return res.json();
}

export async function getLabCategories(): Promise<LabCategory[]> {
  return fetchData('/categories');
}

export async function getLabExperiments(categoryId?: string): Promise<LabExperiment[]> {
  const endpoint = categoryId ? `/experiments?categoryId=${categoryId}` : '/experiments';
  return fetchData(endpoint);
}

export async function getLabExperimentById(id: string): Promise<LabExperiment | undefined> {
  try {
    return await fetchData(`/experiments/${id}`);
  } catch (error) {
    console.error(`Failed to get experiment ${id}`, error);
    return undefined;
  }
}

export async function getLabCategoryById(id: string): Promise<LabCategory | undefined> {
  try {
    return await fetchData(`/categories/${id}`);
  } catch (error) {
    console.error(`Failed to get category ${id}`, error);
    return undefined;
  }
}