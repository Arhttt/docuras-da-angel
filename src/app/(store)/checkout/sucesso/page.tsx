'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, QrCode, Copy, Check, Clock, Package, MapPin, ArrowRight } from 'lucide-react';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('pedido') || 'ANGEL-2026-000000';

  const [order, setOrder] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('doces_angel_last_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.orderId === orderId || !orderId.includes('000000')) {
          setOrder(parsed);
        }
      }
    } catch (e) {
      console.error('Erro ao recuperar dados do pedido:', e);
    }
  }, [orderId]);

  const pixKey = '00020126580014br.gov.bcb.pix0136docesdaangel@confeitaria.com.br520400005303986540540.005802BR5915Doces da Angel6009Sao Paulo62070503***6304';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B]">
          Pedido Recebido com Sucesso!
        </h1>
        <p className="text-sm text-[#6E584D] max-w-md mx-auto">
          Obrigado por escolher a Doces da Angel. Seu pedido foi registrado no ateliê e os preparativos já foram iniciados.
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF8EF] border border-[#E8D5C4] text-xs font-bold text-[#7A263A]">
          <span>Código do Pedido:</span>
          <span className="font-mono">{order?.orderId || orderId}</span>
        </div>
      </div>

      {/* Pix Payment Box (if Pix was chosen) */}
      {(!order || order.payment?.method === 'pix') && (
        <section className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-8 space-y-5 shadow-xs text-center">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B77A43]">
              Pagamento via Pix
            </span>
            <h2 className="font-serif-title font-bold text-xl text-[#3B241B]">
              Escaneie o QR Code ou copie o código Pix
            </h2>
            <p className="text-xs text-[#7C675B]">
              Abra o aplicativo do seu banco e conclua o pagamento para liberação imediata.
            </p>
          </div>

          {/* Simulated QR Code Box */}
          <div className="w-48 h-48 mx-auto bg-[#FFF8EF] p-4 rounded-2xl border border-[#E8D5C4] flex flex-col items-center justify-center relative">
            <div className="w-36 h-36 bg-[#3B241B] rounded-lg p-2 flex items-center justify-center">
              <QrCode className="w-full h-full text-white" />
            </div>
            <span className="text-[10px] text-[#7C675B] mt-2 font-mono">
              Total: {order ? formatCentsToBrl(order.totalCents) : 'R$ 40,00'}
            </span>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={pixKey}
                className="w-full bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl px-3 py-2 text-xs font-mono text-[#7C675B] truncate"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyPix}
                className="whitespace-nowrap cursor-pointer"
              >
                {copiedPix ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-[#2E7D32]" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    <span>Copiar Pix</span>
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-[#7C675B]">
              A compensação do Pix é automática. Você receberá um e-mail logo em seguida.
            </p>
          </div>
        </section>
      )}

      {/* Order Summary & Fulfillment Details */}
      {order && (
        <section className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-8 space-y-5 shadow-xs">
          <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
            Detalhes do Seu Pedido
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6E584D] border-b border-[#F3E7DC] pb-4">
            <div>
              <span className="font-semibold text-[#3B241B] block mb-1">Dados de Contato:</span>
              <p>{order.customer.fullName}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>

            <div>
              <span className="font-semibold text-[#3B241B] block mb-1">
                {order.fulfillment.type === 'pickup' ? 'Retirada no Ateliê:' : 'Endereço de Entrega:'}
              </span>
              {order.fulfillment.type === 'pickup' ? (
                <>
                  <p>Rua das Camélias, 142 — Ivaiporã, PR</p>
                  <p className="text-[#7A263A] font-semibold mt-1">Janela: {order.fulfillment.slot}</p>
                </>
              ) : (
                <>
                  <p>
                    {order.fulfillment.address.street}, {order.fulfillment.address.number}{' '}
                    {order.fulfillment.address.complement && `(${order.fulfillment.address.complement})`}
                  </p>
                  <p>
                    {order.fulfillment.address.neighborhood} — CEP {order.fulfillment.address.postalCode}
                  </p>
                  <p className="text-[#7A263A] font-semibold mt-1">Janela: {order.fulfillment.slot}</p>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[#3B241B] uppercase tracking-wider block">
              Doces Encomendados:
            </span>
            <div className="divide-y divide-[#F3E7DC]">
              {order.items.map((i: any, idx: number) => (
                <div key={idx} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#3B241B]">{i.name}</span>
                    <span className="text-[#7C675B] block">{i.quantity}x {i.variantLabel}</span>
                  </div>
                  <span className="font-bold text-[#7A263A]">
                    {formatCentsToBrl(i.priceCents * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F3E7DC] flex justify-between items-baseline">
            <span className="font-serif-title font-bold text-base text-[#3B241B]">Total Geral</span>
            <span className="font-serif-title font-bold text-2xl text-[#7A263A]">
              {formatCentsToBrl(order.totalCents)}
            </span>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button variant="primary" size="lg" className="w-full sm:w-auto cursor-pointer" asChild>
          <Link href={`/acompanhar?pedido=${order?.orderId || orderId}`}>
            <Package className="w-4 h-4 mr-2" />
            <span>Acompanhar Status do Pedido</span>
          </Link>
        </Button>

        <Button variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer" asChild>
          <Link href="/">
            <span>Voltar à Página Inicial</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-sm text-[#7C675B]">Carregando confirmação...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
