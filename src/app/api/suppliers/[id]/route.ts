import { NextRequest, NextResponse } from "next/server";
import { suppliers } from "@/db/schema/suppliers";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const supplier = await db
            .select()
            .from(suppliers)
            .where(eq(suppliers.id, id));

        if (!supplier.length) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        return NextResponse.json(supplier[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch supplier" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const { name, website } = await req.json();

        const updated = await db
            .update(suppliers)
            .set({ name, website })
            .where(eq(suppliers.id, id))
            .returning();

        if (!updated.length) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        return NextResponse.json(updated[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const deleted = await db
            .delete(suppliers)
            .where(eq(suppliers.id, id))
            .returning();

        if (!deleted.length) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        return NextResponse.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
    }
}
