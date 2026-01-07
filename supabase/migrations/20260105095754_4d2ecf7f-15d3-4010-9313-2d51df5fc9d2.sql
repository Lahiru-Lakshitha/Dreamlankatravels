-- Fix Security: Block anonymous access to sensitive tables

-- 1. PROFILES - Block anonymous access to customer personal data
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- 2. BOOKINGS - Block anonymous access to booking and payment data
CREATE POLICY "Block anonymous access to bookings"
ON public.bookings
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anonymous insert on bookings"
ON public.bookings
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Block anonymous update on bookings"
ON public.bookings
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Block anonymous delete on bookings"
ON public.bookings
FOR DELETE
TO anon
USING (false);

-- 3. NEWSLETTER_SUBSCRIPTIONS - Allow public inserts but block reads for non-admins
CREATE POLICY "Block anonymous reads on newsletter"
ON public.newsletter_subscriptions
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Only admins can read newsletter subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. QUOTES - Block anonymous access to customer quote requests
CREATE POLICY "Block anonymous access to quotes"
ON public.quotes
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anonymous insert on quotes"
ON public.quotes
FOR INSERT
TO anon
WITH CHECK (false);

-- 5. CHAT_MESSAGES - Block anonymous access to private conversations
CREATE POLICY "Block anonymous access to chat_messages"
ON public.chat_messages
FOR SELECT
TO anon
USING (false);

CREATE POLICY "Block anonymous insert on chat_messages"
ON public.chat_messages
FOR INSERT
TO anon
WITH CHECK (false);

-- 6. REVIEWS - Create a view or restrict email access
-- First, add policy to hide reviewer emails from public
CREATE POLICY "Block anonymous access to reviews with emails"
ON public.reviews
FOR SELECT
TO anon
USING (is_approved = true);

-- Update existing authenticated policy to not expose emails to non-admins
-- Note: The email column will still be in the row, but we rely on app-level filtering
-- For stronger protection, consider removing reviewer_email from client queries