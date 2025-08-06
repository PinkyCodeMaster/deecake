// src/app/(auth)/layout.tsx
import Image from 'next/image';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 p-6">
                {children}
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Side Image"
                    className="object-cover"
                    fill
                    priority
                />
            </div>
        </div>
    );
}
