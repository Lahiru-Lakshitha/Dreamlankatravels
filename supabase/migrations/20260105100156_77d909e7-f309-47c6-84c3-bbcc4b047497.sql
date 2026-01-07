-- Drop the view and recreate properly
DROP VIEW IF EXISTS public.public_reviews;

-- Recreate view with explicit security_invoker option to ensure RLS of querying user is used
CREATE VIEW public.public_reviews 
WITH (security_invoker = on)
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

-- Grant SELECT only to the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.public_reviews FROM anon, authenticated;