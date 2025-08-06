import { pgTable, uuid, numeric, timestamp } from 'drizzle-orm/pg-core';
import { ingredients } from './ingredients';

export const stock = pgTable('stock', {
  id: uuid('id').defaultRandom().primaryKey(),
  ingredientId: uuid('ingredient_id').notNull().references(() => ingredients.id),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});