'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Supplier, Ingredient } from '@/types'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { use } from 'react'

interface SupplierPageProps {
  params: Promise<{ id: string }>
}

export default function SupplierPage({ params }: SupplierPageProps) {
  const { id } = use(params)
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ingredientsLoading, setIngredientsLoading] = useState(true)

  // Fetch supplier
  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await fetch(`/api/suppliers/${id}`)
        if (!res.ok) throw new Error('Failed to fetch supplier')
        const data: Supplier = await res.json()
        setSupplier(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  // Fetch ingredients for this supplier
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await fetch(`/api/suppliers/${id}/ingredients`)
        if (!res.ok) throw new Error('Failed to fetch ingredients')
        const data: Ingredient[] = await res.json()
        setIngredients(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unknown error')
        }
      } finally {
        setIngredientsLoading(false)
      }
    }

    fetchIngredients()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    )
  }

  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!supplier) return <div>No supplier found</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{supplier.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            Website:{' '}
            {supplier.website ? (
              <Link
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </Link>
            ) : (
              'No website'
            )}
          </p>
          <p>ID: {supplier.id}</p>
          <div className="flex gap-2 mt-2">
            <Button asChild variant="outline">
              <Link href={`/admin/suppliers/${supplier.id}/edit`}>Edit Supplier</Link>
            </Button>
            <Button variant="destructive" onClick={() => alert('Delete Supplier')}>
              Delete Supplier
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Ingredients</CardTitle>
          <Button asChild size="sm">
            <Link href={`/admin/ingredients?supplierId=${supplier.id}`}>
              View All
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ingredientsLoading ? (
            <Skeleton className="h-6 w-full" />
          ) : ingredients.length === 0 ? (
            <p>No ingredients for this supplier</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price Per Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ing) => (
                  <TableRow key={ing.id}>
                    <TableCell>{ing.name}</TableCell>
                    <TableCell>{ing.unit}</TableCell>
                    <TableCell>{ing.pricePerUnit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
