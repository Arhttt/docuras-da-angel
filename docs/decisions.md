# Registro de Decisões de Arquitetura (ADR) - Doces da Angel

## ADR-001: Arquitetura Monolítica Modular com Next.js App Router
- **Status:** Aprovado
- **Data:** 28/09/2026
- **Contexto:** Necessidade de construir uma loja completa (apresentação, catálogo, carrinho, checkout, pagamentos, área do cliente e painel administrativo) com rapidez, manutenibilidade e baixo custo operacional.
- **Decisão:** Monólito modular utilizando Next.js App Router (React 19 + TypeScript strict). Frontend e backend residem na mesma aplicação através de Server Components, Server Actions e Route Handlers (`/api/v1/`).
- **Consequências:** Elimina overhead de microserviços ou servidores Express separados. Simplifica deploys e garante tipagem compartilhada ponta a ponta.

---

## ADR-002: Banco de Dados Relacional e Identidade com Supabase PostgreSQL & Auth SSR
- **Status:** Aprovado
- **Data:** 28/09/2026
- **Contexto:** Operações de comércio exigem consistência transacional forte (ACID), reserva atômica de estoque, integridade referencial e auditoria rigorosa.
- **Decisão:** Supabase PostgreSQL com migrações SQL nativas versionadas em `supabase/migrations/`. Autenticação via Supabase Auth SSR oficial (`@supabase/ssr`). Row Level Security (RLS) e funções transacionais em schema privado (`app_private`).
- **Consequências:** Sem uso de ORMs complexos (Prisma/Drizzle) que introduzem camada extra sobre migrations nativas; RLS garante isolamento entre clientes e visitantes; funções transacionais garantem que saldo e reservas nunca fiquem negativos sob concorrência.

---

## ADR-003: Gestão de Preços, Estoque e Idempotência no Servidor
- **Status:** Aprovado
- **Data:** 28/09/2026
- **Contexto:** Prevenção de manipulação de preços no cliente e pedidos duplicados por clique duplo ou instabilidade de rede.
- **Decisão:** Preços e disponibilidades são calculados exclusivamente no servidor a partir do PostgreSQL. O checkout exige chave de idempotência (`Idempotency-Key`) combinada com hash da requisição. Valores monetários são armazenados como inteiros em centavos de BRL (`price_cents`, `total_cents`).
- **Consequências:** Impossibilidade de fraude de preço no cliente. Checkout e pagamentos repetidos retornam a mesma resposta durável sem duplicar pedidos ou débitos.

---

## ADR-004: Gateway de Pagamento Mercado Pago Checkout Pro com Adaptador Abstrato
- **Status:** Aprovado
- **Data:** 28/09/2026
- **Contexto:** O projeto comercializará doces com meios de pagamento populares no Brasil (Pix, cartão), com fallback de simulação/mock isolado para desenvolvimento e testes automatizados.
- **Decisão:** Integração com Mercado Pago Checkout Pro através de uma interface de adaptador `PaymentGatewayAdapter`. Implementação oficial `MercadoPagoCheckoutProAdapter` e implementação `MockPaymentGatewayAdapter` para ambiente de testes e CI.
- **Consequências:** Desacoplamento do provedor de pagamento. Em produção, `PAYMENT_MODE=mock` é estritamente bloqueado por validação de inicialização.

---

## ADR-005: Sistema de Design Acolhedor com Tailwind CSS e Cores da Marca
- **Status:** Aprovado
- **Data:** 28/09/2026
- **Contexto:** A confeitaria precisa transmitir calor, afeto e confiança, com contraste acessível e foco visual nos doces.
- **Decisão:** Paleta baseada no guia de estilo:
  - Fundo: Creme claro (`#FFF8EF`)
  - Texto: Marrom escuro (`#3B241B`)
  - Botão/Ação Principal: Vinho (`#7A263A`)
  - Apoio: Rosa claro (`#F4D7DA`) e Caramelo (`#B77A43`)
  - Tipografia: Serifada para títulos e Sans-serif legível para corpo e controles.
