"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetaTags } from '@/components/seo/MetaTags';
import { updatePassword } from '@/app/auth/actions';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';

const updatePasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePasswordPage() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/auth');
            }
        };
        checkSession();
    }, [router]);

    const onSubmit = async (data: UpdatePasswordFormData) => {
        setServerError(null);
        const formData = new FormData();
        formData.append('newPassword', data.newPassword);
        formData.append('confirmPassword', data.confirmPassword);

        try {
            const result = await updatePassword(formData);
            if (!result.success) {
                setServerError(result.error || 'An unexpected error occurred');
            } else {
                setSuccess(true);
                // FORCE SIGN OUT to ensure user must log in with new password
                // This fixes the issue where "Go to Login" redirects to Dashboard because session is still active
                await supabase.auth.signOut();

                setTimeout(() => {
                    // Force a hard reload/redirect to clear any client states
                    window.location.href = '/auth?message=password-updated';
                }, 2000);
            }
        } catch (error) {
            setServerError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-background px-4">
            <MetaTags
                title="Update Password | Dream Lanka Travels"
                description="Set your new password."
            />

            <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-border p-8 animate-fade-up">
                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-foreground">Password Updated!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your password has been changed successfully. You will be redirected to the login page shortly.
                        </p>
                        <Button
                            className="w-full"
                            asChild
                        >
                            <Link href="/auth">Go to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Set New Password</h1>
                            <p className="text-muted-foreground text-sm">
                                Please enter your new password below.
                            </p>
                        </div>

                        {serverError && (
                            <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm rounded-lg text-center font-medium">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="******"
                                        {...register('newPassword')}
                                        className="pl-10 h-10"
                                    />
                                </div>
                                {errors.newPassword && (
                                    <p className="text-destructive text-sm">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="******"
                                        {...register('confirmPassword')}
                                        className="pl-10 h-10"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
