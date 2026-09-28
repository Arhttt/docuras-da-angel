-- ==============================================================================
-- DOCES DA ANGEL - SEED DATA (DADOS INICIAIS E RASCUNHOS)
-- Data: 28 de setembro de 2026
-- ==============================================================================

-- 1. CONFIGURAÇÃO DA LOJA (Loja fechada para vendas reais por padrão)
INSERT INTO public.store_settings (
    id, store_name, tagline, phone, email, address_display, pickup_details, ordering_enabled, policies_version
) VALUES (
    1,
    'Doces da Angel',
    'Confeitaria Artesanal',
    '(Aguardando confirmação de WhatsApp)',
    'contato@docesdaangel.com.br',
    'Balcão de Atendimento - Localização a confirmar',
    '{"instructions": "Retirada no balcão da loja mediante agendamento prévio.", "prep_time_hours": 24}'::JSONB,
    FALSE, -- Vendas reais desabilitadas até aprovação comercial
    '1.0'
) ON CONFLICT (id) DO UPDATE
SET store_name = EXCLUDED.store_name,
    tagline = EXCLUDED.tagline;

-- 2. CATEGORIAS DE PRODUTOS
INSERT INTO public.categories (id, name, slug, description, active, sort_order) VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Balas & Doces Finos', 'balas-e-doces-finos', 'Balas caramelizadas e doces finos artesanais', TRUE, 1),
    ('c2222222-2222-2222-2222-222222222222', 'Doces de Colher & Potes', 'doces-de-colher-e-potes', 'Doces tradicionais apurados no ponto ideal', TRUE, 2),
    ('c3333333-3333-3333-3333-333333333333', 'Doces Tradicionais', 'doces-tradicionais', 'Clássicos da doçaria brasileira', TRUE, 3),
    ('c4444444-4444-4444-4444-444444444444', 'Bolos & Sobremesas', 'bolos-e-sobremesas', 'Bolos no pote e sobremesas individuais', TRUE, 4),
    ('c5555555-5555-5555-5555-555555555555', 'Doces Típicos de Amendoim', 'doces-tipicos-de-amendoim', 'Doces tradicionais crocantes e cremosos', TRUE, 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUTOS EM RASCUNHO (Preservando nomes exatos sem preços fictícios publicados)
-- 3.1 Balas banhadas
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Balas banhadas',
    'balas-banhadas',
    'Balas caramelizadas artesanais banhadas com casquinha crocante e recheio cremoso. Informações de ingredientes e peso aguardando confirmação do responsável.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.2 Doce de leite
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Doce de leite',
    'doce-de-leite',
    'Doce de leite tradicional apurado lentamente com textura aveludada. Informações de embalagem e validade aguardando confirmação.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.3 Cocada
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p3333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'Cocada',
    'cocada',
    'Cocada artesanal preparada com coco fresco. Informações comerciais e variantes pendentes de confirmação.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.4 Bolo de pote
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p4444444-4444-4444-4444-444444444444',
    'c4444444-4444-4444-4444-444444444444',
    'Bolo de pote',
    'bolo-de-pote',
    'Bolo de pote fofinho com camadas generosas de recheio. Sabores e tabela nutricional aguardando cadastro.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.5 Pé de moleque
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p5555555-5555-5555-5555-555555555555',
    'c5555555-5555-5555-5555-555555555555',
    'Pé de moleque',
    'pe-de-moleque',
    'Doce crocante tradicional com amendoim torrado no ponto e calda brilhante. Cadastro de embalagens pendente.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.6 Pé de moça
INSERT INTO public.products (
    id, category_id, name, slug, description, status, featured
) VALUES (
    'p6666666-6666-6666-6666-666666666666',
    'c5555555-5555-5555-5555-555555555555',
    'Pé de moça',
    'pe-de-moca',
    'Doce macio e cremoso de leite condensado com amendoim. Aguardando informações de preço e validade para publicação.',
    'draft',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 4. VARIANTES DEMONSTRATIVAS EM RASCUNHO (Preço 0 indicando pendência de aprovação comercial)
INSERT INTO public.product_variants (id, product_id, sku, label, unit_label, price_cents, active, min_qty, max_qty) VALUES
    ('v1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'BALA-BANH-100G', 'Pacote 100g', 'pacote', 0, FALSE, 1, 10),
    ('v2222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'DOCE-LEIT-250G', 'Pote de Vidro 250g', 'pote', 0, FALSE, 1, 10),
    ('v3333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 'COCADA-UNID', 'Unidade Tradicional', 'unidade', 0, FALSE, 1, 20),
    ('v4444444-4444-4444-4444-444444444444', 'p4444444-4444-4444-4444-444444444444', 'BOLO-POT-200G', 'Pote 200g', 'pote', 0, FALSE, 1, 10),
    ('v5555555-5555-5555-5555-555555555555', 'p5555555-5555-5555-5555-555555555555', 'PE-MOLEQ-150G', 'Pacote 150g', 'pacote', 0, FALSE, 1, 15),
    ('v6666666-6666-6666-6666-666666666666', 'p6666666-6666-6666-6666-666666666666', 'PE-MOCA-150G', 'Pacote 150g', 'pacote', 0, FALSE, 1, 15)
ON CONFLICT (sku) DO NOTHING;

-- 5. ESTOQUE INICIAL DAS VARIANTES
INSERT INTO public.inventory (variant_id, on_hand, reserved) VALUES
    ('v1111111-1111-1111-1111-111111111111', 0, 0),
    ('v2222222-2222-2222-2222-222222222222', 0, 0),
    ('v3333333-3333-3333-3333-333333333333', 0, 0),
    ('v4444444-4444-4444-4444-444444444444', 0, 0),
    ('v5555555-5555-5555-5555-555555555555', 0, 0),
    ('v6666666-6666-6666-6666-666666666666', 0, 0)
ON CONFLICT (variant_id) DO NOTHING;

-- 6. ZONAS DE ENTREGA DE EXEMPLO (Sujeitas à configuração do administrador)
INSERT INTO public.delivery_zones (id, name, postal_code_from, postal_code_to, fee_cents, minimum_cents, active) VALUES
    ('d1111111-1111-1111-1111-111111111111', 'Região Central / Bairro Local', '01000000', '01599999', 800, 3000, TRUE),
    ('d2222222-2222-2222-2222-222222222222', 'Região Expandida', '02000000', '02999999', 1500, 5000, TRUE)
ON CONFLICT DO NOTHING;

-- 7. CUPOM DE BOAS-VINDAS DE EXEMPLO
INSERT INTO public.coupons (
    id, code, type, value, minimum_cents, max_discount_cents, starts_at, ends_at, max_uses, active
) VALUES (
    'cp111111-1111-1111-1111-111111111111',
    'BEMVINDO10',
    'percentage',
    10, -- 10%
    2000, -- R$ 20,00 mínimo
    1500, -- R$ 15,00 teto de desconto
    NOW(),
    NOW() + INTERVAL '1 year',
    500,
    TRUE
) ON CONFLICT (code) DO NOTHING;
