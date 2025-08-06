'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Supplier } from '@/types'

export default function AddIngredientPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [unit, setUnit] = useState('')
    const [pricePerUnit, setPricePerUnit] = useState('')
    const [stockQuantity, setStockQuantity] = useState('')
    const [supplierId, setSupplierId] = useState<string | null>(null)
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/api/suppliers')
            .then((res) => res.json())
            .then(setSuppliers)
            .catch((err) => console.error('Failed to load suppliers', err))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/ingredients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                unit,
                pricePerUnit: parseFloat(pricePerUnit),
                stockQuantity: parseFloat(stockQuantity),
                supplierId: supplierId || null,
            }),
        })

        setLoading(false)

        if (res.ok) {
            router.push('/admin/ingredients')
        } else {
            alert('Failed to add ingredient')
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add Ingredient</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
                </div>

                <div>
                    <Label htmlFor="price">Price Per Unit (£)</Label>
                    <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                        id="stock"
                        type="number"
                        min="0"
                        step="0.01"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <Label>Supplier</Label>
                    <Select onValueChange={(val) => setSupplierId(val)} value={supplierId ?? ''}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a supplier (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            {suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
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
                        {loading ? 'Saving...' : 'Save Ingredient'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
