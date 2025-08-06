// src/app/(dashboard)/admin/suppliers/page.tsx
import { Supplier } from '@/types'
import { Button } from '@/components/ui/button'

async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/suppliers`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Failed to fetch suppliers");
  }

  return res.json();
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Suppliers</h1>
      <Button onClick={() => console.log('Add Supplier')}>Add Supplier</Button>
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.website}</td>
              <td>
                <Button onClick={() => console.log('Edit', s.id)}>Edit</Button>
                <Button onClick={() => console.log('Delete', s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
