'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product } from '@/lib/products-data';
import { ProductCard } from '@/components/store/product-card';
import { Button } from '@/components/ui/button';

export default function DocesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Category
    if (selectedCategory !== 'todas') {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.ingredients.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.variants[0].priceCents - b.variants[0].priceCents);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.variants[0].priceCents - a.variants[0].priceCents);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 sm:space-y-10">
      {/* Page Title & Context Header */}
      <header className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8D5C4] text-[11px] font-semibold text-[#7A263A]">
          <span>Cardápio Artesanal</span>
        </div>
        <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3B241B]">
          Doces do Nosso Ateliê
        </h1>
        <p className="text-sm sm:text-base text-[#6E584D] leading-relaxed">
          Todos os nossos doces são preparados com ingredientes naturais e frescos, sem conservantes. Selecione suas porções favoritas para entrega ou retirada no ateliê.
        </p>
      </header>

      {/* Filters & Search Control Bar */}
      <section className="bg-white rounded-2xl border border-[#E8D5C4] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search input + Sort selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7C675B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por doce, ingrediente ou sabor..."
              aria-label="Buscar doce no catálogo"
              className="w-full bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#3B241B] placeholder-[#7C675B]/60 focus:border-[#7A263A] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C675B] hover:text-[#3B241B] p-1"
                aria-label="Limpar busca"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-semibold text-[#7C675B] whitespace-nowrap hidden md:inline">
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto bg-[#FFF8EF] border border-[#E8D5C4] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#3B241B] focus:border-[#7A263A] focus:outline-none cursor-pointer"
            >
              <option value="featured">Destaques do Ateliê</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="name-asc">Nome (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Categories Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar" role="tablist" aria-label="Filtrar por categoria">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#7A263A] text-white shadow-xs'
                    : 'bg-[#FFF8EF] text-[#6E584D] hover:bg-[#F3E7DC] hover:text-[#3B241B] border border-[#E8D5C4]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Results Counter & Active Filters Notice */}
      <div className="flex items-center justify-between text-xs text-[#7C675B] px-1">
        <span>
          Mostrando <strong className="text-[#3B241B]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'doce disponível' : 'doces disponíveis'}
        </span>
        {(selectedCategory !== 'todas' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('todas');
              setSearchQuery('');
            }}
            className="text-[#7A263A] hover:underline font-semibold cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E8D5C4] p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFF8EF] border border-[#E8D5C4] flex items-center justify-center text-2xl mx-auto">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-title font-bold text-xl text-[#3B241B]">
              Nenhum doce encontrado
            </h3>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              Não encontramos doces que correspondam aos filtros selecionados. Tente buscar por outro termo ou limpe os filtros.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory('todas');
              setSearchQuery('');
            }}
          >
            Ver todos os doces
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
