# Levantamento de Custos e Infraestrutura - Doces da Angel

*Data da Consulta:* 28 de setembro de 2026  
*Responsável pelo Levantamento:* Equipe de Engenharia AntiGravity

| Componente | Provedor Proposto | Nível / Plano Recomendado | Custo Estimado Inicial | Limites / Observações |
| :--- | :--- | :--- | :--- | :--- |
| **Domínio Próprio** | Registro.br | `.com.br` anual | R$ 40,00 / ano | Renovação anual para `docesdaangel.com.br` |
| **Hospedagem & SSR** | Vercel | Hobby / Pro | R$ 0,00 (Hobby) a $20/mês | Suporte a Next.js Server Components e Cron Jobs |
| **Banco & Identidade** | Supabase | Free / Pro | R$ 0,00 (Free) a $25/mês | 500MB de banco PostgreSQL, 50.000 MAUs no Auth |
| **Armazenamento de Fotos** | Supabase Storage | Incluso no plano | R$ 0,00 (Free até 1GB) | Otimização WebP mantém catálogo leve (< 50MB) |
| **Gateway de Pagamento** | Mercado Pago | Checkout Pro | Sem mensalidade fixa | Pix ~0,99% por transação; Cartão ~3,99% a 4,99% |
| **Email Transacional** | Resend | Gratuito inicial | R$ 0,00 (até 3.000 emails/mês) | Suficiente para os primeiros meses de operação |
| **Monitoramento & Logs** | Vercel Analytics / Sentry | Gratuito | R$ 0,00 | Alertas de erro e performance em tempo real |

> [!NOTE]
> Os custos acima consideram o estágio de lançamento com volume inicial de vendas locais. Para escalar e ativar backups automáticos diários com retenção avançada, recomenda-se o upgrade para os planos Pro de hospedagem e banco.
