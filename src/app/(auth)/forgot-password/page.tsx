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

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsLoading(true);

        const { error } = await authClient.requestPasswordReset({
            email,
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            toast.error(error.message);
        } else {
            setSubmitted(true);
            toast.success('Password reset link sent. Check your email.');
        }

        setIsLoading(false);
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
                <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>

                {submitted ? (
                    <div className="text-sm text-center text-muted-foreground">
                        If your email is registered, you’ll receive a link to reset your password.
                    </div>
                ) : (
                    <>
                        <div>
                            <Label className="pb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </>
                )}
            </form>

            {!submitted && (
                <div className="mt-4 text-sm text-muted-foreground">
                    Remembered your password?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Back to login
                    </Link>
                </div>
            )}
        </div>
    );
}
