'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/products-data';
import { useCart } from '@/modules/checkout/cart-context';
import { formatCentsToBrl } from '@/lib/money';

interface ProductCardProps { product: Product; }

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] ?? {
      id: 'default', sku: 'default', label: 'Padrao',
      unitLabel: 'unidade', priceCents: 0,
      available: true, minQty: 1, maxQty: 10,
    }
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantLabel: selectedVariant.label,
      unitLabel: selectedVariant.unitLabel,
      priceCents: selectedVariant.priceCents,
      imageStoragePath: product.image,
      minQty: selectedVariant.minQty,
      maxQty: selectedVariant.maxQty,
    }, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const serif = { fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)' };

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(110,38,55,0.12)] hover:-translate-y-1">

      <Link href={`/doces/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#33161E]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#6E2637]/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E65A78]">{product.category}</span>
          <span className="text-[10px] text-[#6E4D55]">{product.prepTime}</span>
        </div>

        <Link href={`/doces/${product.slug}`}>
          <h3 className="font-bold text-base leading-snug text-[#33161E] group-hover:text-[#6E2637] transition-colors" style={serif}>
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#6E4D55] leading-relaxed line-clamp-2 flex-1">{product.shortDescription}</p>

        {product.variants.length > 1 && (
          <select
            id={`variant-${product.id}`}
            value={selectedVariant.id}
            onChange={(e) => {
              const f = product.variants.find((v) => v.id === e.target.value);
              if (f) setSelectedVariant(f);
            }}
            className="w-full text-xs bg-[#FFF8F9] border border-[#EED7DC] rounded-lg px-3 py-1.5 text-[#33161E] focus:border-[#6E2637] focus:outline-none cursor-pointer"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>{v.label} — {formatCentsToBrl(v.priceCents)}</option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#EED7DC] mt-auto">
          <div>
            <span className="text-[10px] text-[#6E4D55] uppercase tracking-wider block leading-none mb-0.5">a partir de</span>
            <span className="text-lg font-bold text-[#6E2637] leading-none" style={serif}>
              {formatCentsToBrl(selectedVariant.priceCents)}
            </span>
          </div>
          <button
            onClick={handleAdd}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
              isAdded ? 'bg-[#FDECEF] text-[#6E2637]' : 'bg-[#6E2637] text-white hover:bg-[#581D2B]'
            }`}
          >
            {isAdded
              ? (<><Check className="w-3.5 h-3.5" /><span>Adicionado!</span></>)
              : (<><ShoppingBag className="w-3.5 h-3.5" /><span>Adicionar</span></>)
            }
          </button>
        </div>
      </div>
    </article>
  );
}