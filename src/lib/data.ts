// src/lib/data.ts
import 'server-only';
import type { LabCategory, LabExperiment } from '@/data/types';

// Use different URLs based on environment
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL_PRODUCTION;
  }
  
  // For development and build time
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

const API_URL = getApiUrl();

async function fetchData<T>(endpoint: string): Promise<T> {
  // Skip fetching during static generation if API server isn't available
  if (!API_URL) {
    console.warn('No API URL configured, skipping fetch for:', endpoint);
    // Return appropriate fallback based on endpoint
    if (endpoint === '/categories') return [] as T;
    if (endpoint === '/experiments' || endpoint.startsWith('/experiments?')) return [] as T;
    throw new Error(`No fallback available for endpoint: ${endpoint}`);
  }

  try {
    const fullUrl = `${API_URL}${endpoint}`;
    
    const res = await fetch(fullUrl, {
      next: { revalidate: 60 },
      // Add timeout to prevent hanging during build
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${endpoint}`);
    }

    const data = await res.json();
    
    if (!data) {
      throw new Error(`No data received from ${endpoint}`);
    }

    return data;
  } catch (error) {
    // During build time, log but don't fail hard for list endpoints
    const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL;
    
    if (isBuildTime && (endpoint === '/categories' || endpoint === '/experiments')) {
      console.warn(`Build-time fetch failed for ${endpoint}, using fallback`);
      return [] as T;
    }

    console.error(`API Request Failed: ${endpoint}`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: `${API_URL}${endpoint}`,
    });
    throw error;
  }
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
    if (!id) {
      throw new Error('Category ID is required');
    }
    
    const data = await fetchData<LabCategory>(`/categories/${id}`);
    return data;
  } catch (error) {
    console.error(`Failed to get category ${id}:`, error);
    return undefined;
  }
}