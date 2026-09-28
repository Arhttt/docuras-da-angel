# Progresso da Implementação - Doces da Angel

Este arquivo registra a evolução cronológica das fases de desenvolvimento do projeto Doces da Angel.

## Sumário das Fases

- [x] **Fase 1: Base Executável e Estrutura Modular**
  - [x] Inicialização do Next.js 16 + React 19 + TypeScript strict + Tailwind CSS.
  - [x] Configuração de tokens de design e variáveis visuais conforme diretrizes da marca.
  - [x] Instalação e lock de dependências (`@supabase/supabase-js`, `@supabase/ssr`, `zod`, `react-hook-form`, `lucide-react`, `mercadopago`, `vitest`).
  - [x] Criação de `vitest.config.ts` e suíte de testes unitários iniciais.
  - [x] Documentação inicial (`decisions.md`, `pendencias.md`, `stack.md`, `progresso.md`, `api.md`, `custos.md`, `model.md`).
  - [x] Configuração do `.env.example` com validação de runtime.
  - [x] Layout base responsivo com cabeçalho, navegação, rodapé e gaveta de carrinho.

- [ ] **Fase 2: Banco de Dados e Identidade**
  - [ ] Migrations SQL completas com todas as 28 tabelas e views.
  - [ ] Constraints de integridade, índices de alta performance e Row Level Security (RLS).
  - [ ] Funções transacionais no schema `app_private` para reservas atômicas de estoque.
  - [ ] Configuração do cliente Supabase SSR (Browser, Server, Middleware/Route Handler).
  - [ ] Seed com os 6 produtos em rascunho e script de criação do primeiro administrador.

- [ ] **Fase 3: Catálogo, Páginas Públicas e Conteúdo**
  - [ ] Landing page institucional e acolhedora com destaque para os doces.
  - [ ] Catálogo completo (`/doces`) com filtros por categoria, busca e disponibilidade.
  - [ ] Página de detalhes do produto (`/doces/[slug]`) com seleção de variantes e informações claras.
  - [ ] Carrinho reativo no cliente com persistência em localStorage e sincronização de itens.
  - [ ] Painel de gestão do catálogo no admin (`/admin/produtos`).

- [ ] **Fase 4: Compra, Cotação e Estoque**
  - [ ] Contrato de cotação `/api/v1/checkout/quote`.
  - [ ] Contrato de checkout transacional `/api/v1/checkout` com Idempotency-Key.
  - [ ] Motor de cálculo de frete por faixas de CEP e janelas de atendimento.
  - [ ] Motor de cupons de desconto (regras percentuais, teto, valor mínimo e reserva).
  - [ ] Reserva atômica de estoque e expiração de vagas.

- [ ] **Fase 5: Pagamento e Comunicação**
  - [ ] Adaptador do Mercado Pago Checkout Pro (Pix + Cartão).
  - [ ] Adaptador de pagamento Mock para testes e desenvolvimento offline.
  - [ ] Webhook seguro com validação de payload e reconciliação idempotente.
  - [ ] Jobs em background para expiração de reservas e reconciliação de pagamentos pendentes.
  - [ ] Tabela Outbox e despachante de emails transacionais (confirmação, status e link de acesso).

- [ ] **Fase 6: Gestão Operacional e Conta**
  - [ ] Acompanhamento de pedidos para visitantes via token mágico com hash seguro (`/acompanhar`).
  - [ ] Área do cliente (`/minha-conta`) com histórico de compras e gestão de endereços.
  - [ ] Dashboard administrativo (`/admin`) com métricas financeiras reais (receita bruta, líquida, ticket médio).
  - [ ] Gestão de pedidos e linha do tempo de atendimento (`/admin/pedidos/[id]`).
  - [ ] Formulário de encomendas personalizadas (`/encomendas`).
  - [ ] Trilha de auditoria operacional inviolável (`audit_logs`).

- [ ] **Fase 7: Revisão, Acessibilidade, Testes e Publicação**
  - [ ] Suíte de testes unitários e de integração (cálculo monetário, concorrência, idempotência, segurança).
  - [ ] Auditoria de acessibilidade WCAG (contraste, navegação por teclado, leitor de tela).
  - [ ] Otimização de SEO (metadados Open Graph, JSON-LD, sitemap, robots.txt).
  - [ ] Manual de operações, plano de contingência e procedimentos de rollback.
