
-- 1. orders: prevent logged-in user inserting with NULL user_id
DROP POLICY IF EXISTS "orders insert any" ON public.orders;
CREATE POLICY "orders insert any" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 2. order_items: only service_role/security-definer RPC inserts; no client INSERT
DROP POLICY IF EXISTS "order_items insert" ON public.order_items;

-- 3. offers: same pattern as orders
DROP POLICY IF EXISTS "offers insert any" ON public.offers;
CREATE POLICY "offers insert any" ON public.offers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 4. Lock down SECURITY DEFINER trigger/helper functions from public callers
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auto_grant_founder_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reserve_product_on_order_item() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_products_on_order_status() FROM PUBLIC, anon, authenticated;

-- has_role: only signed-in users need it (used inside RLS, which runs as definer anyway)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- create_order_atomic & check_items_availability stay callable by anon (guest checkout/browsing)
-- increment_product_view stays callable by anon (view tracking)
