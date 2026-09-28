-- ==============================================================================
-- DOCES DA ANGEL - MIGRATION 003: TRANSACTIONAL FUNCTIONS (app_private)
-- Data: 28 de setembro de 2026
-- ==============================================================================

-- 1. FUNÇÃO: CRIAR PEDIDO COM RESERVAS ATÔMICAS DE ESTOQUE E VAGA
CREATE OR REPLACE FUNCTION app_private.create_order_with_reservations(
    p_public_number TEXT,
    p_user_id UUID,
    p_contact_snapshot JSONB,
    p_address_snapshot JSONB,
    p_fulfillment_type public.fulfillment_type,
    p_slot_id UUID,
    p_subtotal_cents INT,
    p_discount_cents INT,
    p_delivery_fee_cents INT,
    p_total_cents INT,
    p_coupon_id UUID,
    p_items JSONB, -- Array de { variant_id, quantity, unit_price_cents, name_snapshot, sku_snapshot, variant_snapshot }
    p_expires_in_minutes INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID := gen_random_uuid();
    v_expires_at TIMESTAMPTZ := NOW() + (p_expires_in_minutes || ' minutes')::INTERVAL;
    v_item JSONB;
    v_variant_id UUID;
    v_qty INT;
    v_unit_price INT;
    v_on_hand INT;
    v_reserved INT;
    v_slot_capacity INT;
    v_slot_reserved INT;
    v_slot_confirmed INT;
BEGIN
    -- Validação básica dos totais
    IF p_total_cents <> (p_subtotal_cents - p_discount_cents + p_delivery_fee_cents) THEN
        RAISE EXCEPTION 'Consistência de totais inválida' USING ERRCODE = 'P0001';
    END IF;

    -- 1. Bloqueio e reserva de estoque para cada variante (ordenado por ID para prevenir deadlocks)
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) ORDER BY (value->>'variant_id')::UUID
    LOOP
        v_variant_id := (v_item->>'variant_id')::UUID;
        v_qty := (v_item->>'quantity')::INT;
        v_unit_price := (v_item->>'unit_price_cents')::INT;

        IF v_qty <= 0 THEN
            RAISE EXCEPTION 'Quantidade de item inválida: %', v_qty USING ERRCODE = 'P0002';
        END IF;

        -- Bloquear linha de inventário para atualização segura
        SELECT on_hand, reserved INTO v_on_hand, v_reserved
        FROM public.inventory
        WHERE variant_id = v_variant_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Variante % não encontrada no inventário', v_variant_id USING ERRCODE = 'P0003';
        END IF;

        -- Conferir saldo disponível
        IF (v_on_hand - v_reserved) < v_qty THEN
            RAISE EXCEPTION 'Estoque insuficiente para a variante % (Disponível: %, Solicitado: %)',
                v_variant_id, (v_on_hand - v_reserved), v_qty USING ERRCODE = 'P0004';
        END IF;

        -- Atualizar reserva de estoque
        UPDATE public.inventory
        SET reserved = reserved + v_qty,
            updated_at = NOW()
        WHERE variant_id = v_variant_id;

        -- Registrar reserva
        INSERT INTO public.stock_reservations (order_id, variant_id, quantity, expires_at, status)
        VALUES (v_order_id, v_variant_id, v_qty, v_expires_at, 'active');

        -- Registrar movimentação
        INSERT INTO public.stock_movements (variant_id, order_id, on_hand_delta, reserved_delta, reason)
        VALUES (v_variant_id, v_order_id, 0, v_qty, 'Reserva de checkout');
    END LOOP;

    -- 2. Reserva de vaga de atendimento (se aplicável)
    IF p_slot_id IS NOT NULL THEN
        SELECT capacity, reserved_count, confirmed_count
        INTO v_slot_capacity, v_slot_reserved, v_slot_confirmed
        FROM public.fulfillment_slots
        WHERE id = p_slot_id AND active = TRUE
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Janela de atendimento não encontrada ou inativa' USING ERRCODE = 'P0005';
        END IF;

        IF (v_slot_reserved + v_slot_confirmed) >= v_slot_capacity THEN
            RAISE EXCEPTION 'Janela de atendimento sem vagas disponíveis' USING ERRCODE = 'P0006';
        END IF;

        UPDATE public.fulfillment_slots
        SET reserved_count = reserved_count + 1
        WHERE id = p_slot_id;

        INSERT INTO public.slot_reservations (order_id, slot_id, status, expires_at)
        VALUES (v_order_id, p_slot_id, 'active', v_expires_at);
    END IF;

    -- 3. Reserva de cupom (se fornecido)
    IF p_coupon_id IS NOT NULL AND p_discount_cents > 0 THEN
        INSERT INTO public.coupon_redemptions (coupon_id, order_id, user_id, discount_applied_cents, status, expires_at)
        VALUES (p_coupon_id, v_order_id, p_user_id, p_discount_cents, 'active', v_expires_at);
    END IF;

    -- 4. Criação do cabeçalho do pedido
    INSERT INTO public.orders (
        id, public_number, user_id, contact_snapshot, address_snapshot,
        fulfillment_type, slot_id, subtotal_cents, discount_cents, delivery_fee_cents,
        total_cents, currency, order_status, fulfillment_status, expires_at
    ) VALUES (
        v_order_id, p_public_number, p_user_id, p_contact_snapshot, p_address_snapshot,
        p_fulfillment_type, p_slot_id, p_subtotal_cents, p_discount_cents, p_delivery_fee_cents,
        p_total_cents, 'BRL', 'pending_payment', 'unstarted', v_expires_at
    );

    -- 5. Criação dos itens do pedido
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id, variant_id, name_snapshot, sku_snapshot, variant_snapshot,
            unit_price_cents, quantity, line_total_cents
        ) VALUES (
            v_order_id,
            (v_item->>'variant_id')::UUID,
            v_item->>'name_snapshot',
            v_item->>'sku_snapshot',
            v_item->>'variant_snapshot',
            (v_item->>'unit_price_cents')::INT,
            (v_item->>'quantity')::INT,
            (v_item->>'unit_price_cents')::INT * (v_item->>'quantity')::INT
        );
    END LOOP;

    -- 6. Evento de criação de pedido
    INSERT INTO public.order_events (order_id, event_type, next_state, safe_metadata)
    VALUES (v_order_id, 'order_created', 'pending_payment', jsonb_build_object('expires_at', v_expires_at));

    RETURN jsonb_build_object(
        'order_id', v_order_id,
        'public_number', p_public_number,
        'expires_at', v_expires_at,
        'total_cents', p_total_cents
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, app_private, pg_temp;

-- 2. FUNÇÃO: CONFIRMAR PAGAMENTO E EFETUAR BAIXA DEFINITIVA DE ESTOQUE
CREATE OR REPLACE FUNCTION app_private.confirm_order_payment(
    p_order_id UUID,
    p_provider_payment_id TEXT,
    p_provider TEXT,
    p_amount_cents INT,
    p_attempt_key TEXT,
    p_raw_payload JSONB DEFAULT '{}'::JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    v_order public.orders%ROWTYPE;
    v_res RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pedido não encontrado' USING ERRCODE = 'P0010';
    END IF;

    -- Se o pedido já estiver confirmado, registrar pagamento idempotente e retornar
    IF v_order.order_status = 'confirmed' THEN
        RETURN TRUE;
    END IF;

    -- Baixar estoque: decrementar on_hand e reserved
    FOR v_res IN
        SELECT variant_id, quantity FROM public.stock_reservations
        WHERE order_id = p_order_id AND status = 'active'
    LOOP
        UPDATE public.inventory
        SET on_hand = on_hand - v_res.quantity,
            reserved = reserved - v_res.quantity,
            updated_at = NOW()
        WHERE variant_id = v_res.variant_id;

        INSERT INTO public.stock_movements (variant_id, order_id, on_hand_delta, reserved_delta, reason)
        VALUES (v_res.variant_id, p_order_id, -v_res.quantity, -v_res.quantity, 'Baixa de venda confirmada');
    END LOOP;

    -- Atualizar status das reservas
    UPDATE public.stock_reservations SET status = 'consumed' WHERE order_id = p_order_id;

    -- Confirmar vaga de atendimento
    IF v_order.slot_id IS NOT NULL THEN
        UPDATE public.fulfillment_slots
        SET reserved_count = GREATEST(0, reserved_count - 1),
            confirmed_count = confirmed_count + 1
        WHERE id = v_order.slot_id;

        UPDATE public.slot_reservations SET status = 'consumed' WHERE order_id = p_order_id;
    END IF;

    -- Consumir cupom
    UPDATE public.coupon_redemptions SET status = 'consumed' WHERE order_id = p_order_id;

    -- Atualizar status do pedido
    UPDATE public.orders
    SET order_status = 'confirmed',
        updated_at = NOW()
    WHERE id = p_order_id;

    -- Registrar pagamento
    INSERT INTO public.payments (order_id, provider, provider_payment_id, status, amount_cents, attempt_key, raw_payload)
    VALUES (p_order_id, p_provider, p_provider_payment_id, 'approved', p_amount_cents, p_attempt_key, p_raw_payload)
    ON CONFLICT (attempt_key) DO UPDATE
    SET status = 'approved', updated_at = NOW();

    -- Registrar evento
    INSERT INTO public.order_events (order_id, event_type, previous_state, next_state, safe_metadata)
    VALUES (p_order_id, 'payment_confirmed', 'pending_payment', 'confirmed', jsonb_build_object('payment_id', p_provider_payment_id));

    -- Enfileirar email de confirmação na outbox
    INSERT INTO public.outbox (event_key, type, payload)
    VALUES (
        'order_confirmed_' || p_order_id,
        'order_confirmed',
        jsonb_build_object(
            'order_id', p_order_id,
            'public_number', v_order.public_number,
            'email', v_order.contact_snapshot->>'email',
            'name', v_order.contact_snapshot->>'name'
        )
    ) ON CONFLICT (event_key) DO NOTHING;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, app_private, pg_temp;

-- 3. FUNÇÃO: EXPIRAR PEDIDOS PENDENTES E LIBERAR RESERVAS
CREATE OR REPLACE FUNCTION app_private.expire_stale_reservations()
RETURNS INT AS $$
DECLARE
    v_order RECORD;
    v_count INT := 0;
    v_res RECORD;
BEGIN
    FOR v_order IN
        SELECT id FROM public.orders
        WHERE order_status = 'pending_payment' AND expires_at < NOW()
        FOR UPDATE SKIP LOCKED
    LOOP
        -- Liberar reservas de estoque
        FOR v_res IN
            SELECT variant_id, quantity FROM public.stock_reservations
            WHERE order_id = v_order.id AND status = 'active'
        LOOP
            UPDATE public.inventory
            SET reserved = GREATEST(0, reserved - v_res.quantity),
                updated_at = NOW()
            WHERE variant_id = v_res.variant_id;

            INSERT INTO public.stock_movements (variant_id, order_id, on_hand_delta, reserved_delta, reason)
            VALUES (v_res.variant_id, v_order.id, 0, -v_res.quantity, 'Liberação de reserva expirada');
        END LOOP;

        UPDATE public.stock_reservations SET status = 'released' WHERE order_id = v_order.id;

        -- Liberar vaga de atendimento
        UPDATE public.fulfillment_slots
        SET reserved_count = GREATEST(0, reserved_count - 1)
        WHERE id IN (
            SELECT slot_id FROM public.slot_reservations
            WHERE order_id = v_order.id AND status = 'active'
        );

        UPDATE public.slot_reservations SET status = 'released' WHERE order_id = v_order.id;

        -- Liberar cupom
        UPDATE public.coupon_redemptions SET status = 'released' WHERE order_id = v_order.id;

        -- Atualizar status do pedido
        UPDATE public.orders
        SET order_status = 'expired',
            updated_at = NOW()
        WHERE id = v_order.id;

        -- Registrar evento
        INSERT INTO public.order_events (order_id, event_type, previous_state, next_state)
        VALUES (v_order.id, 'order_expired', 'pending_payment', 'expired');

        v_count := v_count + 1;
    END LOOP;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, app_private, pg_temp;
