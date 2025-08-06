// src/types/index.ts

export interface Supplier {
    id: string;
    name: string;
    website?: string | null;  // optional since your schema allows null
    createdAt: string;         // ISO date string
}

export type Unit = 'mg' | 'g' | 'kg' | 'ml' | 'l' | 'pcs';

export interface Ingredient {
    id: string;
    name: string;
    supplierId?: string | null;   // optional because supplier can be null
    unit: Unit;
    pricePerUnit: string;         // numeric as string from DB
    stockQuantity: string;        // numeric as string from DB
    createdAt: string;
    updatedAt: string;
}

export interface Stock {
    id: string;
    ingredientId: string;
    quantity: string;             // numeric as string from DB
    createdAt: string;
}
