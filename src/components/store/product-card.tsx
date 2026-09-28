'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/products-data';
import { useCart } from '@/modules/checkout/cart-context';
import { formatCentsToBrl } from '@/lib/money';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      sku: 'default',
      label: 'Padrão',
      unitLabel: 'unidade',
      priceCents: 0,
      available: true,
      minQty: 1,
      maxQty: 10,
    }
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
      1
    );

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden flex flex-col justify-between hover:border-[#B77A43] hover:shadow-sm transition-all duration-200">
      {/* Image Container */}
      <Link href={`/doces/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-[#FFF8EF]">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover group-hover:scale-103 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#7A263A] text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7C675B]">
            <span className="uppercase tracking-wider font-semibold text-[#B77A43] text-[11px]">
              {product.category}
            </span>
            <span className="text-[11px] text-[#7C675B]">{product.prepTime}</span>
          </div>

          <Link href={`/doces/${product.slug}`} className="block group-hover:text-[#7A263A] transition-colors">
            <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#3B241B] leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[#7C675B] leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        </div>

        {/* Variant Selector (if more than 1 option) */}
        {product.variants.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <label htmlFor={`variant-select-${product.id}`} className="text-[11px] font-semibold text-[#7C675B] block">
              Tamanho / Opção:
            </label>
            <select
              id={`variant-select-${product.id}`}
              value={selectedVariant.id}
              onChange={(e) => {
                const found = product.variants.find((v) => v.id === e.target.value);
                if (found) setSelectedVariant(found);
              }}
              className="w-full text-xs bg-[#FFF8EF] border border-[#E8D5C4] rounded-lg px-2.5 py-1.5 text-[#3B241B] focus:border-[#7A263A] focus:outline-none cursor-pointer"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — {formatCentsToBrl(v.priceCents)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price & CTA Row */}
        <div className="pt-3 border-t border-[#F3E7DC] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-[#7C675B] block uppercase tracking-wider font-medium">
              Valor
            </span>
            <span className="font-serif-title font-bold text-lg text-[#7A263A]">
              {formatCentsToBrl(selectedVariant.priceCents)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/doces/${product.slug}`}
              className="text-xs font-semibold text-[#7C675B] hover:text-[#7A263A] px-2 py-1.5 transition-colors hidden sm:inline-block"
              title="Ver detalhes e ingredientes"
            >
              Detalhes
            </Link>

            <Button
              variant={isAdded ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleAddToCart}
              className="cursor-pointer"
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-[#5A1E29]" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                  <span>Adicionar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
