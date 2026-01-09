"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MetaTags } from '@/components/seo/MetaTags';
import { resetPassword } from '@/app/auth/actions';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError(null);
        const formData = new FormData();
        formData.append('email', data.email);

        try {
            const result = await resetPassword(formData);
            if (result.error) {
                setServerError(result.error);
            } else {
                setIsSuccess(true);
            }
        } catch (error) {
            setServerError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-background px-4">
            <MetaTags
                title="Forgot Password | Dream Lanka Travels"
                description="Reset your password to regain access to your account."
            />

            <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-border p-8 animate-fade-up">
                {isSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-foreground">Check your email</h1>
                        <p className="text-muted-foreground mb-6">
                            We&apos;ve sent a password reset link to your email address.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full"
                            asChild
                        >
                            <Link href="/auth">Back to Login</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
                            <p className="text-muted-foreground text-sm">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        {serverError && (
                            <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm rounded-lg text-center font-medium">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        {...register('email')}
                                        className="pl-10 h-10"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-destructive text-sm">{errors.email.message}</p>
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
                                        Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/auth"
                                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
