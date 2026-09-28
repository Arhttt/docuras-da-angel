import React from 'react';
import Link from 'next/link';
import { Heart, Phone, Clock, ShieldCheck, Package, Sparkles } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/social-icons';
import { BrandLogo } from '@/components/store/brand-logo';
import { STORE_INFO } from '@/lib/products-data';

export function Footer() {
  return (
    <footer className="bg-[#33161E] text-[#FFF8F9] border-t border-[#EED7DC]/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <BrandLogo size="md" className="brightness-125" />
            <p className="text-xs sm:text-sm text-[#FDECEF]/85 leading-relaxed pt-1">
              {STORE_INFO.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FDECEF] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Compra 100% segura • Pix com confirmação instantânea</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-base font-bold text-white tracking-wide">
              Nossos Sabores & Cardápio
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FDECEF]/80">
              <li>
                <Link href="/doces" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Ver Todas as Balas Baiana
                </Link>
              </li>
              <li>
                <Link href="/doces/bala-baiana-tradicional" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Bala Baiana Tradicional
                </Link>
              </li>
              <li>
                <Link href="/doces/bala-baiana-maracuja" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Bala Baiana de Maracujá
                </Link>
              </li>
              <li>
                <Link href="/doces/bala-baiana-morango" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Bala Baiana de Morango
                </Link>
              </li>
              <li>
                <Link href="/doces/bala-baiana-ameixa" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Bala Baiana com Fruta (Ameixa / Goiabada)
                </Link>
              </li>
              <li>
                <Link href="/doces/doce-de-leite-artesanal" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Doce de Leite Artesanal
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Orders & Tracking */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-base font-bold text-white tracking-wide">
              Festas & Acompanhamento
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FDECEF]/80">
              <li>
                <Link href="/encomendas" className="hover:text-white hover:underline underline-offset-4 transition-colors font-medium text-[#FBBF24]">
                  Encomendas para Aniversários & Eventos
                </Link>
              </li>
              <li>
                <Link href="/acompanhar" className="hover:text-white hover:underline underline-offset-4 transition-colors flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#E65A78]" />
                  <span>Acompanhar Status do Pedido</span>
                </Link>
              </li>
              <li>
                <Link href="/minha-conta" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  Minha Conta de Cliente
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white hover:underline underline-offset-4 transition-colors">
                  História da Doçuras da Angel
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#E65A78] transition-colors text-xs opacity-70">
                  Acesso Administrativo da Cozinha
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contacts from Flyer */}
          <div className="space-y-3">
            <h4 className="font-serif-title text-base font-bold text-white tracking-wide">
              Pedidos & Atendimento
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#FDECEF]/85">
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">WhatsApp para Pedidos:</strong>
                  <span className="text-[#FBBF24] font-bold text-sm">{STORE_INFO.phone}</span>
                </div>
              </a>

              <a
                href={STORE_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-[#E65A78] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Instagram Oficial:</strong>
                  <span>{STORE_INFO.instagram}</span>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Horário de Produção & Entrega:</strong>
                  <span>Segunda a Sábado: 09h às 19h</span>
                  <span className="block text-[11px] text-[#FDECEF]/70">Lotes frescos sob agendamento</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-10 mt-10 border-t border-[#FFF8F9]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FDECEF]/70">
          <p>© {new Date().getFullYear()} {STORE_INFO.brandName} — {STORE_INFO.specialty}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1.5">
            <span>Feito artesanalmente com</span>
            <Heart className="w-3.5 h-3.5 text-[#E65A78] fill-current" />
            <span>para adoçar seus momentos especiais</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
