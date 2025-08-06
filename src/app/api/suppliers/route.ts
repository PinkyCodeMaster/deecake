import { NextRequest, NextResponse } from "next/server";
import { suppliers } from "@/db/schema/suppliers";
import { db } from "@/db";

export async function GET() {
    try {
        const allSuppliers = await db.select().from(suppliers);
        return NextResponse.json(allSuppliers);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, website } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const newSupplier = await db
            .insert(suppliers)
            .values({ name, website })
            .returning();

        return NextResponse.json(newSupplier[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
    }
}
