import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSuppliersPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-bold">Suppliers</h1>
            <Skeleton className="h-10 w-[150px]" />
            <div className="space-y-2 mt-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-6 w-[200px]" />
                        <Skeleton className="h-6 w-[100px]" />
                    </div>
                ))}
            </div>
        </div>
    );
}
