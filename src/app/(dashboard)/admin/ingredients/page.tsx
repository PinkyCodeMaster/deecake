"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Ingredient, Supplier } from "@/types"; // make sure Supplier type exists

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, Supplier>>({});

  useEffect(() => {
    // fetch suppliers
    fetch("/api/suppliers")
      .then(res => res.json())
      .then((data: Supplier[]) => {
        const suppliersMap: Record<string, Supplier> = {};
        data.forEach(s => { suppliersMap[s.id] = s; });
        setSuppliers(suppliersMap);
      })
      .catch(console.error);

    // fetch ingredients
    fetch("/api/ingredients")
      .then(res => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ingredients</h1>
        <Link href="/admin/ingredients/new">
          <Button>Add Ingredient</Button>
        </Link>
      </div>

      <Table>
        <TableCaption>A list of all your ingredients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Price/Unit</TableHead>
            <TableHead>Stock Qty</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell>
                <Link href={`/admin/ingredients/${ingredient.id}`} className="underline hover:text-blue-600">
                  {ingredient.name}
                </Link>
              </TableCell>
              <TableCell>{ingredient.unit}</TableCell>
              <TableCell>£{ingredient.pricePerUnit}</TableCell>
              <TableCell>{ingredient.stockQuantity}</TableCell>
              <TableCell>{ingredient.supplierId ? suppliers[ingredient.supplierId]?.name ?? "Unknown" : "None"}</TableCell>
              <TableCell>
                <Link href={`/admin/ingredients/${ingredient.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
