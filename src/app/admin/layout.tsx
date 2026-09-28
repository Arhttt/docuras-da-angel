import React from 'react';
import Link from 'next/link';
import { ChefHat, ShoppingBag, Package, Store, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#3B241B] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-[#E8D5C4] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7A263A] text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title font-bold text-base text-[#3B241B] leading-none">
                  Doces da Angel • Painel do Ateliê
                </span>
                <span className="text-[10px] text-[#B77A43] font-semibold uppercase tracking-wider mt-0.5">
                  Gestão Operacional & Cozinha
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-xs font-semibold text-[#7A263A] hover:underline flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Ir para a Loja Virtual</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
