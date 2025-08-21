// server/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from '@/lib/db'; // Reusing the db connection
import { labCategories, labExperiments, labCodes, labLinks } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors({ origin: 'http://localhost:3000' })); // Changed from 9002 to 3000
app.use(express.json());

// Helper function to generate a random ID
const generateId = (): string => randomBytes(8).toString('hex');

// --- Auth Route ---
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  if (!correctPassword) {
    return res.status(500).json({ message: 'Admin password not configured on server.' });
  }

  if (password === correctPassword) {
    // Sign a token that expires in 8 hours
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '8h' });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials.' });
});


// --- API Routes ---

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.select().from(labCategories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get a single category
app.get('/api/categories/:id', async (req, res) => {
  try {
    const category = await db.select().from(labCategories).where(eq(labCategories.id, req.params.id));
    if (category.length === 0) return res.status(404).json({ message: 'Category not found' });
    res.json(category[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

// Get experiments (optionally by category)
app.get('/api/experiments', async (req, res) => {
  try {
    const { categoryId } = req.query;
    let query = db.select().from(labExperiments);
    if (categoryId) {
      query = query.where(eq(labExperiments.categoryId, categoryId as string));
    }
    const experiments = await query;
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch experiments' });
  }
});

// Get a single experiment with details
app.get('/api/experiments/:id', async (req, res) => {
  try {
    const experimentData = await db.select().from(labExperiments).where(eq(labExperiments.id, req.params.id));
    if (!experimentData.length) return res.status(404).json({ message: 'Experiment not found' });
    
    const codesData = await db.select().from(labCodes).where(eq(labCodes.experimentId, req.params.id));
    const linksData = await db.select().from(labLinks).where(eq(labLinks.experimentId, req.params.id));

    res.json({ ...experimentData[0], codes: codesData, links: linksData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch experiment' });
  }
});

// Update lab details
app.post('/api/experiments/:id', async (req, res) => {
  try {
    await db.update(labExperiments)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(labExperiments.id, req.params.id));
    res.json({ success: true, message: 'Lab details updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database Error: Failed to update lab details.' });
  }
});

// Add a code snippet
app.post('/api/experiments/:experimentId/snippets', async (req, res) => {
  const newId = `code-${generateId()}`;
  try {
    await db.insert(labCodes).values({
        id: newId,
        experimentId: req.params.experimentId,
        ...req.body,
    });
    res.status(201).json({ success: true, message: 'Code snippet added.', newId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database Error: Failed to add snippet.' });
  }
});

// Update a code snippet
app.put('/api/snippets/:snippetId', async (req, res) => {
    try {
        await db.update(labCodes)
            .set(req.body)
            .where(eq(labCodes.id, req.params.snippetId));
        res.json({ success: true, message: 'Snippet updated.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Error: Failed to update snippet.' });
    }
});

// Delete a code snippet
app.delete('/api/snippets/:snippetId', async (req, res) => {
    try {
        await db.delete(labCodes).where(eq(labCodes.id, req.params.snippetId));
        res.json({ success: true, message: 'Snippet deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Error: Failed to delete snippet.' });
    }
});

// Add a link
app.post('/api/experiments/:experimentId/links', async (req, res) => {
    const newId = `link-${generateId()}`;
    try {
        await db.insert(labLinks).values({
            id: newId,
            experimentId: req.params.experimentId,
            ...req.body,
        });
        res.status(201).json({ success: true, message: 'Link added.', newId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Error: Failed to add link.' });
    }
});

// Update a link
app.put('/api/links/:linkId', async (req, res) => {
    try {
        await db.update(labLinks).set(req.body).where(eq(labLinks.id, req.params.linkId));
        res.json({ success: true, message: 'Link updated.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Error: Failed to update link.' });
    }
});

// Delete a link
app.delete('/api/links/:linkId', async (req, res) => {
    try {
        await db.delete(labLinks).where(eq(labLinks.id, req.params.linkId));
        res.json({ success: true, message: 'Link deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database Error: Failed to delete link.' });
    }
});


app.listen(PORT, () => {
  console.log(`🚀 Express API server running at http://localhost:${PORT}`);
});