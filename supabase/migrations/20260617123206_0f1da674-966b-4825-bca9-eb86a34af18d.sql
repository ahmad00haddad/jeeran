
-- Atomic order creation that prevents double-selling of unique items
CREATE OR REPLACE FUNCTION public.create_order_atomic(
  _items jsonb,            -- [{ product_id, quantity, price, size, color }]
  _customer jsonb,         -- { full_name, phone, city, address, notes }
  _shipping numeric DEFAULT 0
)
RETURNS TABLE(order_id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _order_id uuid;
  _order_number text;
  _subtotal numeric := 0;
  _total numeric;
  _item jsonb;
  _pid uuid;
  _price numeric;
  _qty int;
  _prod record;
BEGIN
  -- Basic validation
  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'EMPTY_CART';
  END IF;
  IF coalesce(_customer->>'full_name','') = ''
     OR coalesce(_customer->>'phone','') = ''
     OR coalesce(_customer->>'city','') = ''
     OR coalesce(_customer->>'address','') = '' THEN
    RAISE EXCEPTION 'MISSING_CUSTOMER_FIELDS';
  END IF;

  -- Lock & verify every product atomically, compute subtotal from DB price (not client)
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _pid := (_item->>'product_id')::uuid;
    _qty := coalesce((_item->>'quantity')::int, 1);
    IF _qty <> 1 THEN
      RAISE EXCEPTION 'UNIQUE_ITEM_QTY_MUST_BE_1:%', _pid;
    END IF;

    SELECT id, price, sale_price, sold, reserved_until, reserved_order_id, name_ar, image_url, active
      INTO _prod
      FROM public.products
      WHERE id = _pid
      FOR UPDATE;

    IF NOT FOUND OR _prod.active = false THEN
      RAISE EXCEPTION 'PRODUCT_NOT_FOUND:%', _pid;
    END IF;
    IF _prod.sold = true THEN
      RAISE EXCEPTION 'PRODUCT_SOLD:%', _pid;
    END IF;
    IF _prod.reserved_until IS NOT NULL AND _prod.reserved_until > now() THEN
      RAISE EXCEPTION 'PRODUCT_RESERVED:%', _pid;
    END IF;

    _price := coalesce(_prod.sale_price, _prod.price);
    _subtotal := _subtotal + _price;
  END LOOP;

  _total := _subtotal + coalesce(_shipping, 0);

  -- Create order
  INSERT INTO public.orders(user_id, full_name, phone, city, address, notes,
                            subtotal, shipping, total, payment_method, status)
  VALUES (_user_id,
          _customer->>'full_name',
          _customer->>'phone',
          _customer->>'city',
          _customer->>'address',
          nullif(_customer->>'notes',''),
          _subtotal, coalesce(_shipping,0), _total, 'COD', 'pending')
  RETURNING id, orders.order_number INTO _order_id, _order_number;

  -- Insert items & reserve products (45 min)
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    _pid := (_item->>'product_id')::uuid;

    SELECT name_ar, image_url, price, sale_price INTO _prod
      FROM public.products WHERE id = _pid;

    _price := coalesce(_prod.sale_price, _prod.price);

    INSERT INTO public.order_items(order_id, product_id, name_ar, image_url, size, color, quantity, price)
    VALUES (_order_id, _pid, _prod.name_ar, _prod.image_url,
            nullif(_item->>'size',''), nullif(_item->>'color',''), 1, _price);

    UPDATE public.products
      SET reserved_until = now() + interval '45 minutes',
          reserved_order_id = _order_id
      WHERE id = _pid;
  END LOOP;

  RETURN QUERY SELECT _order_id, _order_number;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_atomic(jsonb, jsonb, numeric) TO anon, authenticated;

-- Lightweight availability check used by client before redirecting to checkout
CREATE OR REPLACE FUNCTION public.check_items_availability(_product_ids uuid[])
RETURNS TABLE(product_id uuid, available boolean, reason text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id,
         (p.active = true AND p.sold = false
            AND (p.reserved_until IS NULL OR p.reserved_until < now())) AS available,
         CASE
           WHEN p.id IS NULL THEN 'not_found'
           WHEN p.active = false THEN 'inactive'
           WHEN p.sold = true THEN 'sold'
           WHEN p.reserved_until IS NOT NULL AND p.reserved_until > now() THEN 'reserved'
           ELSE 'ok'
         END AS reason
  FROM unnest(_product_ids) AS pid
  LEFT JOIN public.products p ON p.id = pid;
$$;

GRANT EXECUTE ON FUNCTION public.check_items_availability(uuid[]) TO anon, authenticated;
