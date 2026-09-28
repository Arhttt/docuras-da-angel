'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/modules/checkout/cart-context';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, subtotalCents, totalItems } = useCart();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Carrinho de Compras">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#3B241B]/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FFF8EF] border-l border-[#E8D5C4] flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E8D5C4] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F4D7DA] text-[#7A263A] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-serif-title font-bold text-[#3B241B]">
                  Seu Carrinho
                </h2>
                <span className="text-xs text-[#7C675B]">
                  {totalItems} {totalItems === 1 ? 'item selecionado' : 'itens selecionados'}
                </span>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-[#7C675B] hover:text-[#3B241B] hover:bg-[#F3E7DC] transition-colors focus-visible:ring-2 focus-visible:ring-[#7A263A]"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F4D7DA] flex items-center justify-center text-[#7A263A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <p className="font-serif-title font-bold text-lg text-[#3B241B]">Seu carrinho está vazio</p>
                  <p className="text-xs text-[#7C675B] leading-relaxed">
                    Escolha uma das delícias artesanais preparadas sob encomenda pela Angel para começar seu pedido.
                  </p>
                </div>
                <Button variant="primary" onClick={closeCart} asChild>
                  <Link href="/doces">Explorar Cardápio</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white p-3.5 rounded-2xl border border-[#E8D5C4] flex gap-3 shadow-xs hover:border-[#B77A43]/50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#FFF8EF] border border-[#E8D5C4] overflow-hidden relative shrink-0">
                    {item.imageStoragePath ? (
                      <Image
                        src={item.imageStoragePath}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍬</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-[#3B241B] line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-[#7C675B] mt-0.5">
                          {item.variantLabel}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-[#7C675B] hover:text-[#D32F2F] p-1 rounded-md transition-colors"
                        title="Remover doce do carrinho"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#E8D5C4] rounded-lg bg-[#FFF8EF]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 px-2 text-[#3B241B] hover:bg-[#F3E7DC] rounded-l-lg transition-colors cursor-pointer"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#3B241B] min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1 px-2 text-[#3B241B] hover:bg-[#F3E7DC] rounded-r-lg transition-colors cursor-pointer"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-[#7A263A]">
                        {formatCentsToBrl(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8D5C4] bg-white space-y-3.5">
              <div className="space-y-1.5 text-xs text-[#7C675B]">
                <div className="flex justify-between">
                  <span>Subtotal dos doces</span>
                  <span className="font-semibold text-[#3B241B]">{formatCentsToBrl(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Entrega ou Retirada</span>
                  <span className="text-[#3B241B]">Calculado na próxima etapa</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F3E7DC] flex justify-between items-baseline">
                <span className="font-serif-title font-bold text-sm text-[#3B241B]">Subtotal</span>
                <span className="font-serif-title font-bold text-xl text-[#7A263A]">
                  {formatCentsToBrl(subtotalCents)}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/checkout">
                    <span>Continuar para Pagamento</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <div className="flex items-center justify-between text-[11px] text-[#7C675B] px-1">
                  <span>Pagamento seguro via Pix & Cartão</span>
                  <Link
                    href="/carrinho"
                    onClick={closeCart}
                    className="text-[#7A263A] hover:underline font-semibold"
                  >
                    Ver carrinho completo
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
