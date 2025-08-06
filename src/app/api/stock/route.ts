import { NextRequest, NextResponse } from "next/server";
import { stock } from "@/db/schema/stock";
import { db } from "@/db";

export async function GET() {
    try {
        const allStock = await db.select().from(stock);
        return NextResponse.json(allStock);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ingredientId, quantity } = body;

        if (!ingredientId || quantity == null) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newStock = await db
            .insert(stock)
            .values({
                ingredientId,
                quantity,
            })
            .returning();

        return NextResponse.json(newStock[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create stock entry" }, { status: 500 });
    }
}
