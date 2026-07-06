
-- Fix 1: Hide products.reserved_order_id from public API (anon + authenticated).
-- RLS is per-row; use column privileges to keep this internal state off the public catalog.
-- PostgREST's select=* expands to only columns the role has SELECT on.
REVOKE SELECT (reserved_order_id) ON public.products FROM anon, authenticated;

-- Fix 2: Tighten rental_requests INSERT policy so a user cannot forge user_id
-- to another account. Mirrors the pattern used on orders/offers.
DROP POLICY IF EXISTS "rentals insert any" ON public.rental_requests;

CREATE POLICY "rentals insert own or guest"
ON public.rental_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (auth.uid() IS NULL AND user_id IS NULL)
);
