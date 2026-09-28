import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingBag, Clock, ShieldCheck, Heart, ChefHat, CheckCircle2, HelpCircle, Phone } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/social-icons';
import { Button } from '@/components/ui/button';
import { PRODUCTS, STORE_INFO } from '@/lib/products-data';
import { ProductCard } from '@/components/store/product-card';

const FAQS = [
  {
    q: 'O que torna a Bala Baiana da Doçuras da Angel tão especial?',
    a: 'O segredo está no equilíbrio: preparamos o recheio de coco ralado com leite condensado lentamente para manter uma textura úmida e aveludada, e finalizamos cada bala com um banho cuidadoso de calda de açúcar em ponto de vidro cristalino. Ao morder, você sente o estalo crocante do caramelo seguido da cremosidade do recheio.',
  },
  {
    q: 'Como conservar a casquinha crocante do caramelo?',
    a: 'Para preservar a crocância da casquinha de vidro, mantenha as balas em local fresco, arejado e seco, longe de luz solar direta e de calor ou umidade. Não recomendamos colocar em geladeira antes do consumo para não amolecer o caramelo.',
  },
  {
    q: 'Vocês fazem encomendas para festas de aniversário e casamentos?',
    a: 'Sim! Aceitamos encomendas sob medida de caixas para presentes, cento de balas para mesas de doces e porções individuais personalizadas para aniversários, batizados, casamentos e eventos corporativos.',
  },
  {
    q: 'Como funciona o envio e o pagamento?',
    a: 'Recebemos pedidos pelo site com pagamento seguro via Pix instantâneo ou Cartão de Crédito. Você pode retirar no ateliê sob agendamento ou receber via entrega programada.',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-[#FFF8F9] border-b border-[#EED7DC] pt-8 pb-16 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EED7DC] text-xs font-semibold text-[#6E2637] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E65A78]"></span>
                <span>{STORE_INFO.specialty}</span>
              </div>

              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold text-[#33161E] tracking-tight leading-[1.12]">
                A verdadeira Bala Baiana artesanal e crocante.
              </h1>

              <p className="text-base sm:text-lg text-[#6E4D55] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {STORE_INFO.tagline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button variant="primary" size="lg" className="w-full sm:w-auto cursor-pointer" asChild>
                  <Link href="/doces">
                    <span>Escolher Meus Sabores</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto cursor-pointer" asChild>
                  <Link href="/encomendas">
                    <span>Encomendas para Festas</span>
                  </Link>
                </Button>
              </div>

              {/* Informações Práticas de Confiança */}
              <div className="pt-6 border-t border-[#EED7DC] grid grid-cols-3 gap-3 text-left">
                <div className="space-y-0.5">
                  <span className="block font-serif-title font-bold text-sm text-[#33161E]">100% Artesanal</span>
                  <span className="block text-[11px] text-[#6E4D55] leading-tight">Casquinha fina e recheio cremoso</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-serif-title font-bold text-sm text-[#33161E]">Lotes Diários</span>
                  <span className="block text-[11px] text-[#6E4D55] leading-tight">Frescor absoluto para cada entrega</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-serif-title font-bold text-sm text-[#33161E]">WhatsApp Direto</span>
                  <span className="block text-[11px] text-[#6E4D55] leading-tight">{STORE_INFO.phone}</span>
                </div>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden border-2 border-[#EED7DC] shadow-sm bg-white">
                  <Image
                    src="/images/products/bala-tradicional.jpg"
                    alt="Bala Baiana Tradicional da Doçuras da Angel com casquinha de caramelo dourado de vidro e recheio cremoso"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-3 left-3 bg-[#33161E]/85 backdrop-blur-xs text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E65A78]"></span>
                    <span>Bala Baiana Tradicional</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#6E4D55] px-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E65A78]" />
                    <span>Caramelo em ponto de vidro preparado diariamente</span>
                  </span>
                  <a
                    href={STORE_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6E2637] font-semibold hover:underline flex items-center gap-1"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>{STORE_INFO.instagram}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vitrine dos 6 Sabores Oficiais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EED7DC]">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78] block">
              Cardápio de Sabores
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#33161E]">
              Nossas Balas Baiana & Doces
            </h2>
            <p className="text-sm text-[#6E4D55] max-w-xl">
              Descubra os seis sabores do ateliê: o tradicional de coco, opções frutadas e combinações com frutas naturais selecionadas.
            </p>
          </div>

          <Link
            href="/doces"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6E2637] hover:text-[#581D2B] transition-colors"
          >
            <span>Ver todo o cardápio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid dos 6 produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Banner Destaque: Encomendas para Festas e Eventos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#6E2637] text-[#FFF8F9] rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#FBBF24] block">
                Comemorações Inesquecíveis
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
                Aceitamos Encomendas para Aniversários, Festas e Eventos
              </h2>
              <p className="text-sm sm:text-base text-[#FDECEF]/90 leading-relaxed max-w-2xl">
                Surpreenda seus convidados com a sensação das Balas Baiana. Oferecemos centos para mesas de doces, caixas personalizadas para lembrancinhas e bandejas mistas com os sabores favoritos da Doçuras da Angel.
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-semibold text-[#FDECEF]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
                  <span>Embalagens Personalizadas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
                  <span>Centos com Desconto Especial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24]" />
                  <span>Agendamento de Data</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Button
                variant="caramel"
                size="lg"
                className="w-full cursor-pointer bg-[#F59E0B] text-[#33161E] hover:bg-[#D97706] font-bold"
                asChild
              >
                <Link href="/encomendas">
                  <span>Solicitar Orçamento</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2.5 px-4 rounded-xl border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Conversar pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Como Comprar (Etapas Transparentes) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">
            Simples & Direto
          </span>
          <h2 className="font-serif-title text-3xl font-bold text-[#33161E]">
            Como Fazer Seu Pedido
          </h2>
          <p className="text-sm text-[#6E4D55]">
            Escolha pelo site ou nos chame no WhatsApp para encomendas especiais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#EED7DC] p-6 space-y-3 text-left shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FDECEF] text-[#6E2637] font-serif-title font-bold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="font-serif-title font-bold text-base text-[#33161E]">
              Escolha os Sabores
            </h3>
            <p className="text-xs text-[#6E4D55] leading-relaxed">
              Defina as porções desejadas: caixas de degustação com 6 unidades, caixas de 12 e 25 ou o cento para festas.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EED7DC] p-6 space-y-3 text-left shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FDECEF] text-[#6E2637] font-serif-title font-bold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="font-serif-title font-bold text-base text-[#33161E]">
              Defina a Entrega ou Retirada
            </h3>
            <p className="text-xs text-[#6E4D55] leading-relaxed">
              Retire com horário marcado no ateliê ou agende a entrega cuidadosa no seu endereço.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#EED7DC] p-6 space-y-3 text-left shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FDECEF] text-[#6E2637] font-serif-title font-bold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="font-serif-title font-bold text-base text-[#33161E]">
              Saboreie Doces Fresquinhos
            </h3>
            <p className="text-xs text-[#6E4D55] leading-relaxed">
              Receba suas balas baiana no ponto perfeito, com caramelo estaladiço e recheio cremoso incomparável.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Perguntas Frequentes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#E65A78]">
            Tire Suas Dúvidas
          </span>
          <h2 className="font-serif-title text-3xl font-bold text-[#33161E]">
            Dúvidas Frequentes
          </h2>
          <p className="text-sm text-[#6E4D55]">
            Informações sobre o ponto do caramelo, conservação, pedidos e festas.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EED7DC] p-6 text-left space-y-2 shadow-xs"
            >
              <h3 className="font-serif-title font-bold text-base text-[#33161E]">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E4D55] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
