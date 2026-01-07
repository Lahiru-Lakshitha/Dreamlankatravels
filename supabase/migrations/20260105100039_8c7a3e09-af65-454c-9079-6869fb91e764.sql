-- Fix: Set view to use SECURITY INVOKER (safe default)
-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews 
WITH (security_invoker = true)
AS
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