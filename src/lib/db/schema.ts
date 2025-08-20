import { pgTable, text, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

export const labCategories = pgTable('lab_categories', {
  id: text('id').primaryKey(), // e.g., 'wtcn', 'cpp'
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
});

export const labExperiments = pgTable('lab_experiments', {
  id: text('id').primaryKey(), // e.g., 'cpp-01', 'wtcn-01'
  categoryId: text('category_id').notNull().references(() => labCategories.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('Not Started'),
  difficulty: varchar('difficulty', { length: 50 }).default('Medium'),
  duration: varchar('duration', { length: 50 }).default('1 hr'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const labCodes = pgTable('lab_codes', {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id').notNull().references(() => labExperiments.id, { onDelete: 'cascade' }),
    language: varchar('language', { length: 50 }).default('bash').notNull(),
    code: text('code').notNull(),
    description: text('description'),
});

export const labLinks = pgTable('lab_links', {
    id: text('id').primaryKey(),
    experimentId: text('experiment_id').notNull().references(() => labExperiments.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    url: text('url').notNull(),
});
