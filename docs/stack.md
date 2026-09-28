# Stack Tecnológica e Versões Travadas - Doces da Angel

## Ambiente de Execução
- **Node.js:** v24.21.0 (LTS)
- **NPM:** 11.19.0
- **TypeScript:** 5.x (`strict: true`)

## Framework & Frontend
- **Next.js:** 16.3.6 (App Router, Server Components, Server Actions, Route Handlers)
- **React:** 19.2.8
- **React DOM:** 19.2.8
- **Tailwind CSS:** 4.x
- **Ícones:** `lucide-react`
- **Formulários e Validação:** `react-hook-form` + `zod` + `@hookform/resolvers`

## Banco de Dados, Identidade & Storage
- **Banco de Dados:** PostgreSQL via Supabase
- **Cliente Supabase:** `@supabase/supabase-js` ^2.117.2
- **Auth SSR:** `@supabase/ssr` ^0.12.7
- **Armazenamento de Imagens:** Supabase Storage (bucket `catalog-images`)
- **Migrações:** SQL nativo versionado em `supabase/migrations/`

## Pagamentos & Mensageria
- **Gateway:** Mercado Pago Checkout Pro (`mercadopago` ^3.6.1)
- **Email Transacional:** Adaptador modular (Console / Outbox / Provedor HTTP)

## Testes & Qualidade
- **Test Runner:** `vitest` ^5.0.2
- **Ambiente de Testes:** `jsdom` ^30.1.1
- **Testing Library:** `@testing-library/react` ^16.3.3, `@testing-library/jest-dom` ^7.0.1
- **Linter:** ESLint 9.x com `eslint-config-next`

## Padrões de Código
- Tipagem estrita ponta a ponta sem uso de `any`.
- Validação no servidor em todas as rotas e mutações com esquemas Zod.
- Valores monetários exclusivamente em inteiros (centavos BRL).
- Fuso horário de exibição fixado em `America/Sao_Paulo`, com persistência em UTC `timestamptz`.
