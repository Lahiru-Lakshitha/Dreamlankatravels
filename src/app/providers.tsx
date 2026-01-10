"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useState } from "react";

import { Session } from "@supabase/supabase-js";

export function Providers({ children, initialSession = null }: { children: React.ReactNode; initialSession?: Session | null }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <AuthProvider initialSession={initialSession}>
                    <LanguageProvider>
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    );
}
