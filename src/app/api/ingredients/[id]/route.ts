import { NextRequest, NextResponse } from "next/server";
import { ingredients } from "@/db/schema/ingredients";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const [ingredient] = await db
            .select()
            .from(ingredients)
            .where(eq(ingredients.id, id));

        if (!ingredient) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        return NextResponse.json(ingredient);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch ingredient" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const body = await req.json();
    const { id } = await context.params;
    const { name, supplierId, unit, pricePerUnit, stockQuantity } = body;

    try {
        const updateData = { name, supplierId, unit, pricePerUnit, stockQuantity, };

        Object.keys(updateData).forEach(
            (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
        );

        const updated = await db
            .update(ingredients)
            .set(updateData)
            .where(eq(ingredients.id, id))
            .returning();

        if (updated.length === 0) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    try {
        const deleted = await db.delete(ingredients).where(eq(ingredients.id, id)).returning();

        if (deleted.length === 0) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Ingredient deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete ingredient" }, { status: 500 });
    }
}
