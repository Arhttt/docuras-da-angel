'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Check, ShoppingBag, Clock, ShieldCheck, MapPin, AlertCircle, Heart, Plus, Minus, ArrowRight } from 'lucide-react';
import { getProductBySlug, PRODUCTS, ProductVariant } from '@/lib/products-data';
import { useCart } from '@/modules/checkout/cart-context';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-title text-3xl font-bold text-[#3B241B]">Doce não encontrado</h1>
        <p className="text-sm text-[#7C675B]">O doce que você procura não está disponível ou o link está incorreto.</p>
        <Button variant="primary" asChild>
          <Link href="/doces">Voltar ao Cardápio</Link>
        </Button>
      </div>
    );
  }

  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [cepInput, setCepInput] = useState<string>('');
  const [cepResult, setCepResult] = useState<{ message: string; fee: string } | null>(null);

  const handleAddToCart = () => {
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        variantLabel: selectedVariant.label,
        unitLabel: selectedVariant.unitLabel,
        priceCents: selectedVariant.priceCents,
        imageStoragePath: product.image,
        minQty: selectedVariant.minQty,
        maxQty: selectedVariant.maxQty,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCalculateCep = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepResult({
        message: 'Por favor, digite um CEP válido com 8 dígitos.',
        fee: '',
      });
      return;
    }

    if (cleanCep.startsWith('01') || cleanCep.startsWith('02') || cleanCep.startsWith('03') || cleanCep.startsWith('04') || cleanCep.startsWith('05')) {
      setCepResult({
        message: 'Região atendida! Entrega local agendada em até 24h após o preparo.',
        fee: 'R$ 12,00 (ou grátis para retirada no ateliê em Ivaiporã)',
      });
    } else {
      setCepResult({
        message: 'Entrega metropolitana disponível via portador parceiro.',
        fee: 'R$ 18,00 (ou retirada gratuita no ateliê)',
      });
    }
  };

  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Navigation Breadcrumb */}
      <nav aria-label="Navegação estrutural" className="flex items-center gap-2 text-xs text-[#7C675B]">
        <Link href="/" className="hover:text-[#7A263A] transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link href="/doces" className="hover:text-[#7A263A] transition-colors">
          Cardápio de Doces
        </Link>
        <span>/</span>
        <span className="text-[#3B241B] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-[#E8D5C4] bg-[#FFF8EF] shadow-sm">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#7A263A] text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-[#7C675B] px-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B77A43]" />
              <span>{product.prepTime}</span>
            </span>
            <span className="font-medium text-[#3B241B]">Fotografia autêntica do ateliê</span>
          </div>
        </div>

        {/* Right Column: Details, Variants, Purchase */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#B77A43]">
                {product.category}
              </span>
              <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#3B241B] leading-tight">
                {product.name}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#6E584D] leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price Highlight */}
            <div className="pt-2 pb-1">
              <span className="text-xs uppercase tracking-wider text-[#7C675B] font-semibold block">
                Valor da porção selecionada
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif-title font-bold text-3xl sm:text-4xl text-[#7A263A]">
                  {formatCentsToBrl(selectedVariant.priceCents * quantity)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-[#7C675B]">
                    ({formatCentsToBrl(selectedVariant.priceCents)} cada)
                  </span>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            <div className="space-y-2 pt-2 border-t border-[#E8D5C4]/70">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3B241B] block">
                Escolha a Porção / Tamanho:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#7A263A] bg-[#FFF8EF] ring-1 ring-[#7A263A]'
                          : 'border-[#E8D5C4] bg-white hover:border-[#B77A43]'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-[#3B241B]">
                        {v.label}
                      </span>
                      <span className="block text-xs font-bold text-[#7A263A] mt-1">
                        {formatCentsToBrl(v.priceCents)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector + Add to Cart CTA */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-[#E8D5C4] rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-[#3B241B] hover:bg-[#F3E7DC] disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#3B241B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(selectedVariant.maxQty, quantity + 1))}
                    disabled={quantity >= selectedVariant.maxQty}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-[#3B241B] hover:bg-[#F3E7DC] disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add Button */}
                <Button
                  variant={isAdded ? 'secondary' : 'primary'}
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-[#5A1E29]" />
                      <span>Adicionado ao Carrinho!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#7C675B] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B77A43]" />
                  <span>Ingredientes de alta qualidade</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B77A43]" />
                  <span>Feito fresco sob medida</span>
                </span>
              </div>
            </div>

            {/* Simulação de Frete e Retirada */}
            <div className="pt-4 border-t border-[#E8D5C4]/70">
              <span className="text-xs font-semibold text-[#3B241B] uppercase tracking-wider block mb-2">
                Calcular Entrega ou Retirada:
              </span>
              <form onSubmit={handleCalculateCep} className="flex gap-2">
                <input
                  type="text"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  placeholder="Digite seu CEP (ex: 01310-100)"
                  maxLength={9}
                  className="w-full max-w-xs bg-white border border-[#E8D5C4] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#3B241B] placeholder-[#7C675B]/60 focus:border-[#7A263A] focus:outline-none"
                />
                <Button type="submit" variant="outline" size="sm" className="whitespace-nowrap cursor-pointer">
                  Calcular
                </Button>
              </form>

              {cepResult && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-[#E8D5C4] text-xs space-y-1">
                  <p className="text-[#3B241B] font-medium">{cepResult.message}</p>
                  {cepResult.fee && <p className="text-[#7A263A] font-bold">{cepResult.fee}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Transparency Sections: Description, Ingredients, Allergens */}
      <div className="bg-white rounded-3xl border border-[#E8D5C4] p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="space-y-3 max-w-3xl">
          <h2 className="font-serif-title text-2xl font-bold text-[#3B241B]">
            A História Desta Receita
          </h2>
          <p className="text-sm sm:text-base text-[#6E584D] leading-relaxed">
            {product.fullDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#F3E7DC]">
          <div className="space-y-1.5">
            <h3 className="font-serif-title font-bold text-sm text-[#3B241B]">
              Ingredientes
            </h3>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              {product.ingredients}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif-title font-bold text-sm text-[#3B241B]">
              Alergênicos & Cuidados
            </h3>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              {product.allergens}
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif-title font-bold text-sm text-[#3B241B]">
              Armazenamento & Validade
            </h3>
            <p className="text-xs text-[#7C675B] leading-relaxed">
              {product.storageInfo}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-2xl font-bold text-[#3B241B]">
            Você Também Pode Gostar
          </h2>
          <Link href="/doces" className="text-xs font-bold text-[#7A263A] hover:underline flex items-center gap-1">
            <span>Ver todo o cardápio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {otherProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
