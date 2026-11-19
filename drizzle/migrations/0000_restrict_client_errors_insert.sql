DROP POLICY IF EXISTS "client_errors insert any" ON public.client_errors;
CREATE POLICY "client_errors insert validated" ON public.client_errors
FOR INSERT TO anon, authenticated
WITH CHECK (
  ((auth.uid() IS NULL AND user_id IS NULL) OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid())))
  AND length(message) BETWEEN 1 AND 2000
  AND (stack IS NULL OR length(stack) <= 10000)
  AND (path IS NULL OR length(path) <= 500)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);