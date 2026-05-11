-- Add marketplace/used-clothing fields to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS condition text DEFAULT 'like_new',
  ADD COLUMN IF NOT EXISTS original_price numeric,
  ADD COLUMN IF NOT EXISTS seller_notes text,
  ADD COLUMN IF NOT EXISTS worn_times text DEFAULT 'never';

COMMENT ON COLUMN public.products.condition IS 'new | like_new | worn_once | gently_used';
COMMENT ON COLUMN public.products.worn_times IS 'never | once | few_times';