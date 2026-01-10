"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ConfirmSuccessPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
        };
        checkSession();
    }, []);

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-background px-4">
            <div className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl border border-gray-100 dark:border-border p-8 text-center animate-fade-up">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-foreground font-serif">Email Confirmed!</h1>
                <p className="text-muted-foreground mb-8 text-lg">
                    Your email has been successfully verified. You can now access your account.
                </p>

                {isLoading ? (
                    <Button disabled className="w-full" size="lg">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking session...
                    </Button>
                ) : (
                    <Button
                        className="w-full"
                        size="lg"
                        asChild
                    >
                        <Link href={isAuthenticated ? "/dashboard" : "/auth"}>
                            {isAuthenticated ? "Go to Dashboard" : "Sign In Now"}
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
