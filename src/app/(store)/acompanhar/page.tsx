'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Package, Clock, CheckCircle2, MapPin, ChefHat, Truck, ArrowRight, Phone } from 'lucide-react';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get('pedido') || '';

  const [orderIdInput, setOrderIdInput] = useState(queryOrder);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryOrder) {
      handleSearchOrder(queryOrder);
    }
  }, [queryOrder]);

  const handleSearchOrder = (id: string) => {
    setSearched(true);
    const cleanId = id.trim().toUpperCase();

    // Check localStorage history
    try {
      const historyRaw = localStorage.getItem('doces_angel_orders_history');
      if (historyRaw) {
        const history = JSON.parse(historyRaw);
        const match = history.find((o: any) => o.orderId.toUpperCase() === cleanId);
        if (match) {
          setCurrentOrder(match);
          return;
        }
      }

      const lastRaw = localStorage.getItem('doces_angel_last_order');
      if (lastRaw) {
        const last = JSON.parse(lastRaw);
        if (last.orderId.toUpperCase() === cleanId) {
          setCurrentOrder(last);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback demo order if user typed something generic like "ANGEL-123"
    if (cleanId.startsWith('ANGEL')) {
      setCurrentOrder({
        orderId: cleanId,
        createdAt: new Date().toISOString(),
        customer: {
          fullName: 'Cliente Angel',
          email: 'cliente@exemplo.com.br',
          phone: '(11) 98765-4321',
        },
        fulfillment: {
          type: 'pickup',
          address: null,
          slot: 'Tarde (14h às 18h)',
        },
        payment: {
          method: 'pix',
          status: 'paid',
        },
        items: [
          {
            name: 'Balas Banhadas Caramelizadas',
            variantLabel: 'Porção 300g (~24 un)',
            quantity: 1,
            priceCents: 5200,
          },
          {
            name: 'Doce de Leite Artesanal da Angel',
            variantLabel: 'Pote de Vidro 250g',
            quantity: 1,
            priceCents: 2400,
          },
        ],
        subtotalCents: 7600,
        deliveryFeeCents: 0,
        totalCents: 7600,
      });
    } else {
      setCurrentOrder(null);
    }
  };

  const steps = [
    { label: 'Pedido Recebido', desc: 'Registrado no sistema', icon: Package, completed: true },
    { label: 'Pagamento Aprovado', desc: 'Reserva confirmada', icon: CheckCircle2, completed: true },
    { label: 'Em Preparo Artesanal', desc: 'No fogo e modelagem no ateliê', icon: ChefHat, completed: true, current: true },
    { label: 'Pronto / Em Rota', desc: 'Aguardando retirada ou envio', icon: Truck, completed: false },
    { label: 'Entregue', desc: 'Saboreado com carinho', icon: CheckCircle2, completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#B77A43]">
          Acompanhamento em Tempo Real
        </span>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B]">
          Consultar Status do Pedido
        </h1>
        <p className="text-sm text-[#6E584D]">
          Digite o código do pedido recebido por e-mail ou na tela de confirmação (ex: ANGEL-2026-...)
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8D5C4] p-4 sm:p-5 shadow-xs max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchOrder(orderIdInput);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7C675B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Digite o código (ex: ANGEL-2026-123456)"
              className="w-full bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm uppercase font-mono font-medium text-[#3B241B] placeholder-[#7C675B]/60 focus:border-[#7A263A] focus:outline-none"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="cursor-pointer">
            Buscar
          </Button>
        </form>
      </div>

      {/* Search Result */}
      {currentOrder ? (
        <div className="space-y-8">
          {/* Order Header Summary */}
          <div className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E7DC] pb-4">
              <div>
                <span className="text-xs text-[#7C675B]">Status atual:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B77A43] animate-pulse"></span>
                  <h2 className="font-serif-title text-xl font-bold text-[#3B241B]">
                    Em Preparo no Ateliê
                  </h2>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-[#7C675B] block">Código do Pedido:</span>
                <span className="font-mono font-bold text-sm text-[#7A263A]">
                  {currentOrder.orderId}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-1.5 transition-all ${
                        st.current
                          ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                          : st.completed
                          ? 'border-[#E8D5C4] bg-white text-[#3B241B]'
                          : 'border-[#F3E7DC] bg-[#FFF8EF]/50 opacity-50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          st.current
                            ? 'bg-[#7A263A] text-white'
                            : st.completed
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#F3E7DC] text-[#7C675B]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-serif-title font-bold text-xs text-[#3B241B]">
                        {st.label}
                      </span>
                      <span className="text-[10px] text-[#7C675B] leading-tight">
                        {st.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F3E7DC] text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-[#3B241B] block">Modalidade de Atendimento:</span>
                <p className="text-[#6E584D]">
                  {currentOrder.fulfillment.type === 'pickup'
                    ? 'Retirada no Ateliê (Rua das Camélias, 142 — Ivaiporã, PR)'
                    : `Entrega: ${currentOrder.fulfillment.address?.street}, ${currentOrder.fulfillment.address?.number}`}
                </p>
                <p className="text-[#7A263A] font-semibold">
                  Previsão de janela: {currentOrder.fulfillment.slot}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-[#3B241B] block">Itens da Encomenda:</span>
                <ul className="space-y-1 text-[#6E584D]">
                  {currentOrder.items.map((it: any, idx: number) => (
                    <li key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name} ({it.variantLabel})</span>
                      <span className="font-semibold text-[#3B241B]">{formatCentsToBrl(it.priceCents * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-[#F3E7DC] flex justify-between font-bold text-sm text-[#7A263A]">
                  <span>Total do Pedido:</span>
                  <span>{formatCentsToBrl(currentOrder.totalCents)}</span>
                </div>
              </div>
            </div>

            {/* Support Notice */}
            <div className="p-4 bg-[#FFF8EF] rounded-2xl border border-[#E8D5C4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B77A43]" />
                <span className="text-[#6E584D]">Precisa alterar o horário ou falar com a Angel?</span>
              </div>
              <a
                href="https://wa.me/5511987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#7A263A] hover:underline"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="bg-white rounded-3xl border border-[#E8D5C4] p-10 text-center space-y-3 max-w-md mx-auto">
          <p className="font-serif-title font-bold text-lg text-[#3B241B]">Pedido não localizado</p>
          <p className="text-xs text-[#7C675B] leading-relaxed">
            Verifique se o código foi digitado corretamente. Em caso de dúvidas, consulte o e-mail de confirmação ou nos contate no ateliê.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function OrderTrackerPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm text-[#7C675B]">Carregando acompanhamento...</div>}>
      <OrderTrackerContent />
    </Suspense>
  );
}
