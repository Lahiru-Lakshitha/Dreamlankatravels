-- Fix: Strengthen RLS for bookings and profiles tables

-- 1. BOOKINGS: Ensure guest bookings (user_id IS NULL) are ONLY viewable by admins
-- Drop existing user view policy and recreate with stricter check
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 2. PROFILES: Add extra layer - ensure user_id matches authenticated user strictly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND user_id IS NOT NULL
);

-- Ensure update policy also checks user_id is not null
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  AND user_id IS NOT NULL
)
WITH CHECK (
  auth.uid() = user_id
  AND user_id IS NOT NULL
);