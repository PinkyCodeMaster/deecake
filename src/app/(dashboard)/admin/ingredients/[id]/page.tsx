"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ingredient } from "@/types";

export default function IngredientDetailPage() {
    const { id } = useParams();
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/ingredients/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setIngredient(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch ingredient", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
            </div>
        );
    }

    if (!ingredient) {
        return (
            <div className="p-6">
                <p className="text-red-500">Ingredient not found.</p>
                <Link href="/admin/ingredients">
                    <Button variant="outline" className="mt-4">Back to Ingredients</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Ingredient Details</h1>
                <Link href="/admin/ingredients">
                    <Button variant="outline">Back to Ingredients</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{ingredient.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Unit:</strong> {ingredient.unit}</p>
                    <p><strong>Price per Unit:</strong> £{ingredient.pricePerUnit}</p>
                    <p><strong>Stock Quantity:</strong> {ingredient.stockQuantity}</p>
                    <p><strong>Supplier ID:</strong> {ingredient.supplierId ?? "None"}</p>
                </CardContent>
            </Card>
        </div>
    );
}
