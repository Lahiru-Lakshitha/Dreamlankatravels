-- Fix: Protect reviewer email addresses from public access

-- Drop the existing public review policy
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Block anonymous access to reviews with emails" ON public.reviews;

-- Create a secure view for public reviews that excludes email
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT 
  id,
  tour_id,
  user_id,
  rating,
  title,
  content,
  reviewer_name,
  reviewer_country,
  travel_date,
  is_verified,
  is_featured,
  is_approved,
  admin_response,
  platform,
  created_at,
  updated_at
FROM public.reviews
WHERE is_approved = true;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;

-- Create restrictive policy: Only admins can see full review data (including emails)
CREATE POLICY "Only admins can view full reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR auth.uid() = user_id
);

-- Block anonymous access to the reviews table entirely
CREATE POLICY "Block anonymous access to reviews"
ON public.reviews
FOR SELECT
TO anon
USING (false);