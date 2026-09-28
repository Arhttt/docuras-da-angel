-- ==============================================================================
-- DOCES DA ANGEL - MIGRATION 001: INITIAL SCHEMA
-- Data: 28 de setembro de 2026
-- ==============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Esquema privado para funções transacionais e regras internas
CREATE SCHEMA IF NOT EXISTS app_private;

-- 1. PROFILES (Sincronizado com auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER_ROLES (Papéis do sistema: customer, operator, admin)
CREATE TYPE public.app_role AS ENUM ('customer', 'operator', 'admin');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role public.app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role)
);

-- 3. ADDRESSES (Endereços de entrega cadastrados por clientes autenticados)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient TEXT NOT NULL,
    postal_code VARCHAR(8) NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    district TEXT NOT NULL,
    city TEXT NOT NULL,
    state VARCHAR(2) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CATEGORIES (Categorias do Catálogo)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS (Produtos)
CREATE TYPE public.product_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    ingredients TEXT,
    allergens TEXT,
    storage_instructions TEXT,
    status public.product_status NOT NULL DEFAULT 'draft',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT_VARIANTS (Variantes vendáveis)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    unit_label TEXT NOT NULL DEFAULT 'unidade',
    weight_grams INT,
    price_cents INT NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    min_qty INT NOT NULL DEFAULT 1 CHECK (min_qty >= 1),
    max_qty INT NOT NULL DEFAULT 99 CHECK (max_qty >= min_qty),
    lead_time_minutes INT NOT NULL DEFAULT 0 CHECK (lead_time_minutes >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT_IMAGES (Imagens do catálogo)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INVENTORY (Estoque por variante)
CREATE TABLE IF NOT EXISTS public.inventory (
    variant_id UUID PRIMARY KEY REFERENCES public.product_variants(id) ON DELETE CASCADE,
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT inventory_on_hand_gte_reserved CHECK (on_hand >= reserved)
);

-- 9. STOCK_MOVEMENTS (Livro-razão de movimentação de estoque)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    order_id UUID,
    on_hand_delta INT NOT NULL DEFAULT 0,
    reserved_delta INT NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    operation_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. STOCK_RESERVATIONS (Reservas temporárias de estoque durante checkout)
CREATE TYPE public.reservation_status AS ENUM ('active', 'consumed', 'released');

CREATE TABLE IF NOT EXISTS public.stock_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMPTZ NOT NULL,
    status public.reservation_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT stock_reservations_order_variant_unique UNIQUE (order_id, variant_id)
);

-- 11. DELIVERY_ZONES (Zonas de entrega por faixa de CEP)
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    postal_code_from VARCHAR(8) NOT NULL,
    postal_code_to VARCHAR(8) NOT NULL,
    fee_cents INT NOT NULL DEFAULT 0 CHECK (fee_cents >= 0),
    minimum_cents INT NOT NULL DEFAULT 0 CHECK (minimum_cents >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT delivery_zones_postal_code_range_check CHECK (postal_code_from <= postal_code_to)
);

-- 12. FULFILLMENT_SLOTS (Janelas de horário para entrega ou retirada)
CREATE TYPE public.fulfillment_type AS ENUM ('delivery', 'pickup');

CREATE TABLE IF NOT EXISTS public.fulfillment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type public.fulfillment_type NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    cutoff_at TIMESTAMPTZ NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    reserved_count INT NOT NULL DEFAULT 0 CHECK (reserved_count >= 0),
    confirmed_count INT NOT NULL DEFAULT 0 CHECK (confirmed_count >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fulfillment_slots_time_check CHECK (starts_at < ends_at AND cutoff_at <= starts_at),
    CONSTRAINT fulfillment_slots_capacity_check CHECK (reserved_count + confirmed_count <= capacity)
);

-- 13. SLOT_RESERVATIONS (Reserva de vaga de atendimento)
CREATE TABLE IF NOT EXISTS public.slot_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE,
    slot_id UUID NOT NULL REFERENCES public.fulfillment_slots(id) ON DELETE RESTRICT,
    status public.reservation_status NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. COUPONS (Cupons de desconto)
CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed');

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    type public.coupon_type NOT NULL DEFAULT 'percentage',
    value INT NOT NULL CHECK (value > 0),
    minimum_cents INT NOT NULL DEFAULT 0 CHECK (minimum_cents >= 0),
    max_discount_cents INT CHECK (max_discount_cents IS NULL OR max_discount_cents > 0),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    max_uses INT CHECK (max_uses IS NULL OR max_uses > 0),
    used_count INT NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    per_user_limit INT DEFAULT 1 CHECK (per_user_limit IS NULL OR per_user_limit > 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT coupons_date_check CHECK (starts_at < ends_at)
);

-- 15. COUPON_REDEMPTIONS (Reserva e consumo de cupons)
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE RESTRICT,
    order_id UUID NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    discount_applied_cents INT NOT NULL DEFAULT 0 CHECK (discount_applied_cents >= 0),
    status public.reservation_status NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. ORDERS (Pedidos)
CREATE TYPE public.order_status AS ENUM ('pending_payment', 'confirmed', 'cancelled', 'expired', 'exception');
CREATE TYPE public.fulfillment_status AS ENUM ('unstarted', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    contact_snapshot JSONB NOT NULL,
    address_snapshot JSONB,
    fulfillment_type public.fulfillment_type NOT NULL,
    slot_id UUID REFERENCES public.fulfillment_slots(id) ON DELETE SET NULL,
    subtotal_cents INT NOT NULL CHECK (subtotal_cents >= 0),
    discount_cents INT NOT NULL DEFAULT 0 CHECK (discount_cents >= 0 AND discount_cents <= subtotal_cents),
    delivery_fee_cents INT NOT NULL DEFAULT 0 CHECK (delivery_fee_cents >= 0),
    total_cents INT NOT NULL CHECK (total_cents >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    order_status public.order_status NOT NULL DEFAULT 'pending_payment',
    fulfillment_status public.fulfillment_status NOT NULL DEFAULT 'unstarted',
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT orders_total_consistency CHECK (total_cents = subtotal_cents - discount_cents + delivery_fee_cents)
);

-- 17. ORDER_ITEMS (Itens do pedido com snapshots)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    name_snapshot TEXT NOT NULL,
    sku_snapshot TEXT NOT NULL,
    variant_snapshot TEXT NOT NULL,
    unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total_cents INT NOT NULL CHECK (line_total_cents = unit_price_cents * quantity),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. PAYMENTS (Transações financeiras)
CREATE TYPE public.payment_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'partially_refunded', 'refunded', 'chargeback');

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    provider TEXT NOT NULL DEFAULT 'mercadopago',
    provider_payment_id TEXT UNIQUE,
    status public.payment_status NOT NULL DEFAULT 'pending',
    amount_cents INT NOT NULL CHECK (amount_cents > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
    attempt_key TEXT NOT NULL UNIQUE,
    payment_method TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. REFUNDS (Estornos e reembolsos)
CREATE TYPE public.refund_status AS ENUM ('pending', 'approved', 'failed');

CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    provider_refund_id TEXT UNIQUE,
    amount_cents INT NOT NULL CHECK (amount_cents > 0),
    reason TEXT NOT NULL,
    status public.refund_status NOT NULL DEFAULT 'pending',
    requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. WEBHOOK_EVENTS (Deduplicação de webhooks)
CREATE TYPE public.webhook_status AS ENUM ('received', 'processing', 'processed', 'ignored', 'failed');

CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    deduplication_key TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    status public.webhook_status NOT NULL DEFAULT 'received',
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    error_code TEXT,
    raw_headers JSONB,
    raw_payload JSONB
);

-- 21. ORDER_EVENTS (Trilha de auditoria e linha do tempo de pedidos)
CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    previous_state TEXT,
    next_state TEXT,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    safe_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. CHECKOUT_REQUESTS (Tabela de idempotência de checkout)
CREATE TABLE IF NOT EXISTS public.checkout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_key TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'processing',
    response_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT checkout_requests_principal_idempotency_unique UNIQUE (principal_key, idempotency_key)
);

-- 23. GUEST_ACCESS_TOKENS (Tokens de acesso seguro para visitantes)
CREATE TABLE IF NOT EXISTS public.guest_access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. OUTBOX (Mensageria e envio assíncrono e confiável de emails)
CREATE TYPE public.outbox_status AS ENUM ('pending', 'processing', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS public.outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_key TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status public.outbox_status NOT NULL DEFAULT 'pending',
    attempts INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. INQUIRIES (Solicitações de orçamento para encomendas)
CREATE TYPE public.inquiry_status AS ENUM ('received', 'in_review', 'responded', 'approved', 'closed');

CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    requested_date DATE,
    description TEXT NOT NULL,
    status public.inquiry_status NOT NULL DEFAULT 'received',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. STORE_SETTINGS (Configurações públicas da loja)
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT NOT NULL DEFAULT 'Doces da Angel',
    tagline TEXT NOT NULL DEFAULT 'Confeitaria Artesanal',
    phone TEXT,
    email TEXT,
    address_display TEXT,
    pickup_details JSONB NOT NULL DEFAULT '{"instructions": "Retirada no balcão da loja mediante agendamento."}'::JSONB,
    ordering_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    policies_version TEXT NOT NULL DEFAULT '1.0',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. AUDIT_LOGS (Auditoria de ações administrativas)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    safe_diff JSONB NOT NULL DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. STOCK_LOTS & STOCK_ALLOCATIONS (Controle de lotes e validades de alimentos)
CREATE TABLE IF NOT EXISTS public.stock_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    batch_code TEXT NOT NULL,
    produced_at DATE NOT NULL,
    expires_at DATE NOT NULL,
    on_hand INT NOT NULL DEFAULT 0 CHECK (on_hand >= 0),
    reserved INT NOT NULL DEFAULT 0 CHECK (reserved >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT stock_lots_dates_check CHECK (produced_at <= expires_at),
    CONSTRAINT stock_lots_on_hand_gte_reserved CHECK (on_hand >= reserved)
);

CREATE TABLE IF NOT EXISTS public.stock_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.stock_reservations(id) ON DELETE CASCADE,
    lot_id UUID NOT NULL REFERENCES public.stock_lots(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ÍNDICES DE PERFORMANCE E CONSULTAS CRÍTICAS
CREATE INDEX IF NOT EXISTS idx_products_status_category ON public.products(status, category_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id, active);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON public.orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON public.orders(order_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservations_status_expires ON public.stock_reservations(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_slot_reservations_status_expires ON public.slot_reservations(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_status_expires ON public.coupon_redemptions(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_outbox_status_next_attempt ON public.outbox(status, next_attempt_at) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_webhook_events_dedup ON public.webhook_events(deduplication_key);
