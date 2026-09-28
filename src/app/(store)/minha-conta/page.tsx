'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, User, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

export default function MinhaContaPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  useEffect(() => {
    try {
      const historyRaw = localStorage.getItem('doces_angel_orders_history');
      if (historyRaw) {
        setOrders(JSON.parse(historyRaw));
      } else {
        const lastRaw = localStorage.getItem('doces_angel_last_order');
        if (lastRaw) {
          setOrders([JSON.parse(lastRaw)]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B]">
          Minha Área do Cliente
        </h1>
        <p className="text-sm text-[#6E584D]">
          Acompanhe seus pedidos anteriores, visualize comprovantes e consulte seus dados cadastrados.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8D5C4] gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#7A263A] text-[#7A263A]'
              : 'border-transparent text-[#7C675B] hover:text-[#3B241B]'
          }`}
        >
          Meus Pedidos ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'addresses'
              ? 'border-[#7A263A] text-[#7A263A]'
              : 'border-transparent text-[#7C675B] hover:text-[#3B241B]'
          }`}
        >
          Endereços Salvos
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[#7A263A] text-[#7A263A]'
              : 'border-transparent text-[#7C675B] hover:text-[#3B241B]'
          }`}
        >
          Dados Pessoais
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8D5C4] p-10 text-center space-y-4 max-w-md mx-auto shadow-xs">
              <Package className="w-12 h-12 text-[#B77A43] mx-auto" />
              <h3 className="font-serif-title font-bold text-lg text-[#3B241B]">
                Nenhum pedido realizado ainda
              </h3>
              <p className="text-xs text-[#7C675B]">
                Você ainda não fez nenhum pedido no site. Visite o catálogo e experimente nossos doces frescos!
              </p>
              <Button variant="primary" asChild>
                <Link href="/doces">Ver Cardápio</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8D5C4] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#7A263A]">{ord.orderId}</span>
                      <span className="text-[11px] bg-[#E8F5E9] text-[#2E7D32] font-semibold px-2 py-0.5 rounded-full">
                        Em Preparo
                      </span>
                    </div>
                    <p className="text-xs text-[#7C675B]">
                      {ord.items?.length || 1} {ord.items?.length === 1 ? 'item' : 'itens'} • Total:{' '}
                      <strong className="text-[#3B241B]">{formatCentsToBrl(ord.totalCents)}</strong>
                    </p>
                    <p className="text-[11px] text-[#7C675B]">
                      {ord.fulfillment?.type === 'pickup' ? 'Retirada no Ateliê' : 'Entrega Programada'} • Janela: {ord.fulfillment?.slot}
                    </p>
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/acompanhar?pedido=${ord.orderId}`}>
                      <span>Ver Linha do Tempo</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif-title font-bold text-base text-[#3B241B]">
            Endereço Principal de Entrega
          </h3>
          <p className="text-xs text-[#7C675B]">
            Rua das Camélias, 142 — Pinheiros, São Paulo - SP (Salvo nas compras recentes)
          </p>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-4 shadow-xs">
          <h3 className="font-serif-title font-bold text-base text-[#3B241B]">
            Dados do Perfil
          </h3>
          <p className="text-xs text-[#7C675B]">
            Seus dados são preservados com segurança de acordo com a nossa política de privacidade.
          </p>
        </div>
      )}
    </div>
  );
}
