import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') ?? '/dashboard';

    // Use origin from request or fallback to env vars for safety
    // The 'origin' property of the URL object is usually robust in modern environments
    const origin = requestUrl.origin;

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // STRICT REDIRECT LOGIC per Master Prompt

            // 1. Recovery Flow -> Update Password
            if (type === 'recovery') {
                return NextResponse.redirect(`${origin}/auth/update-password`);
            }

            // 2. Signup Flow -> Confirmation Success
            // Note: Supabase 'signup' type confirmation usually means "email confirmed"
            if (type === 'signup' || type === 'email_change') {
                return NextResponse.redirect(`${origin}/auth/confirm-success`);
            }

            // 3. Default / invite / magiclink -> Dashboard or specified 'next'
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth?error=auth-code-error`);
}
