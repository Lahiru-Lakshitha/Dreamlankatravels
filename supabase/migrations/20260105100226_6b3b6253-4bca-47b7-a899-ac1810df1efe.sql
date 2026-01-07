-- Fix: Strengthen guest booking protection
-- Guest bookings should only be viewable by admins, not by other authenticated users

-- Drop and recreate the policy for viewing bookings
DROP POLICY IF EXISTS "Guests can create bookings without user_id" ON public.bookings;

-- Recreate with stricter validation
CREATE POLICY "Guests can create bookings without user_id"
ON public.bookings
FOR INSERT
TO authenticated, anon
WITH CHECK (
  (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL)
  OR (user_id = auth.uid())
);

-- Ensure guest bookings (where user_id IS NULL) can only be viewed by admins
-- The existing policy "Users can view their own bookings" won't match guest bookings
-- And "Admins can view all bookings" allows admin access
-- This is the correct behavior - no changes needed for SELECT policies