import { Skeleton } from '@/components/ui/skeleton';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function AuthLoading() {
    return (
        <div className="flex min-h-screen flex-col p-6">
            {/* Top-left logo */}
            <div className="flex justify-center gap-2 md:justify-start">
                <Link href="/" className="flex items-center gap-2 font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    <span className="hidden text-lg font-semibold md:inline-block">Deecake</span>
                </Link>
            </div>

            {/* Centered spinner + loading text */}
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xs">
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
