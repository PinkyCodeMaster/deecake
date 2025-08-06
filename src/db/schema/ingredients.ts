import { pgTable, text, uuid, numeric, timestamp, pgEnum, } from 'drizzle-orm/pg-core';
import { suppliers } from './suppliers';

export const unitEnum = pgEnum('unit', ['mg', 'g', 'kg', 'ml', 'l', 'pcs']);

export const ingredients = pgTable('ingredients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  supplierId: uuid('supplier_id').references(() => suppliers.id, { onDelete: 'set null' }),
  unit: unitEnum('unit').notNull(),
  pricePerUnit: numeric('price_per_unit', { precision: 10, scale: 2 }).notNull(),
  stockQuantity: numeric('stock_quantity', { precision: 10, scale: 3 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
