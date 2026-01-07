-- Fix remaining security warnings

-- 1. Fix quotes: Ensure user_id matches auth.uid() for authenticated users
DROP POLICY IF EXISTS "Users can create quotes" ON public.quotes;

-- Allow authenticated users to create quotes only for themselves
CREATE POLICY "Authenticated users can create their own quotes"
ON public.quotes
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Allow anonymous users to create quotes (for guest quote requests)
CREATE POLICY "Anonymous users can create guest quotes"
ON public.quotes
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- 2. Fix reviews: Restrict review submissions
DROP POLICY IF EXISTS "Users can submit reviews" ON public.reviews;

-- Allow authenticated users to submit reviews linked to themselves
CREATE POLICY "Authenticated users can submit their own reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Block anonymous review submissions
CREATE POLICY "Block anonymous review submissions"
ON public.reviews
FOR INSERT
TO anon
WITH CHECK (false);

-- 3. Note: public_reviews is a VIEW, not a table - it doesn't need RLS
-- The underlying reviews table has proper RLS policies