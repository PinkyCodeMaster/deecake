import { NextRequest, NextResponse } from "next/server";
import { stock } from "@/db/schema/stock";
import { eq } from "drizzle-orm";
import { db } from "@/db";

// GET handler
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [item] = await db.select().from(stock).where(eq(stock.id, id));
        if (!item) return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        return NextResponse.json(item);
    } catch {
        return NextResponse.json({ error: "Failed to fetch stock" }, { status: 500 });
    }
}

// PATCH handler
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { quantity } = await req.json();

        if (quantity == null) {
            return NextResponse.json({ error: "Quantity is required" }, { status: 400 });
        }

        const [updated] = await db
            .update(stock)
            .set({ quantity })
            .where(eq(stock.id, id))
            .returning();

        if (!updated) return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch {
        return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
    }
}

// DELETE handler
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const [deleted] = await db.delete(stock).where(eq(stock.id, id)).returning();
        if (!deleted) return NextResponse.json({ error: "Stock not found" }, { status: 404 });
        return NextResponse.json({ message: "Stock deleted successfully" });
    } catch {
        return NextResponse.json({ error: "Failed to delete stock" }, { status: 500 });
    }
}
