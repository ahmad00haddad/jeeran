-- Add reservation fields to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS reserved_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reserved_order_id UUID,
  ADD COLUMN IF NOT EXISTS sold BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_availability ON public.products(active, sold, reserved_until);

-- Trigger: on new order_item, reserve the product for 45 minutes
CREATE OR REPLACE FUNCTION public.reserve_product_on_order_item()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products
      SET reserved_until = now() + interval '45 minutes',
          reserved_order_id = NEW.order_id
      WHERE id = NEW.product_id
        AND sold = false
        AND (reserved_until IS NULL OR reserved_until < now() OR reserved_order_id = NEW.order_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reserve_product ON public.order_items;
CREATE TRIGGER trg_reserve_product
AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.reserve_product_on_order_item();

-- Trigger: when order status changes, sync product state
CREATE OR REPLACE FUNCTION public.sync_products_on_order_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('confirmed','shipped','delivered') THEN
      UPDATE public.products
        SET sold = true, stock = 0, reserved_until = NULL
        WHERE reserved_order_id = NEW.id OR id IN (SELECT product_id FROM public.order_items WHERE order_id = NEW.id);
    ELSIF NEW.status IN ('cancelled','rejected') THEN
      UPDATE public.products
        SET reserved_until = NULL, reserved_order_id = NULL
        WHERE reserved_order_id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_products_status ON public.orders;
CREATE TRIGGER trg_sync_products_status
AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.sync_products_on_order_status();

-- Add 'rejected' to order_status if not present
DO $$ BEGIN
  ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'rejected';
EXCEPTION WHEN others THEN NULL; END $$;