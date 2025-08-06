'use client';

import { useSearchParams } from 'next/navigation';
import { GalleryVerticalEnd } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {

        if (!token) {
            toast.error('Invalid or missing reset token.');
        }

    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!newPassword || !token) {
            toast.error('Password or token missing');
            return;
        }

        setIsLoading(true);

        const { error } = await authClient.resetPassword({
            newPassword,
            token,
        });

        setIsLoading(false);

        if (error) {
            toast.error(error.message || 'Reset failed');
        } else {
            setSubmitted(true);
            toast.success('Password updated. You can now log in.');
        }
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

            <form onSubmit={handleSubmit} className={cn('w-full max-w-md space-y-6 rounded-lg border p-8 shadow-sm sm:w-1/2')}>
                <h1 className="text-2xl font-semibold text-center">Reset Password</h1>

                {!token ? (
                    <div className="text-center text-destructive text-sm">
                        Invalid or missing token.
                    </div>
                ) : submitted ? (
                    <div className="text-center text-sm text-muted-foreground">
                        Your password has been reset.{' '}
                        <Link href="/login" className="text-primary underline">
                            Log in
                        </Link>
                    </div>
                ) : (
                    <>
                        <div>
                            <Label className='pb-2' htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter your new password" required />
                        </div>

                        <Button type="submit" disabled={isLoading || !token} className="w-full">
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </>
                )}
            </form>
        </div>
    );
}
