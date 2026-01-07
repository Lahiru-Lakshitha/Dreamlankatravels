-- Fix: Remove anonymous booking creation ability and add chat message delete

-- 1. Drop the policy that allows anonymous bookings
DROP POLICY IF EXISTS "Guests can create bookings without user_id" ON public.bookings;

-- Only authenticated users can create bookings (guests must register or use quote form)
CREATE POLICY "Only authenticated users can create bookings"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL)
);

-- 2. Add policy allowing users to delete their own recent chat messages (within 5 minutes)
CREATE POLICY "Users can delete their own recent messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id 
  AND created_at > (now() - interval '5 minutes')
  AND is_admin_reply = false
);

-- Admins can delete any message
CREATE POLICY "Admins can delete messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));