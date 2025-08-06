import { NextRequest, NextResponse } from "next/server";
import { ingredients } from "@/db/schema/ingredients";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supplierIngredients = await db
        .select()
        .from(ingredients)
        .where(eq(ingredients.supplierId, id));

    return NextResponse.json(supplierIngredients)
}
