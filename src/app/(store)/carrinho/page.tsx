'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, Plus, Minus, Tag, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/modules/checkout/cart-context';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotalCents, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'ANGEL10' || clean === 'BEMVINDO10') {
      setAppliedCoupon({ code: clean, percent: 10 });
    } else if (clean === 'FESTA15') {
      setAppliedCoupon({ code: clean, percent: 15 });
    } else if (clean) {
      setCouponError('Cupom inválido ou expirado. Tente ANGEL10 para 10% OFF.');
    }
  };

  const discountCents = appliedCoupon
    ? Math.round((subtotalCents * appliedCoupon.percent) / 100)
    : 0;

  const finalTotalCents = Math.max(0, subtotalCents - discountCents);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="bg-white rounded-3xl border border-[#E8D5C4] p-10 sm:p-16 max-w-lg mx-auto space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#3B241B]">
              Seu carrinho está vazio
            </h1>
            <p className="text-sm text-[#7C675B] leading-relaxed">
              Você ainda não adicionou nenhum dos nossos doces artesanais ao carrinho. Que tal dar uma olhada nas delícias preparadas no nosso ateliê?
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" size="lg" asChild>
              <Link href="/doces">
                <span>Ver Cardápio de Doces</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B]">
          Carrinho de Compras
        </h1>
        <p className="text-sm text-[#6E584D]">
          Revise as porções selecionadas antes de prosseguir para a entrega e pagamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] divide-y divide-[#E8D5C4] overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.variantId} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#FFF8EF] border border-[#E8D5C4] shrink-0">
                    {item.imageStoragePath ? (
                      <Image
                        src={item.imageStoragePath}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍬</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif-title font-bold text-base sm:text-lg text-[#3B241B]">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#7C675B]">
                      {item.variantLabel} ({item.unitLabel})
                    </p>
                    <p className="text-xs font-semibold text-[#7A263A] sm:hidden">
                      {formatCentsToBrl(item.priceCents)} unitário
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3E7DC]">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#E8D5C4] rounded-xl bg-[#FFF8EF]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-1.5 px-2.5 text-[#3B241B] hover:bg-[#F3E7DC] rounded-l-xl transition-colors cursor-pointer"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#3B241B] min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-1.5 px-2.5 text-[#3B241B] hover:bg-[#F3E7DC] rounded-r-xl transition-colors cursor-pointer"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-24">
                    <span className="font-serif-title font-bold text-base sm:text-lg text-[#7A263A] block">
                      {formatCentsToBrl(item.priceCents * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-[#7C675B] hidden sm:block">
                        {formatCentsToBrl(item.priceCents)} cada
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-[#7C675B] hover:text-[#D32F2F] p-2 rounded-lg transition-colors cursor-pointer"
                    title="Remover item"
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/doces"
              className="text-xs font-bold text-[#7A263A] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Adicionar mais doces</span>
            </Link>

            <button
              onClick={clearCart}
              className="text-xs text-[#7C675B] hover:text-[#D32F2F] transition-colors cursor-pointer"
            >
              Esvaziar carrinho
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-6 space-y-5 shadow-xs">
            <h2 className="font-serif-title font-bold text-lg text-[#3B241B]">
              Resumo do Pedido
            </h2>

            {/* Subtotals breakdown */}
            <div className="space-y-2.5 text-xs text-[#6E584D] border-b border-[#F3E7DC] pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} itens)</span>
                <span className="font-semibold text-[#3B241B]">{formatCentsToBrl(subtotalCents)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-[#2E7D32] font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Desconto ({appliedCoupon.code})</span>
                  </span>
                  <span>- {formatCentsToBrl(discountCents)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7C675B]">
                <span>Entrega ou Retirada</span>
                <span>Calculada no checkout</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-serif-title font-bold text-base text-[#3B241B]">Subtotal Geral</span>
              <span className="font-serif-title font-bold text-2xl text-[#7A263A]">
                {formatCentsToBrl(finalTotalCents)}
              </span>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-[#F3E7DC]">
              <label htmlFor="coupon-input" className="text-[11px] font-semibold uppercase tracking-wider text-[#7C675B] block mb-1.5">
                Cupom de Desconto:
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ex: ANGEL10"
                  className="w-full bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl px-3 py-2 text-xs uppercase font-medium focus:border-[#7A263A] focus:outline-none"
                />
                <Button type="submit" variant="outline" size="sm" className="cursor-pointer">
                  Aplicar
                </Button>
              </form>
              {appliedCoupon && (
                <p className="text-xs text-[#2E7D32] font-semibold mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Cupom {appliedCoupon.code} aplicado ({appliedCoupon.percent}% OFF)!</span>
                </p>
              )}
              {couponError && (
                <p className="text-xs text-[#D32F2F] mt-1.5">{couponError}</p>
              )}
            </div>

            {/* Checkout Action Button */}
            <div className="pt-3 space-y-2">
              <Button variant="primary" size="lg" className="w-full cursor-pointer" asChild>
                <Link href="/checkout">
                  <span>Continuar para Pagamento</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <p className="text-center text-[11px] text-[#7C675B] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B77A43]" />
                <span>Compra protegida • Confirmação instantânea</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
