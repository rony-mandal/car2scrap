
-- Fix function search path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Replace permissive INSERT policy with explicit validation
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 100
    AND char_length(phone) BETWEEN 10 AND 15
    AND char_length(city) BETWEEN 1 AND 80
    AND char_length(car_category) BETWEEN 1 AND 40
    AND year BETWEEN 1980 AND 2100
    AND condition IN ('excellent','good','poor')
    AND status = 'new'
  );
