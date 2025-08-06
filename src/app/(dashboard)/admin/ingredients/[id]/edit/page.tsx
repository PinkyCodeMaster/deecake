"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ingredient, Supplier, Unit } from "@/types";

const UNITS: Unit[] = ["mg", "g", "kg", "ml", "l", "pcs"];

export default function EditIngredientPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch ingredient by ID
        fetch(`/api/ingredients/${id}`)
            .then(res => res.json())
            .then(setIngredient)
            .catch(console.error);

        // Fetch all suppliers
        fetch("/api/suppliers")
            .then(res => res.json())
            .then(setSuppliers)
            .catch(console.error);
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ingredient) return;

        setLoading(true);

        const res = await fetch(`/api/ingredients/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ingredient),
        });

        setLoading(false);

        if (res.ok) {
            router.push("/admin/ingredients");
        } else {
            alert("Failed to update ingredient");
        }
    };

    if (!ingredient) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Ingredient</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={ingredient.name}
                        onChange={(e) => setIngredient({ ...ingredient, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                        value={ingredient.unit}
                        onValueChange={(value) => setIngredient({ ...ingredient, unit: value as Unit })}
                    >
                        <SelectTrigger id="unit">
                            <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                    {unit}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="pricePerUnit">Price per Unit (£)</Label>
                    <Input
                        id="pricePerUnit"
                        type="number"
                        step="0.01"
                        value={ingredient.pricePerUnit}
                        onChange={(e) => setIngredient({ ...ingredient, pricePerUnit: parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                        id="stockQuantity"
                        type="number"
                        step="0.001"
                        value={ingredient.stockQuantity}
                        onChange={(e) => setIngredient({ ...ingredient, stockQuantity: parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="supplierId">Supplier</Label>
                    <Select
                        value={ingredient.supplierId ?? ""}
                        onValueChange={(value) => setIngredient({ ...ingredient, supplierId: value || null })}
                    >
                        <SelectTrigger id="supplierId">
                            <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
