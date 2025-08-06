'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !password || !name) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        await authClient.signUp.email(
            {
                email,
                password,
                name,
                callbackURL: '/dashboard', // You could also set this to /verify-email
            },
            {
                onSuccess: () => {
                    setIsRegistered(true);
                    setIsLoading(false);
                    toast.success('Registration successful! Check your email to verify.');
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
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

            {isRegistered ? (
                <div className="w-full max-w-md space-y-4 rounded-lg border p-8 text-center shadow-sm sm:w-1/2">
                    <h1 className="text-2xl font-semibold">Verify Your Email</h1>
                    <p className="text-muted-foreground">
                        A verification link has been sent to <strong>{email}</strong>. Please check your inbox and follow the link to verify your account.
                    </p>
                    <p className="text-muted-foreground text-sm">Didn’t receive it? Check your spam folder or try registering again.</p>
                </div>
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit}
                        className={cn(
                            'w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm sm:w-1/2'
                        )}
                    >
                        <h1 className="text-2xl font-semibold text-center">Register</h1>

                        <div>
                            <Label className='pb-2' htmlFor="name">Name</Label>
                            <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div>
                            <Label className='pb-2' htmlFor="email" >Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <Label className='pb-2' htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>

                    <div className="mt-4 text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Login
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
