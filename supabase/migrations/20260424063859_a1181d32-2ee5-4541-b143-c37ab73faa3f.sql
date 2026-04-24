ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS fuel_type text,
  ADD COLUMN IF NOT EXISTS km_driven integer;