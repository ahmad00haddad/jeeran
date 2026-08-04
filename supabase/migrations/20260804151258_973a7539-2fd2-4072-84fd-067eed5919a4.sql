-- 1) Public order tracking by order number + phone
CREATE OR REPLACE FUNCTION public.track_order(_order_number text, _phone text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _o record;
  _digits text := regexp_replace(coalesce(_phone,''), '\D', '', 'g');
  _items jsonb;
BEGIN
  IF length(_digits) < 7 OR coalesce(_order_number,'') = '' THEN
    RETURN NULL;
  END IF;

  SELECT * INTO _o FROM public.orders
   WHERE upper(order_number) = upper(trim(_order_number))
     AND right(regexp_replace(phone, '\D', '', 'g'), 8) = right(_digits, 8)
   LIMIT 1;

  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'name_ar', oi.name_ar, 'image_url', oi.image_url, 'price', oi.price
  )), '[]'::jsonb) INTO _items
  FROM public.order_items oi WHERE oi.order_id = _o.id;

  RETURN jsonb_build_object(
    'order_number', _o.order_number,
    'status', _o.status,
    'created_at', _o.created_at,
    'full_name', _o.full_name,
    'city', _o.city,
    'subtotal', _o.subtotal,
    'shipping', _o.shipping,
    'total', _o.total,
    'payment_method', _o.payment_method,
    'items', _items
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_order(text, text) TO anon, authenticated;

-- 2) Client error logging
CREATE TABLE public.client_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  stack text,
  path text,
  user_agent text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.client_errors TO anon, authenticated;
GRANT SELECT, DELETE ON public.client_errors TO authenticated;
GRANT ALL ON public.client_errors TO service_role;

ALTER TABLE public.client_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_errors insert any" ON public.client_errors
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "client_errors admin read" ON public.client_errors
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "client_errors admin delete" ON public.client_errors
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Simple anti-spam throttle on offers and rental requests
CREATE OR REPLACE FUNCTION public.throttle_requests_by_phone()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _cnt int;
  _digits text := right(regexp_replace(coalesce(NEW.phone,''), '\D', '', 'g'), 8);
BEGIN
  IF TG_TABLE_NAME = 'offers' THEN
    SELECT count(*) INTO _cnt FROM public.offers
      WHERE right(regexp_replace(phone, '\D', '', 'g'), 8) = _digits
        AND created_at > now() - interval '1 hour';
  ELSE
    SELECT count(*) INTO _cnt FROM public.rental_requests
      WHERE right(regexp_replace(phone, '\D', '', 'g'), 8) = _digits
        AND created_at > now() - interval '1 hour';
  END IF;

  IF _cnt >= 5 THEN
    RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_throttle_offers
  BEFORE INSERT ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.throttle_requests_by_phone();

CREATE TRIGGER trg_throttle_rentals
  BEFORE INSERT ON public.rental_requests
  FOR EACH ROW EXECUTE FUNCTION public.throttle_requests_by_phone();