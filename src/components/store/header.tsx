'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User, Search, Package, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/social-icons';
import { useCart } from '@/modules/checkout/cart-context';
import { BrandLogo } from '@/components/store/brand-logo';
import { STORE_INFO } from '@/lib/products-data';

export function Header() {
  const { totalItems, openCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/doces', label: 'Sabores & Cardápio' },
    { href: '/encomendas', label: 'Encomendas de Festas' },
    { href: '/sobre', label: 'Nossa História' },
    { href: '/contato', label: 'Contato & Pedidos' },
  ];

  return (
    <>
      {/* Top Banner Notice with real contacts from flyer */}
      <div className="bg-[#6E2637] text-white text-xs py-2 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-4">
            <a
              href={STORE_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/95 hover:text-white hover:underline transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E65A78]" />
              <span>WhatsApp: <strong>{STORE_INFO.phone}</strong></span>
            </a>
            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-white/90 hover:text-white hover:underline transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{STORE_INFO.instagram}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[#FDECEF]">
              Aceitamos encomendas para aniversários, festas e eventos
            </span>
            <Link
              href="/acompanhar"
              className="flex items-center gap-1.5 text-white/95 hover:text-white underline underline-offset-2 transition-colors font-semibold"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Consultar Pedido</span>
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-[#FFF8F9]/95 backdrop-blur-md border-b border-[#EED7DC] transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button + Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 rounded-lg text-[#33161E] hover:bg-[#FDECEF] md:hidden focus-visible:ring-2 focus-visible:ring-[#6E2637]"
                aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <BrandLogo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#33161E]" aria-label="Navegação Principal">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-1 transition-colors border-b-2 ${
                      isActive
                        ? 'text-[#6E2637] border-[#6E2637]'
                        : 'border-transparent hover:text-[#6E2637] hover:border-[#6E2637]/40'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* User & Cart Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/minha-conta"
                className="p-2.5 rounded-xl text-[#33161E] hover:bg-[#FDECEF] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Minha Conta"
              >
                <User className="w-5 h-5 text-[#6E2637]" />
                <span className="hidden lg:inline">Minha Conta</span>
              </Link>

              <button
                onClick={openCart}
                id="cart-trigger-button"
                className="relative p-2.5 px-3 rounded-xl bg-[#6E2637] text-white hover:bg-[#581D2B] transition-all shadow-xs flex items-center gap-2 active:scale-95 cursor-pointer"
                aria-label={`Abrir carrinho com ${totalItems} itens`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">Carrinho</span>
                {totalItems > 0 && (
                  <span className="bg-[#E65A78] text-white text-[11px] font-bold h-5 min-w-5 rounded-full flex items-center justify-center px-1 shadow-xs ml-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#EED7DC] bg-[#FFF8F9] px-4 pt-3 pb-6 space-y-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === link.href
                      ? 'bg-[#FDECEF] text-[#6E2637]'
                      : 'text-[#33161E] hover:bg-[#FDECEF]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#EED7DC] space-y-1">
                <Link
                  href="/acompanhar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#6E2637] hover:bg-[#FDECEF] flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Acompanhar Pedido (Visitante)</span>
                </Link>
                <Link
                  href="/minha-conta"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#33161E] hover:bg-[#FDECEF] flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Minha Conta / Entrar</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
