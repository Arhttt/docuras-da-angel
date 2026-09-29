'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Menu, X, User, LogOut, Package, MapPin, ChevronDown, Sparkles, LogIn } from 'lucide-react';
import { useCart } from '@/modules/checkout/cart-context';
import { useAuth } from '@/modules/auth/auth-context';
import { BrandLogo } from '@/components/store/brand-logo';

const NAV_LINKS = [
  { href: '/doces',      label: 'Sabores' },
  { href: '/encomendas', label: 'Encomendas' },
  { href: '/sobre',      label: 'Nossa História' },
  { href: '/contato',    label: 'Contato' },
];

export function Header() {
  const { totalItems, openCart } = useCart();
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fechar dropdowns e menus ao mudar de rota
  useEffect(() => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const close = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserDropdownOpen(false);
    router.push('/');
  };

  // Na home o hero é full-screen, então a navbar é transparente se não scrollada
  const isHome = pathname === '/';
  const solidBg = scrolled || !isHome;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Minha Conta';
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          solidBg
            ? 'bg-[#FFF8F9]/95 backdrop-blur-md border-b border-[#EED7DC] shadow-xs'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">

            {/* Hamburger – mobile */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={`md:hidden p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#6E2637] ${
                solidBg ? 'text-[#33161E] hover:bg-[#FDECEF]' : 'text-white hover:bg-white/15'
              }`}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link href="/" onClick={close} className="flex-shrink-0">
              <BrandLogo inverted={!solidBg} />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-7 text-sm font-medium"
              aria-label="Navegação principal"
            >
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all ${
                      solidBg
                        ? `text-[#33161E] hover:text-[#6E2637] after:bg-[#6E2637] ${ active ? 'text-[#6E2637] font-semibold after:w-full' : 'after:w-0 hover:after:w-full' }`
                        : `text-white/90 hover:text-white after:bg-white ${ active ? 'text-white font-semibold after:w-full' : 'after:w-0 hover:after:w-full' }`
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            {/* Ações (Conta + Carrinho) */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Botão de Conta / Usuário com Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {!loading && user ? (
                  // Usuário CONECTADO
                  <button
                    onClick={() => setUserDropdownOpen((v) => !v)}
                    aria-expanded={userDropdownOpen}
                    aria-label="Menu do usuário"
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      solidBg
                        ? 'bg-[#FDECEF] hover:bg-[#FAD9E0] text-[#6E2637] border border-[#EED7DC]'
                        : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs border border-white/25'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-[#6E2637] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {userInitial}
                    </span>
                    <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                      Olá, {firstName}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  // Usuário SEM CONTA / DESCONECTADO
                  <button
                    onClick={() => setUserDropdownOpen((v) => !v)}
                    aria-expanded={userDropdownOpen}
                    aria-label="Acessar conta ou entrar"
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      solidBg
                        ? 'text-[#6E2637] hover:bg-[#FDECEF]'
                        : 'text-white/95 hover:bg-white/15'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Entrar</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 opacity-70 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Dropdown Menu Desktop */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#EED7DC] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    {user ? (
                      // CONTEÚDO LOGADO
                      <div className="space-y-1">
                        <div className="px-3 py-2.5 border-b border-[#F5E6E9] mb-1">
                          <p className="text-xs font-semibold text-[#33161E] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#8C6D75] truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/minha-conta"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#33161E] hover:bg-[#FDECEF] hover:text-[#6E2637] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#6E2637]" />
                          <span>Minha Conta</span>
                        </Link>

                        <Link
                          href="/minha-conta?tab=orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#33161E] hover:bg-[#FDECEF] hover:text-[#6E2637] transition-colors"
                        >
                          <Package className="w-4 h-4 text-[#6E2637]" />
                          <span>Meus Pedidos</span>
                        </Link>

                        <Link
                          href="/minha-conta?tab=addresses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#33161E] hover:bg-[#FDECEF] hover:text-[#6E2637] transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-[#6E2637]" />
                          <span>Endereços Salvos</span>
                        </Link>

                        <div className="pt-1 border-t border-[#F5E6E9]">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-700 hover:bg-red-50 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair da conta</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // CONTEÚDO NÃO LOGADO
                      <div className="p-2 space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#33161E]">Acesse sua conta</p>
                          <p className="text-[11px] text-[#8C6D75] leading-snug">
                            Acompanhe seus pedidos e tenha uma experiência personalizada.
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <Link
                            href="/login"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-center gap-2 bg-[#6E2637] hover:bg-[#581D2B] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Entrar na conta</span>
                          </Link>

                          <Link
                            href="/cadastro"
                            onClick={() => setUserDropdownOpen(false)}
                            className="w-full flex items-center justify-center gap-2 border border-[#EED7DC] text-[#33161E] hover:bg-[#FDECEF] text-xs font-semibold py-2 px-4 rounded-xl transition-colors"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
                            <span>Criar cadastro</span>
                          </Link>
                        </div>

                        <div className="pt-2 border-t border-[#F5E6E9]">
                          <Link
                            href="/acompanhar"
                            onClick={() => setUserDropdownOpen(false)}
                            className="text-[11px] text-[#8C6D75] hover:text-[#6E2637] flex items-center gap-1.5 justify-center"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Consultar pedido sem login</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botão Carrinho */}
              <button
                onClick={openCart}
                id="cart-trigger-button"
                aria-label={`Abrir carrinho — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
                className={`relative p-2.5 rounded-xl transition-colors cursor-pointer ${
                  solidBg ? 'text-[#6E2637] hover:bg-[#FDECEF]' : 'text-white/90 hover:bg-white/15'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#6E2637] text-white text-[10px] font-bold h-[18px] w-[18px] rounded-full flex items-center justify-center shadow">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden bg-[#FFF8F9] border-t border-[#EED7DC] px-4 pb-6 pt-2 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1" aria-label="Menu mobile">
              {NAV_LINKS.map(({ href, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#FDECEF] text-[#6E2637] font-semibold'
                        : 'text-[#33161E] hover:bg-[#FDECEF] hover:text-[#6E2637]'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              {/* Bloco de Conta no Mobile */}
              <div className="mt-3 pt-3 border-t border-[#EED7DC] space-y-2">
                {user ? (
                  // Conectado Mobile
                  <div className="bg-white rounded-2xl p-3 border border-[#EED7DC] space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#6E2637] text-white font-bold flex items-center justify-center text-sm">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#33161E] truncate">{user.name}</p>
                        <p className="text-xs text-[#8C6D75] truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F5E6E9]">
                      <Link
                        href="/minha-conta"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FDECEF] text-[#6E2637] text-xs font-semibold"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Minha Conta</span>
                      </Link>
                      <Link
                        href="/minha-conta?tab=orders"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#FDECEF] text-[#6E2637] text-xs font-semibold"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Meus Pedidos</span>
                      </Link>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                ) : (
                  // Sem Conta Mobile
                  <div className="bg-white rounded-2xl p-4 border border-[#EED7DC] space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#33161E]">Você não está conectado</p>
                      <p className="text-[11px] text-[#8C6D75]">
                        Entre para ver seus pedidos, cupons e dados salvos.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#6E2637] text-white text-xs font-bold shadow-xs"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Entrar</span>
                      </Link>

                      <Link
                        href="/cadastro"
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#EED7DC] text-[#33161E] hover:bg-[#FDECEF] text-xs font-semibold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E65A78]" />
                        <span>Cadastre-se</span>
                      </Link>
                    </div>

                    <Link
                      href="/acompanhar"
                      onClick={close}
                      className="block text-center text-[11px] text-[#8C6D75] hover:text-[#6E2637] pt-1"
                    >
                      Rastrear pedido sem login →
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer em páginas sem hero full-screen */}
      {!isHome && <div className="h-16 sm:h-[72px]" />}
    </>
  );
}
