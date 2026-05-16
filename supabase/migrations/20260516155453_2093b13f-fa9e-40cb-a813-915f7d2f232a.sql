-- 1. Product fields
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS verified_clean BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS views_total INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS views_today INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS views_day DATE NOT NULL DEFAULT CURRENT_DATE;

-- 2. View counter RPC
CREATE OR REPLACE FUNCTION public.increment_product_view(_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
    SET views_total = views_total + 1,
        views_today = CASE WHEN views_day = CURRENT_DATE THEN views_today + 1 ELSE 1 END,
        views_day = CURRENT_DATE
    WHERE id = _product_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_product_view(UUID) TO anon, authenticated;

-- 3. Offers table (make-offer + 24h hold requests)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'offer' CHECK (type IN ('offer','hold24h')),
  amount NUMERIC,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_offers_product ON public.offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers insert any" ON public.offers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "offers select own or admin" ON public.offers
  FOR SELECT USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "offers admin manage" ON public.offers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));