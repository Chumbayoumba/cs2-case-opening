import { pgTable, serial, varchar, text, decimal, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  balance: decimal('balance', { precision: 10, scale: 2 }).default('0').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Cases table
export const cases = pgTable('cases', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Items table
export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  rarity: varchar('rarity', { length: 20 }).notNull(), // common, rare, epic, legendary
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// CaseItems table (many-to-many)
export const caseItems = pgTable('case_items', {
  id: serial('id').primaryKey(),
  caseId: integer('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  dropRate: decimal('drop_rate', { precision: 5, scale: 2 }).notNull(), // 0.01-100.00
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// UserInventory table
export const userInventory = pgTable('user_inventory', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  acquiredAt: timestamp('acquired_at').defaultNow().notNull(),
  isSold: boolean('is_sold').default(false).notNull(),
});

// CaseOpenings table (history)
export const caseOpenings = pgTable('case_openings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  caseId: integer('case_id').notNull().references(() => cases.id, { onDelete: 'cascade' }),
  itemId: integer('item_id').notNull().references(() => items.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
