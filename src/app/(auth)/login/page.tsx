'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GalleryVerticalEnd } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and password are required');
            return;
        }

        setIsLoading(true);

        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: '/dashboard',
                rememberMe: false,
            },
            {
                onSuccess: () => {
                    window.location.href = '/dashboard';
                },
                onError: (ctx) => {
                    if (ctx.error.status === 403) {
                        toast.error('Please verify your email address');
                    } else {
                        toast.error(ctx.error.message);
                    }
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-6">
            {/* Logo top-left */}
            <div className="absolute left-6 top-6">
                <Link href="/" className="flex items-center gap-2 font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    <span className="hidden text-lg font-semibold md:inline-block">Deecake</span>
                </Link>
            </div>

            {/* Form content */}
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm sm:w-1/2'
                )}
            >
                <h1 className="text-2xl font-semibold text-center">Login</h1>

                <div>
                    <Label className='pb-2' htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <div className="flex items-center justify-between pb-2">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <div className="mt-4 text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-primary hover:underline">
                    Register
                </Link>
            </div>
        </div>
    );
}
