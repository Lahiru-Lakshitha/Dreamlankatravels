import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const type = searchParams.get('type');

    if (!code) {
        return NextResponse.redirect(`${origin}/`);
    }

    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
        // Route based on flow
        if (type === 'recovery') {
            return NextResponse.redirect(`${origin}/auth/update-password`);
        }

        if (type === 'signup') {
            return NextResponse.redirect(`${origin}/auth/confirm-success`);
        }

        return NextResponse.redirect(`${origin}/dashboard`);
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth?error=auth-code-error`);
}
