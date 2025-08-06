'use client'

import { use } from 'react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Supplier } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface EditSupplierPageProps {
  params: Promise<{ id: string }>
}

export default function EditSupplierPage({ params }: EditSupplierPageProps) {
  const { id } = use(params)
  const router = useRouter()

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [website, setWebsite] = useState('')
  const [saving, setSaving] = useState(false)

  // Fetch supplier data
  useEffect(() => {
    async function fetchSupplier() {
      try {
        const res = await fetch(`/api/suppliers/${id}`)
        if (!res.ok) throw new Error('Failed to fetch supplier')
        const data: Supplier = await res.json()
        setSupplier(data)
        setName(data.name)
        setWebsite(data.website || '')
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message)
        } else {
          alert('Unknown error')
        }
        setError('Failed to load supplier data')
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/suppliers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, website }),
      })
      if (!res.ok) throw new Error('Failed to update supplier')
      router.push(`/admin/suppliers/${id}`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('Unknown error')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Supplier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!supplier) return <div>No supplier found</div>

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
