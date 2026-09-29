'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, MapPin, Clock, CreditCard, QrCode, AlertCircle, ArrowRight } from 'lucide-react';
import { useCart } from '@/modules/checkout/cart-context';
import { useAuth } from '@/modules/auth/auth-context';
import { formatCentsToBrl } from '@/lib/money';
import { formatPhone, formatCep } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clearCart, totalItems } = useCart();
  const { user } = useAuth();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('Ivaiporã');
  const [selectedSlot, setSelectedSlot] = useState('slot-1');

  // Auto-fill form when user is logged in
  React.useEffect(() => {
    if (user) {
      if (user.name && !fullName) setFullName(user.name);
      if (user.email && !email) setEmail(user.email);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.address) {
        if (user.address.postalCode && !postalCode) setPostalCode(user.address.postalCode);
        if (user.address.street && !street) setStreet(user.address.street);
        if (user.address.number && !number) setNumber(user.address.number);
        if (user.address.complement && !complement) setComplement(user.address.complement);
        if (user.address.neighborhood && !neighborhood) setNeighborhood(user.address.neighborhood);
        if (user.address.city && !city) setCity(user.address.city);
      }
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery calculation
  const deliveryFeeCents = fulfillmentType === 'delivery' ? 1200 : 0;
  const totalCents = subtotalCents + deliveryFeeCents;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Informe seu nome completo';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Informe um e-mail válido para receber o comprovante';
    if (!phone.trim() || phone.length < 10) newErrors.phone = 'Informe seu WhatsApp com DDD';

    if (fulfillmentType === 'delivery') {
      if (!postalCode.trim() || postalCode.replace(/\D/g, '').length !== 8) {
        newErrors.postalCode = 'Informe um CEP válido com 8 dígitos';
      }
      if (!street.trim()) newErrors.street = 'Informe o logradouro (rua/avenida)';
      if (!number.trim()) newErrors.number = 'Informe o número do endereço';
      if (!neighborhood.trim()) newErrors.neighborhood = 'Informe o bairro';
    }

    if (paymentMethod === 'credit_card') {
      if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 15) {
        newErrors.cardNumber = 'Informe um número de cartão válido';
      }
      if (!cardHolder.trim()) newErrors.cardHolder = 'Informe o nome conforme impresso no cartão';
      if (!cardExp.trim()) newErrors.cardExp = 'Validade (MM/AA)';
      if (!cardCvv.trim() || cardCvv.length < 3) newErrors.cardCvv = 'CVV inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);

    const orderId = `ANGEL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderData = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName,
        email,
        phone,
      },
      fulfillment: {
        type: fulfillmentType,
        address: fulfillmentType === 'delivery' ? { postalCode, street, number, complement, neighborhood, city } : null,
        slot: selectedSlot === 'slot-1' ? 'Manhã (10h às 13h)' : 'Tarde (14h às 18h)',
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'pix' ? 'pending_pix' : 'paid',
      },
      items: items.map((i) => ({
        variantId: i.variantId,
        name: i.name,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        priceCents: i.priceCents,
      })),
      subtotalCents,
      deliveryFeeCents,
      totalCents,
    };

    setTimeout(() => {
      try {
        localStorage.setItem('doces_angel_last_order', JSON.stringify(orderData));
        // Add to historical orders list
        const existingRaw = localStorage.getItem('doces_angel_orders_history');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem('doces_angel_orders_history', JSON.stringify([orderData, ...existing]));
      } catch (err) {
        console.error('Erro ao salvar pedido:', err);
      }

      clearCart();
      setIsProcessing(false);
      router.push(`/checkout/sucesso?pedido=${orderId}`);
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3B241B]">
          Seu carrinho está vazio
        </h1>
        <p className="text-sm text-[#7C675B]">
          Adicione doces ao carrinho antes de acessar a finalização do pedido.
        </p>
        <Button variant="primary" asChild>
          <Link href="/doces">Ir ao Cardápio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Checkout Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link href="/carrinho" className="text-xs text-[#7A263A] hover:underline flex items-center gap-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao carrinho</span>
          </Link>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B]">
          Finalizar Pedido
        </h1>
        <p className="text-sm text-[#6E584D]">
          Preencha seus dados de entrega e forma de pagamento para confirmar sua encomenda artesanal.
        </p>
      </div>

      <form onSubmit={handleCompleteOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Columns: Form Steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* Account Status Card */}
          {user ? (
            <div className="bg-[#FDECEF] border border-[#EED7DC] rounded-2xl p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#6E2637] text-white font-bold flex items-center justify-center text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span className="font-bold text-[#33161E] block">Comprando como {user.name}</span>
                  <span className="text-[#8C6D75]">{user.email}</span>
                </div>
              </div>
              <span className="text-[11px] text-[#6E2637] font-semibold bg-white/70 px-2.5 py-1 rounded-full border border-[#EED7DC]">
                Dados preenchidos ✓
              </span>
            </div>
          ) : (
            <div className="bg-white border border-[#EED7DC] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#33161E] block">Já tem uma conta na Doçuras da Angel?</span>
                <span className="text-[#6E4D55]">Faça login para carregar seu endereço e dados salvos.</span>
              </div>
              <Link
                href="/login?redirect=/checkout"
                className="inline-flex items-center justify-center gap-1.5 bg-[#6E2637] hover:bg-[#581D2B] text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
              >
                <span>Fazer Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Step 1: Identification */}
          <section className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#F3E7DC] pb-4">
              <div className="w-8 h-8 rounded-full bg-[#7A263A] text-white font-serif-title font-bold text-sm flex items-center justify-center">
                1
              </div>
              <div>
                <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
                  Seus Dados de Contato
                </h2>
                <p className="text-xs text-[#7C675B]">
                  Para envio da confirmação, comprovante e notificações de preparo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Nome Completo *"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                  required
                />
              </div>

              <div>
                <Input
                  type="email"
                  label="E-mail *"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              <div>
                <Input
                  type="tel"
                  label="WhatsApp / Celular *"
                  placeholder="(43) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  error={errors.phone}
                  maxLength={15}
                  required
                />
              </div>
            </div>
          </section>

          {/* Step 2: Fulfillment (Pickup vs Delivery) */}
          <section className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#F3E7DC] pb-4">
              <div className="w-8 h-8 rounded-full bg-[#7A263A] text-white font-serif-title font-bold text-sm flex items-center justify-center">
                2
              </div>
              <div>
                <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
                  Forma de Recebimento
                </h2>
                <p className="text-xs text-[#7C675B]">
                  Escolha entre retirada no ateliê em Ivaiporã ou entrega agendada.
                </p>
              </div>
            </div>

            {/* Radio Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                    : 'border-[#E8D5C4] bg-white hover:border-[#B77A43]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-title font-bold text-sm text-[#3B241B]">
                    Retirada no Ateliê
                  </span>
                  <span className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                    Grátis
                  </span>
                </div>
                <p className="text-xs text-[#7C675B] mt-1.5 leading-relaxed">
                  Rua das Camélias, 142 — Ivaiporã, PR
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                    : 'border-[#E8D5C4] bg-white hover:border-[#B77A43]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-title font-bold text-sm text-[#3B241B]">
                    Entrega Local Programada
                  </span>
                  <span className="text-xs font-bold text-[#7A263A]">
                    R$ 12,00
                  </span>
                </div>
                <p className="text-xs text-[#7C675B] mt-1.5 leading-relaxed">
                  Entrega cuidadosa na cidade de Ivaiporã e região por faixa de CEP.
                </p>
              </button>
            </div>

            {/* Delivery Address Fields */}
            {fulfillmentType === 'delivery' && (
              <div className="pt-4 border-t border-[#F3E7DC] space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3B241B] block">
                  Endereço de Entrega:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Input
                      label="CEP *"
                      placeholder="86000-000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(formatCep(e.target.value))}
                      error={errors.postalCode}
                      maxLength={9}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Rua / Logradouro *"
                      placeholder="Ex: Rua Bela Cintra"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      error={errors.street}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Input
                      label="Número *"
                      placeholder="123"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      error={errors.number}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Complemento"
                      placeholder="Apto 42, Bloco B"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                    />
                  </div>
                  <div>
                    <Input
                      label="Bairro *"
                      placeholder="Bairro"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      error={errors.neighborhood}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Fulfillment Slot Selection */}
            <div className="pt-2">
              <label htmlFor="slot-select" className="text-xs font-semibold uppercase tracking-wider text-[#3B241B] block mb-1.5">
                Janela de Horário para {fulfillmentType === 'pickup' ? 'Retirada' : 'Entrega'}:
              </label>
              <select
                id="slot-select"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#3B241B] focus:border-[#7A263A] focus:outline-none cursor-pointer"
              >
                <option value="slot-1">Manhã: 10h às 13h (Produção da alvorada)</option>
                <option value="slot-2">Tarde: 14h às 18h (Lote fresco da tarde)</option>
              </select>
            </div>
          </section>

          {/* Step 3: Payment Method */}
          <section className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-[#F3E7DC] pb-4">
              <div className="w-8 h-8 rounded-full bg-[#7A263A] text-white font-serif-title font-bold text-sm flex items-center justify-center">
                3
              </div>
              <div>
                <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
                  Forma de Pagamento
                </h2>
                <p className="text-xs text-[#7C675B]">
                  Pagamento 100% protegido com confirmação instantânea.
                </p>
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                    : 'border-[#E8D5C4] bg-white hover:border-[#B77A43]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#7A263A]" />
                    <span className="font-serif-title font-bold text-sm text-[#3B241B]">
                      Pix Instantâneo
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#7A263A] bg-[#F4D7DA] px-2 py-0.5 rounded-full">
                    Aprovação imediata
                  </span>
                </div>
                <p className="text-xs text-[#7C675B] mt-1.5 leading-relaxed">
                  QR Code e código copia-e-cola gerados após a confirmação.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                    : 'border-[#E8D5C4] bg-white hover:border-[#B77A43]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#7A263A]" />
                    <span className="font-serif-title font-bold text-sm text-[#3B241B]">
                      Cartão de Crédito
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7C675B]">
                    À vista ou parcelado
                  </span>
                </div>
                <p className="text-xs text-[#7C675B] mt-1.5 leading-relaxed">
                  Aceitamos Visa, Mastercard, Elo e American Express.
                </p>
              </button>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'credit_card' && (
              <div className="pt-4 border-t border-[#F3E7DC] space-y-4">
                <Input
                  label="Número do Cartão *"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  error={errors.cardNumber}
                  maxLength={19}
                  required
                />

                <Input
                  label="Nome Impresso no Cartão *"
                  placeholder="NOME COMO NO CARTAO"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  error={errors.cardHolder}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Validade (MM/AA) *"
                    placeholder="12/28"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    error={errors.cardExp}
                    maxLength={5}
                    required
                  />
                  <Input
                    label="Código de Segurança (CVV) *"
                    placeholder="123"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    error={errors.cardCvv}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-5 shadow-xs sticky top-28">
            <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
              Resumo da Compra
            </h2>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-[#F3E7DC]">
              {items.map((item) => (
                <div key={item.variantId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#3B241B] block">{item.name}</span>
                    <span className="text-[#7C675B]">
                      {item.quantity}x {item.variantLabel}
                    </span>
                  </div>
                  <span className="font-bold text-[#7A263A]">
                    {formatCentsToBrl(item.priceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-[#F3E7DC] pt-4 text-xs text-[#6E584D]">
              <div className="flex justify-between">
                <span>Subtotal dos doces</span>
                <span className="font-semibold text-[#3B241B]">{formatCentsToBrl(subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  {fulfillmentType === 'pickup' ? 'Taxa de Retirada' : 'Taxa de Entrega'}
                </span>
                <span className="font-semibold text-[#3B241B]">
                  {fulfillmentType === 'pickup' ? 'Grátis' : formatCentsToBrl(deliveryFeeCents)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F3E7DC] flex justify-between items-baseline">
              <span className="font-serif-title font-bold text-base text-[#3B241B]">Total a Pagar</span>
              <span className="font-serif-title font-bold text-2xl text-[#7A263A]">
                {formatCentsToBrl(totalCents)}
              </span>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isProcessing}
                className="w-full cursor-pointer"
              >
                <span>Confirmar e Pagar</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7C675B] text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B77A43] shrink-0" />
                <span>Transação segura e garantida pelo Ateliê</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
