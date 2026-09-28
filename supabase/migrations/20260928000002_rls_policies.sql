-- ==============================================================================
-- DOCES DA ANGEL - MIGRATION 002: ROW LEVEL SECURITY & GRANTS
-- Data: 28 de setembro de 2026
-- ==============================================================================

-- Função auxiliar segura para verificação de papéis (SECURITY DEFINER em schema privado)
CREATE OR REPLACE FUNCTION app_private.get_user_role(user_uuid UUID)
RETURNS public.app_role AS $$
    SELECT role FROM public.user_roles
    WHERE user_id = user_uuid
    ORDER BY CASE role
        WHEN 'admin' THEN 1
        WHEN 'operator' THEN 2
        WHEN 'customer' THEN 3
        ELSE 4
    END
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp;

-- Habilitar RLS em todas as tabelas públicas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_allocations ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins and Operators can view all profiles"
    ON public.profiles FOR SELECT
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 2. USER_ROLES POLICIES
CREATE POLICY "Users can view their own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user roles"
    ON public.user_roles FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 3. ADDRESSES POLICIES
CREATE POLICY "Users can CRUD their own addresses"
    ON public.addresses FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and Operators can view addresses"
    ON public.addresses FOR SELECT
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 4. CATEGORIES POLICIES
CREATE POLICY "Anyone can view active categories"
    ON public.categories FOR SELECT
    USING (active = TRUE OR app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 5. PRODUCTS POLICIES
CREATE POLICY "Anyone can view published products"
    ON public.products FOR SELECT
    USING (status = 'published' OR app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 6. PRODUCT_VARIANTS POLICIES
CREATE POLICY "Anyone can view active variants"
    ON public.product_variants FOR SELECT
    USING (active = TRUE OR app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

CREATE POLICY "Admins can manage variants"
    ON public.product_variants FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 7. PRODUCT_IMAGES POLICIES
CREATE POLICY "Anyone can view product images"
    ON public.product_images FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can manage product images"
    ON public.product_images FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 8. INVENTORY POLICIES
CREATE POLICY "Staff can view inventory"
    ON public.inventory FOR SELECT
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 9. DELIVERY_ZONES POLICIES
CREATE POLICY "Anyone can view active delivery zones"
    ON public.delivery_zones FOR SELECT
    USING (active = TRUE OR app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

CREATE POLICY "Admins can manage delivery zones"
    ON public.delivery_zones FOR ALL
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 10. FULFILLMENT_SLOTS POLICIES
CREATE POLICY "Anyone can view active fulfillment slots"
    ON public.fulfillment_slots FOR SELECT
    USING (active = TRUE OR app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

CREATE POLICY "Staff can manage slots"
    ON public.fulfillment_slots FOR ALL
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 11. ORDERS POLICIES
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Staff can view and manage all orders"
    ON public.orders FOR ALL
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 12. ORDER_ITEMS POLICIES
CREATE POLICY "Customers can view items of their own orders"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Staff can view and manage all order items"
    ON public.order_items FOR ALL
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 13. STORE_SETTINGS POLICIES
CREATE POLICY "Anyone can view store settings"
    ON public.store_settings FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can update store settings"
    ON public.store_settings FOR UPDATE
    USING (app_private.get_user_role(auth.uid()) = 'admin');

-- 14. INQUIRIES POLICIES
CREATE POLICY "Anyone can submit an inquiry"
    ON public.inquiries FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Staff can view and update inquiries"
    ON public.inquiries FOR ALL
    USING (app_private.get_user_role(auth.uid()) IN ('admin', 'operator'));

-- 15. AUDIT_LOGS POLICIES
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (app_private.get_user_role(auth.uid()) = 'admin');
