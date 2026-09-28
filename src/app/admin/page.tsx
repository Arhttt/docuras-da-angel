'use client';

import React, { useState, useEffect } from 'react';
import { Package, ChefHat, CheckCircle2, Clock, AlertCircle, RefreshCw, Filter, DollarSign, Store, Eye } from 'lucide-react';
import { formatCentsToBrl } from '@/lib/money';
import { PRODUCTS, Product } from '@/lib/products-data';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  const [productAvailability, setProductAvailability] = useState<Record<string, boolean>>({
    'prod-balas-banhadas': true,
    'prod-doce-de-leite': true,
    'prod-cocada-cremosa': true,
    'prod-bolo-de-pote': true,
    'prod-pe-de-moleque': true,
    'prod-pe-de-moca': true,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const historyRaw = localStorage.getItem('doces_angel_orders_history');
      if (historyRaw) {
        setOrders(JSON.parse(historyRaw));
      } else {
        // Seed default initial orders for the kitchen view
        const initialSeed = [
          {
            orderId: 'ANGEL-2026-849201',
            createdAt: new Date().toISOString(),
            status: 'em_preparo',
            customer: { fullName: 'Juliana Mendes', phone: '(11) 99882-1100' },
            fulfillment: { type: 'pickup', slot: 'Manhã (10h às 13h)' },
            items: [
              { name: 'Balas Banhadas Caramelizadas', variantLabel: 'Porção 300g (~24 un)', quantity: 2, priceCents: 5200 },
              { name: 'Cocada Cremosa de Colher', variantLabel: 'Pote Cremoso 220g', quantity: 1, priceCents: 2200 },
            ],
            totalCents: 12600,
          },
          {
            orderId: 'ANGEL-2026-739104',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            status: 'pronto_retirada',
            customer: { fullName: 'Ricardo Vasconcelos', phone: '(11) 98112-4433' },
            fulfillment: { type: 'delivery', slot: 'Tarde (14h às 18h)', address: { street: 'Rua Oscar Freire', number: '850' } },
            items: [
              { name: 'Bolo de Pote Gourmet', variantLabel: 'Cenoura com Brigadeiro', quantity: 4, priceCents: 1800 },
              { name: 'Pé de Moça Aveludado', variantLabel: 'Caixa 12 tabletes', quantity: 1, priceCents: 4000 },
            ],
            totalCents: 12400,
          },
          {
            orderId: 'ANGEL-2026-618492',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'concluido',
            customer: { fullName: 'Mariana Duarte', phone: '(11) 97654-9922' },
            fulfillment: { type: 'pickup', slot: 'Tarde (14h às 18h)' },
            items: [
              { name: 'Doce de Leite Artesanal da Angel', variantLabel: 'Pote de Vidro 450g', quantity: 2, priceCents: 3900 },
            ],
            totalCents: 7800,
          },
        ];
        setOrders(initialSeed);
        localStorage.setItem('doces_angel_orders_history', JSON.stringify(initialSeed));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      localStorage.setItem('doces_angel_orders_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleProduct = (prodId: string) => {
    setProductAvailability((prev) => ({
      ...prev,
      [prodId]: !prev[prodId],
    }));
  };

  // Metrics
  const totalRevenueCents = orders.reduce((acc, o) => acc + (o.totalCents || 0), 0);
  const activePreparingCount = orders.filter((o) => o.status === 'em_preparo' || !o.status).length;
  const readyCount = orders.filter((o) => o.status === 'pronto_retirada').length;

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'todos') return true;
    if (selectedStatusFilter === 'em_preparo') return o.status === 'em_preparo' || !o.status;
    return o.status === selectedStatusFilter;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3B241B]">
            Gestão Operacional da Cozinha
          </h1>
          <p className="text-xs sm:text-sm text-[#6E584D]">
            Acompanhe pedidos em tempo real, altere etapas de preparo e controle a disponibilidade das receitas.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadOrders} className="cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Atualizar Fila</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C675B]">
            Em Preparo no Ateliê
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-title font-bold text-3xl text-[#7A263A]">
              {activePreparingCount}
            </span>
            <span className="text-xs text-[#B77A43] font-medium">Lotes frescos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C675B]">
            Prontos para Retirada / Envio
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-title font-bold text-3xl text-[#2E7D32]">
              {readyCount}
            </span>
            <span className="text-xs text-[#2E7D32] font-medium">Aguardando cliente</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C675B]">
            Faturamento Total Acumulado
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-title font-bold text-2xl sm:text-3xl text-[#3B241B]">
              {formatCentsToBrl(totalRevenueCents)}
            </span>
            <span className="text-xs text-[#7C675B]">{orders.length} pedidos</span>
          </div>
        </div>
      </div>

      {/* Section 1: Orders Queue */}
      <div className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F3E7DC] pb-4">
          <div className="space-y-1">
            <h2 className="font-serif-title font-bold text-xl text-[#3B241B] flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#7A263A]" />
              <span>Fila de Pedidos & Expedição</span>
            </h2>
            <p className="text-xs text-[#7C675B]">
              Mude o status conforme os doces forem finalizados e embalados no ateliê.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['todos', 'em_preparo', 'pronto_retirada', 'concluido'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-colors cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'bg-[#7A263A] text-white'
                    : 'bg-[#FFF8EF] text-[#6E584D] hover:bg-[#F3E7DC] border border-[#E8D5C4]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="divide-y divide-[#F3E7DC]">
          {filteredOrders.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#7C675B]">
              Nenhum pedido com o filtro selecionado.
            </p>
          ) : (
            filteredOrders.map((ord) => (
              <div key={ord.orderId} className="py-5 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#7A263A]">
                      {ord.orderId}
                    </span>
                    <span className="text-xs font-semibold text-[#3B241B]">
                      {ord.customer?.fullName}
                    </span>
                    <span className="text-xs text-[#7C675B]">
                      {ord.customer?.phone}
                    </span>
                  </div>

                  <div className="text-xs text-[#6E584D] space-y-0.5">
                    <p>
                      <strong>Tipo:</strong> {ord.fulfillment?.type === 'pickup' ? 'Retirada no Ateliê' : 'Entrega em Domicílio'} •{' '}
                      <strong>Janela:</strong> {ord.fulfillment?.slot}
                    </p>
                    <p className="text-[#7C675B]">
                      <strong>Doces:</strong>{' '}
                      {ord.items?.map((it: any) => `${it.quantity}x ${it.name} (${it.variantLabel})`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end lg:self-center">
                  <span className="font-serif-title font-bold text-base text-[#3B241B] mr-2">
                    {formatCentsToBrl(ord.totalCents)}
                  </span>

                  {/* Status Actions */}
                  <select
                    value={ord.status || 'em_preparo'}
                    onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                    className="bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl px-3 py-2 text-xs font-semibold text-[#3B241B] focus:border-[#7A263A] focus:outline-none cursor-pointer"
                  >
                    <option value="em_preparo">Em Preparo no Ateliê</option>
                    <option value="pronto_retirada">Pronto p/ Retirada / Envio</option>
                    <option value="concluido">Entregue / Concluído</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2: Product & Stock Control */}
      <div className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1 border-b border-[#F3E7DC] pb-4">
          <h2 className="font-serif-title font-bold text-xl text-[#3B241B]">
            Disponibilidade do Cardápio
          </h2>
          <p className="text-xs text-[#7C675B]">
            Pause temporariamente receitas cujo lote diário de ingredientes foi esgotado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((prod) => {
            const isAvail = productAvailability[prod.id] !== false;
            return (
              <div
                key={prod.id}
                className="p-4 rounded-2xl border border-[#E8D5C4] bg-[#FFF8EF] flex items-center justify-between"
              >
                <div>
                  <h3 className="font-serif-title font-bold text-sm text-[#3B241B]">{prod.name}</h3>
                  <span className="text-[11px] text-[#7C675B]">{prod.category}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleProduct(prod.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    isAvail
                      ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                      : 'bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2]'
                  }`}
                >
                  {isAvail ? 'Em Estoque' : 'Esgotado'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
