
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS rentable boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rental_price numeric,
  ADD COLUMN IF NOT EXISTS rental_duration_days integer,
  ADD COLUMN IF NOT EXISTS rental_deposit numeric;

CREATE TABLE IF NOT EXISTS public.rental_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  user_id uuid,
  full_name text NOT NULL,
  phone text NOT NULL,
  event_date date,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.rental_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rentals insert any" ON public.rental_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "rentals select own or admin" ON public.rental_requests
  FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "rentals admin manage" ON public.rental_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
