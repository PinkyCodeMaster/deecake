import { NextRequest, NextResponse } from "next/server";
import { ingredients } from "@/db/schema/ingredients";
import { db } from "@/db";

export async function GET() {
    try {
        const allIngredients = await db.select().from(ingredients);
        return NextResponse.json(allIngredients);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, supplierId, unit, pricePerUnit, stockQuantity } = body;

        if (!name || !supplierId || !unit || !pricePerUnit || !stockQuantity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newIngredient = await db.insert(ingredients).values({ name, supplierId, unit, pricePerUnit, stockQuantity, }).returning();

        return NextResponse.json(newIngredient[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create ingredient" }, { status: 500 });
    }
}
