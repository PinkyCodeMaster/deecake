// src/app/(dashboard)/admin/suppliers/page.tsx
import { Supplier } from "@/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/suppliers`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers")
  }

  return res.json()
}

export default async function AllSuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Suppliers</CardTitle>
        <Button asChild>
          <Link href="/admin/suppliers/add">Add Supplier</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell><Link href={`/admin/suppliers/${s.id}`}> {s.name}</Link></TableCell>
                <TableCell>
                  <Link href={s.website!} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {s.website ? 'Website Home Page' : "No website"}
                  </Link>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/suppliers/edit/${s.id}`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
