
-- The public SELECT policies on products/offers/categories reference has_role(...)
-- to grant admins a wider view. Postgres evaluates the whole USING clause for
-- every role the policy targets, so anon must be able to EXECUTE has_role
-- even though it will always return false for anon.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;
