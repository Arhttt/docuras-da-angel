# Contratos da API - Doces da Angel

Todos os endpoints de negócio utilizam o prefixo `/api/v1` e respondem em JSON com cabeçalho `Content-Type: application/json; charset=utf-8`.

## Formato Padrão de Resposta de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados da requisição inválidos",
    "fieldErrors": {
      "postalCode": ["CEP não atendido para entrega"]
    },
    "requestId": "req_01j8m4n2..."
  }
}
```

---

## Endpoints Públicos

### 1. Catálogo de Produtos
- **Método:** `GET /api/v1/products`
- **Query Params:**
  - `category` (string, opcional): slug da categoria
  - `search` (string, opcional): termo de busca
  - `sort` (enum: `price_asc`, `price_desc`, `name_asc`, `name_desc`): ordenação
  - `page` (number, opcional, default 1)
  - `limit` (number, opcional, default 20)
- **Retorno:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "prod_123",
          "name": "Bolo de Pote de Cenoura com Chocolate",
          "slug": "bolo-de-pote-cenoura-chocolate",
          "description": "...",
          "category": { "name": "Bolo de Pote", "slug": "bolo-de-pote" },
          "variants": [
            {
              "id": "var_456",
              "sku": "BOLO-POT-200G",
              "label": "200g",
              "unitLabel": "pote",
              "priceCents": 1800,
              "available": true,
              "minQty": 1,
              "maxQty": 10
            }
          ],
          "images": [
            { "storagePath": "products/bolo-pote-1.webp", "altText": "Bolo de pote decorado" }
          ]
        }
      ],
      "pagination": { "page": 1, "limit": 20, "total": 6, "totalPages": 1 }
    }
  }
  ```

---

### 2. Cotação de Checkout (Quote)
- **Método:** `POST /api/v1/checkout/quote`
- **Descrição:** Recalcula totais autoritativos, valida disponibilidade, verifica cupom e calcula frete. **Não faz reserva.**
- **Body:**
  ```json
  {
    "items": [
      { "variantId": "3b29c9fa-8b2b-4fa6-8f24-9b57ce672322", "quantity": 2 }
    ],
    "couponCode": "BEMVINDO10",
    "fulfillment": {
      "type": "delivery",
      "postalCode": "01310100",
      "slotId": "9a6c7e1f-..."
    }
  }
  ```
- **Retorno:**
  ```json
  {
    "success": true,
    "data": {
      "subtotalCents": 3600,
      "discountCents": 360,
      "deliveryFeeCents": 800,
      "totalCents": 4040,
      "currency": "BRL",
      "coupon": {
        "code": "BEMVINDO10",
        "description": "10% de desconto no subtotal"
      },
      "fulfillment": {
        "type": "delivery",
        "zoneName": "Região Central",
        "estimatedDelivery": "Hoje, entre 14h e 17h"
      },
      "quoteExpiresAt": "2026-09-28T18:45:00Z"
    }
  }
  ```

---

### 3. Criação de Pedido e Checkout
- **Método:** `POST /api/v1/checkout`
- **Headers:** `Idempotency-Key: <UUID>`
- **Descrição:** Revalida tudo, efetua reserva atômica de estoque e vaga de horário, cria pedido e gera link de pagamento.
- **Body:**
  ```json
  {
    "contact": {
      "name": "Maria Silva",
      "email": "maria@exemplo.com",
      "phone": "11999998888"
    },
    "fulfillment": {
      "type": "delivery",
      "address": {
        "recipient": "Maria Silva",
        "postalCode": "01310100",
        "street": "Avenida Paulista",
        "number": "1000",
        "complement": "Apto 42",
        "district": "Bela Vista",
        "city": "São Paulo",
        "state": "SP"
      },
      "slotId": "9a6c7e1f-..."
    },
    "items": [
      { "variantId": "3b29c9fa-8b2b-4fa6-8f24-9b57ce672322", "quantity": 2 }
    ],
    "couponCode": "BEMVINDO10"
  }
  ```
- **Retorno (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "4c94d01b-...",
      "publicNumber": "ANGEL-20260928-8921",
      "paymentUrl": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=...",
      "expiresAt": "2026-09-28T18:40:00Z",
      "totals": {
        "subtotalCents": 3600,
        "discountCents": 360,
        "deliveryFeeCents": 800,
        "totalCents": 4040
      }
    }
  }
  ```

---

### 4. Consulta de Pedido
- **Método:** `GET /api/v1/orders/[id]`
- **Headers:** `Authorization: Bearer <GuestToken ou SupabaseSession>`
- **Retorno:** Snapshot seguro do pedido, itens, pagamentos e linha do tempo de atendimento.

---

### 5. Solicitação de Link Mágico para Visitante
- **Método:** `POST /api/v1/orders/access-link`
- **Body:** `{ "email": "cliente@exemplo.com", "publicNumber": "ANGEL-20260928-8921" }`
- **Retorno:** Resposta genérica `{ "success": true, "message": "Se os dados coincidirem, enviamos o link para seu email." }`

---

### 6. Formulário de Encomendas
- **Método:** `POST /api/v1/inquiries`
- **Body:** `{ "name": "...", "email": "...", "phone": "...", "requestedDate": "2026-10-15", "description": "..." }`
