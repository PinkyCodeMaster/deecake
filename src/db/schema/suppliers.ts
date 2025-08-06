import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const suppliers = pgTable('suppliers', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    website: text('website'), // changed from email & phone
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
