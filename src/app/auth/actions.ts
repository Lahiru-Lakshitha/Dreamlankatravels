'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { AuthResult } from '@/types/auth'
import { headers } from 'next/headers'

export async function login(formData: FormData): Promise<AuthResult> {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Return structured error handling
        return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, message: 'Logged in successfully' }
}

export async function signup(formData: FormData): Promise<AuthResult> {
    const supabase = createClient()
    const origin = headers().get('origin')

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
    }

    // 1. Sign up user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name || '',
            },
            // Use origin header for dynamic redirect path in production vs local
            emailRedirectTo: `${origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { success: false, error: error.message }
    }

    if (data?.user && !data.user.identities?.length) {
        return { success: false, error: 'Account already exists. Try logging in.' }
    }

    // Do NOT revalidate or redirect automatically. 
    // The user MUST check their email.
    return { success: true, message: 'Check your email to confirm your account' }
}

export async function logout(): Promise<AuthResult> {
    const supabase = createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    return { success: true, message: 'Logged out successfully' }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
    const supabase = createClient()
    const email = formData.get('email') as string
    const origin = headers().get('origin')

    if (!email) {
        return { success: false, error: 'Email is required' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, message: 'Check your email for the password reset link' }
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
    const supabase = createClient()
    const password = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || !confirmPassword) {
        return { success: false, error: 'Please fill in all fields' }
    }

    if (password !== confirmPassword) {
        return { success: false, error: 'Passwords do not match' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true, message: 'Password updated successfully' }
}
